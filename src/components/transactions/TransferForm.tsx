
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Form state
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

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
    
    if (!sourceAccountId || !destinationAccountId || !amount) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Source and destination accounts must be different',
      });
      return;
    }

    const transferAmount = parseFloat(amount);
    const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
    
    if (sourceAccount && sourceAccount.balance < transferAmount) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Insufficient balance in source account',
      });
      return;
    }

    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      // Create transfer record
      const transferData = {
        user_id: user.id,
        source_account_id: sourceAccountId,
        destination_account_id: destinationAccountId,
        amount: transferAmount,
        notes: notes.trim() || null,
      };

      const { data: transfer, error: transferError } = await supabase
        .from('transfers')
        .insert(transferData)
        .select()
        .single();

      if (transferError) throw transferError;

      // Create two transactions: one expense from source, one income to destination
      const transactions = [
        {
          user_id: user.id,
          account_id: sourceAccountId,
          amount: transferAmount,
          type: 'expense',
          transaction_type: 'transfer',
          description: `Transfer to ${accounts.find(acc => acc.id === destinationAccountId)?.name}`,
          notes: notes.trim() || null,
          date: new Date().toISOString(),
          source_account_id: sourceAccountId,
          destination_account_id: destinationAccountId,
        },
        {
          user_id: user.id,
          account_id: destinationAccountId,
          amount: transferAmount,
          type: 'income',
          transaction_type: 'transfer',
          description: `Transfer from ${accounts.find(acc => acc.id === sourceAccountId)?.name}`,
          notes: notes.trim() || null,
          date: new Date().toISOString(),
          source_account_id: sourceAccountId,
          destination_account_id: destinationAccountId,
        },
      ];

      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(transactions);

      if (transactionsError) throw transactionsError;

      // Update account balances using RPC function
      const { error: sourceError } = await supabase.rpc('update_account_balance', {
        account_id: sourceAccountId,
        amount_change: -transferAmount
      });

      if (sourceError) throw sourceError;

      const { error: destError } = await supabase.rpc('update_account_balance', {
        account_id: destinationAccountId,
        amount_change: transferAmount
      });

      if (destError) throw destError;

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['transactions', user.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });

      toast({
        title: 'Success',
        description: 'Transfer completed successfully',
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error creating transfer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create transfer',
      });
    } finally {
      setLoading(false);
    }
  };

  const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
  const destinationAccount = accounts.find(acc => acc.id === destinationAccountId);

  return (
    <Card className="bg-card shadow-sm border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer Flow Visualization */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-xl">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">From</div>
              <div className="font-medium text-foreground">
                {sourceAccount ? sourceAccount.name : 'Source Account'}
              </div>
              {sourceAccount && (
                <div className="text-sm text-muted-foreground">
                  {sourceAccount.balance.toFixed(2)} {sourceAccount.currency}
                </div>
              )}
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">To</div>
              <div className="font-medium text-foreground">
                {destinationAccount ? destinationAccount.name : 'Destination Account'}
              </div>
              {destinationAccount && (
                <div className="text-sm text-muted-foreground">
                  {destinationAccount.balance.toFixed(2)} {destinationAccount.currency}
                </div>
              )}
            </div>
          </div>

          {/* Source Account */}
          <div className="space-y-2">
            <Label htmlFor="source-account">From Account *</Label>
            <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem 
                    key={account.id} 
                    value={account.id}
                    disabled={account.id === destinationAccountId}
                  >
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

          {/* Destination Account */}
          <div className="space-y-2">
            <Label htmlFor="destination-account">To Account *</Label>
            <Select value={destinationAccountId} onValueChange={setDestinationAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem 
                    key={account.id} 
                    value={account.id}
                    disabled={account.id === sourceAccountId}
                  >
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
            {sourceAccount && amount && parseFloat(amount) > sourceAccount.balance && (
              <p className="text-sm text-red-500">
                Insufficient balance (Available: {sourceAccount.balance.toFixed(2)} {sourceAccount.currency})
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Transfer Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional transfer description..."
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
              disabled={loading || !sourceAccountId || !destinationAccountId || !amount}
            >
              {loading ? 'Processing...' : 'Complete Transfer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
