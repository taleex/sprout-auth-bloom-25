import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category?: string;
  merchant?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { fileContent, fileName, accountId } = await req.json();

    // Get user's OpenAI API key
    const { data: apiKeyData, error: keyError } = await supabaseClient
      .from('user_api_keys')
      .select('api_key_encrypted')
      .eq('user_id', user.id)
      .eq('service_name', 'openai')
      .eq('is_active', true)
      .single();

    if (keyError || !apiKeyData) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not found. Please add your OpenAI API key in Profile > Integrations.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt the API key
    const { data: decryptedKey, error: decryptError } = await supabaseClient
      .rpc('decrypt_api_key', { encrypted_key: apiKeyData.api_key_encrypted });

    if (decryptError || !decryptedKey) {
      return new Response(JSON.stringify({ error: 'Failed to decrypt API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's existing categories for better categorization
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('name, type')
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const categoryNames = categories?.map(c => c.name).join(', ') || 'groceries, restaurants, gas, utilities, shopping, entertainment, healthcare, transportation';

    console.log('Processing file:', fileName);
    console.log('File content preview:', fileContent.substring(0, 500));

    // Create prompt for OpenAI to parse the transaction data
    const prompt = `
You are a financial data parser. Parse the following bank statement/transaction data and extract individual transactions.

Input data (could be CSV, PDF text, or other format):
${fileContent}

Available categories: ${categoryNames}

Return a JSON array of transactions with this exact structure:
[
  {
    "date": "YYYY-MM-DD",
    "description": "cleaned transaction description",
    "amount": -123.45,
    "category": "best matching category from the list",
    "merchant": "merchant name if identifiable",
    "confidence": 0.95
  }
]

Rules:
1. Amount should be negative for expenses, positive for income
2. Date must be in YYYY-MM-DD format
3. Clean up descriptions (remove extra spaces, codes)
4. Only include actual transactions, skip headers/footers
5. If unsure about category, use your best judgment from the available categories
6. Include confidence score (0-1) for each transaction
7. Return only valid JSON, no additional text

Parse the data now:`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial data parser. Always return valid JSON and focus on accuracy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Failed to process file with AI',
        details: errorData
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResult = await openAIResponse.json();
    const aiContent = aiResult.choices[0]?.message?.content;

    if (!aiContent) {
      return new Response(JSON.stringify({ error: 'No content returned from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI response:', aiContent);

    let transactions: TransactionData[];
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiContent;
      transactions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        details: aiContent,
        parseError: parseError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate and clean up transactions
    const validTransactions = transactions.filter(t => {
      return t.date && t.description && typeof t.amount === 'number';
    });

    console.log(`Parsed ${validTransactions.length} valid transactions from ${transactions.length} total`);

    // Get category IDs for the transactions
    const transactionsWithCategoryIds = await Promise.all(
      validTransactions.map(async (transaction) => {
        if (!transaction.category) return transaction;

        const { data: categoryData } = await supabaseClient
          .from('categories')
          .select('id')
          .eq('name', transaction.category)
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .single();

        return {
          ...transaction,
          category_id: categoryData?.id || null
        };
      })
    );

    return new Response(JSON.stringify({ 
      success: true,
      transactions: transactionsWithCategoryIds,
      count: validTransactions.length,
      fileName: fileName
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-transaction-import function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});