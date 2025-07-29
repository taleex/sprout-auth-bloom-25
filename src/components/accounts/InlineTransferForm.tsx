
import React, { useState, useMemo } from 'react';
import { Account } from '@/types/accounts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface InlineTransferFormProps {
  accounts: Account[];
  onSuccess: () => void;
  onCancel: () => void;
}

const InlineTransferForm: React.FC<InlineTransferFormProps> = ({ 
  accounts,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [sourceAccountId, setSourceAccountId] = useState<string>('');
  const [destinationAccountId, setDestinationAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const sourceAccount = accounts.find(a => a.id === sourceAccountId);
  const destinationAccount = accounts.find(a => a.id === destinationAccountId);
  const transferAmount = parseFloat(amount) || 0;

  // Calculate preview balances
  const previewBalances = useMemo(() => {
    if (!sourceAccount || !destinationAccount || !transferAmount) {
      return null;
    }
    
    return {
      sourceAfter: sourceAccount.balance - transferAmount,
      destinationAfter: destinationAccount.balance + transferAmount
    };
  }, [sourceAccount, destinationAccount, transferAmount]);

  // Check if transfer is valid
  const isTransferValid = useMemo(() => {
    if (!sourceAccount || !destinationAccount || transferAmount <= 0) {
      return false;
    }
    
    return transferAmount <= sourceAccount.balance && sourceAccountId !== destinationAccountId;
  }, [sourceAccount, destinationAccount, transferAmount, sourceAccountId, destinationAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTransferValid || !sourceAccount || !destinationAccount) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update source account (subtract amount)
      const { error: sourceError } = await supabase
        .from('accounts')
        .update({ balance: sourceAccount.balance - transferAmount })
        .eq('id', sourceAccountId);

      if (sourceError) throw sourceError;

      // Update destination account (add amount)
      const { error: destError } = await supabase
        .from('accounts')
        .update({ balance: destinationAccount.balance + transferAmount })
        .eq('id', destinationAccountId);

      if (destError) {
        // Rollback source account if destination update fails
        await supabase
          .from('accounts')
          .update({ balance: sourceAccount.balance })
          .eq('id', sourceAccountId);
        throw destError;
      }

      // Record the transfer
      const { error: logError } = await supabase
        .from('transfers')
        .insert({
          user_id: user.id,
          source_account_id: sourceAccountId,
          destination_account_id: destinationAccountId,
          amount: transferAmount,
          notes: notes || null,
        });

      if (logError) {
        console.error('Failed to log transfer:', logError);
      }

      toast({
        title: 'Transfer successful',
        description: `Transferred €${transferAmount.toFixed(2)} from ${sourceAccount.name} to ${destinationAccount.name}`,
      });

      // Reset form
      setSourceAccountId('');
      setDestinationAccountId('');
      setAmount('');
      setNotes('');
      onSuccess();
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast({
        variant: 'destructive',
        title: 'Transfer failed',
        description: error.message || 'An error occurred during transfer',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const visibleAccounts = accounts.filter(account => !account.is_archived);

  return (
    <Card className="mt-4 border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-foreground">Transfer Money</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selection */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sourceAccount" className="text-sm font-medium text-foreground">From</Label>
              <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
                <SelectTrigger id="sourceAccount" className="h-11">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {visibleAccounts.map((account) => (
                    <SelectItem key={`source-${account.id}`} value={account.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: account.color }} 
                        />
                        <span>{account.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sourceAccount && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Available: €{sourceAccount.balance.toFixed(2)}
                  </p>
                  {previewBalances && isTransferValid && (
                    <p className="text-xs text-muted-foreground">
                      Preview: <span className="text-red-600">€{previewBalances.sourceAfter.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationAccount" className="text-sm font-medium text-foreground">To</Label>
              <Select value={destinationAccountId} onValueChange={setDestinationAccountId}>
                <SelectTrigger id="destinationAccount" className="h-11">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {visibleAccounts.map((account) => (
                    <SelectItem key={`dest-${account.id}`} value={account.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: account.color }} 
                        />
                        <span>{account.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {destinationAccount && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Current: €{destinationAccount.balance.toFixed(2)}
                  </p>
                  {previewBalances && isTransferValid && (
                    <p className="text-xs text-muted-foreground">
                      Preview: <span className="text-green-600">€{previewBalances.destinationAfter.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-foreground">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={sourceAccount?.balance || undefined}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="pl-8 h-11 text-base"
              />
            </div>
            {sourceAccount && transferAmount > sourceAccount.balance && (
              <p className="text-xs text-red-500">
                Insufficient funds. Maximum: €{sourceAccount.balance.toFixed(2)}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-foreground">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add a note for this transfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || !isTransferValid}
              className="flex-1 h-11"
            >
              {isLoading ? 'Processing...' : 'Transfer Money'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InlineTransferForm;
