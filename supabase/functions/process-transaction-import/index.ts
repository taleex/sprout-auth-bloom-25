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

function parseCSVManually(content: string): TransactionData[] {
  const lines = content.split('\n').filter(line => line.trim());
  const transactions: TransactionData[] = [];
  
  // Skip header row if it exists
  const startIndex = lines[0]?.toLowerCase().includes('date') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Basic CSV parsing (handle quotes and commas)
    const columns = parseCSVLine(line);
    
    if (columns.length >= 3) {
      const [dateStr, description, amountStr] = columns;
      
      // Try to parse date
      const date = parseDate(dateStr);
      if (!date) continue;
      
      // Try to parse amount
      const amount = parseFloat(amountStr.replace(/[,$]/g, ''));
      if (isNaN(amount)) continue;
      
      transactions.push({
        date: date,
        description: description.trim(),
        amount: amount,
        category: 'uncategorized'
      });
    }
  }
  
  return transactions;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function parseDate(dateStr: string): string | null {
  // Try different date formats
  const formats = [
    /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
    /(\d{2}\/\d{2}\/\d{4})/, // MM/DD/YYYY
    /(\d{2}-\d{2}-\d{4})/, // MM-DD-YYYY
    /(\d{2}\.\d{2}\.\d{4})/, // MM.DD.YYYY
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      const date = new Date(match[1]);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
  }
  
  return null;
}

async function processWithAI(fileContent: string, apiKey: string, categoryNames: string): Promise<TransactionData[]> {
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

  if (!response.ok) {
    throw new Error('Failed to process file with AI');
  }

  const result = await response.json();
  const content = result.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content returned from AI');
  }

  // Extract JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  const jsonStr = jsonMatch ? jsonMatch[0] : content;
  
  return JSON.parse(jsonStr);
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

    const { fileContent, fileName, accountId, integrationType = 'openai' } = await req.json();

    // Get user's existing categories for better categorization
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('name, type')
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const categoryNames = categories?.map(c => c.name).join(', ') || 'groceries, restaurants, gas, utilities, shopping, entertainment, healthcare, transportation';

    console.log('Processing file:', fileName, 'with type:', integrationType);

    let transactions: TransactionData[];

    if (integrationType === 'manual') {
      // Manual processing - basic CSV parsing
      transactions = parseCSVManually(fileContent);
    } else {
      // AI processing with OpenAI
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

      transactions = await processWithAI(fileContent, decryptedKey, categoryNames);
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