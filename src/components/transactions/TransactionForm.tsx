
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { TransactionCategorySelector } from './form/TransactionCategorySelector';
import { TransactionTagManager } from './form/TransactionTagManager';
import { TransactionPhotoUpload } from './form/TransactionPhotoUpload';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface TransactionFormProps {
  type: 'expense' | 'income';
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Form state
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, balance, currency')
        .eq('is_archived', false);

      if (error) throw error;
      setAccounts(data || []);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch accounts',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId || !amount || !categoryId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      // Upload photo if selected
      let photoUrl = null;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('transaction-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('transaction-photos')
          .getPublicUrl(fileName);
        
        photoUrl = urlData.publicUrl;
      }

      // Create transaction
      const transactionData = {
        user_id: user.id,
        account_id: accountId,
        category_id: categoryId,
        amount: parseFloat(amount),
        type,
        transaction_type: 'manual',
        description: description.trim() || null,
        notes: notes.trim() || null,
        date: date.toISOString(),
        photo_url: photoUrl,
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Add tags if selected
      if (selectedTags.length > 0) {
        const tagLinks = selectedTags.map(tagId => ({
          transaction_id: transaction.id,
          tag_id: tagId,
        }));

        const { error: tagsError } = await supabase
          .from('transaction_tags')
          .insert(tagLinks);

        if (tagsError) throw tagsError;
      }

      // Update account balance using the RPC function
      const balanceChange = type === 'expense' ? -parseFloat(amount) : parseFloat(amount);
      const { error: balanceError } = await supabase.rpc('update_account_balance', {
        account_id: accountId,
        amount_change: balanceChange
      });

      if (balanceError) throw balanceError;

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['transactions', user.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });

      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create transaction',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card shadow-sm border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selector */}
          <div className="space-y-2">
            <Label htmlFor="account">Account *</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {account.balance.toFixed(2)} {account.currency}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Category Selector */}
          <TransactionCategorySelector
            type={type}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tags */}
          <TransactionTagManager
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />

          {/* Photo Upload */}
          <TransactionPhotoUpload
            photoFile={photoFile}
            onPhotoChange={setPhotoFile}
          />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#cbf587] text-black hover:bg-[#b8e574]"
              disabled={loading}
            >
              {loading ? 'Creating...' : `Create ${type === 'expense' ? 'Expense' : 'Income'}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
