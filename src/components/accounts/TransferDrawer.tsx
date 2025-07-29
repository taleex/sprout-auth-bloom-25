
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Account } from '@/types/accounts';
import { supabase } from '@/integrations/supabase/client';

interface TransferDrawerProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onSuccess: () => void;
}

const TransferDrawer: React.FC<TransferDrawerProps> = ({ 
  open, 
  onClose, 
  accounts,
  onSuccess 
}) => {
  const { toast } = useToast();
  const [sourceAccountId, setSourceAccountId] = useState<string>('');
  const [destinationAccountId, setDestinationAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    // Reset form
    setSourceAccountId('');
    setDestinationAccountId('');
    setAmount('');
    setNotes('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid amount',
        description: 'Please enter a valid positive number',
      });
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      toast({
        variant: 'destructive',
        title: 'Invalid accounts',
        description: 'Source and destination accounts must be different',
      });
      return;
    }

    // Find source and destination accounts
    const sourceAccount = accounts.find(a => a.id === sourceAccountId);
    const destinationAccount = accounts.find(a => a.id === destinationAccountId);

    if (!sourceAccount || !destinationAccount) {
      toast({
        variant: 'destructive',
        title: 'Account not found',
        description: 'One of the selected accounts could not be found',
      });
      return;
    }

    if (sourceAccount.balance < transferAmount) {
      toast({
        variant: 'destructive',
        title: 'Insufficient funds',
        description: `Not enough funds in ${sourceAccount.name}`,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Manual transaction approach since RPC function might not exist
      // Update source account balance
      const { error: sourceError } = await supabase
        .from('accounts')
        .update({ balance: sourceAccount.balance - transferAmount })
        .eq('id', sourceAccountId);

      if (sourceError) throw sourceError;

      // Update destination account balance
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
        // Don't fail the transfer if logging fails
      }

      toast({
        title: 'Transfer successful',
        description: `Transferred ${transferAmount.toFixed(2)} ${sourceAccount.currency} from ${sourceAccount.name} to ${destinationAccount.name}`,
      });

      handleClose();
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
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Transfer Money</DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceAccount">From Account</Label>
              <Select
                value={sourceAccountId}
                onValueChange={setSourceAccountId}
              >
                <SelectTrigger id="sourceAccount">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {visibleAccounts.map((account) => (
                    <SelectItem key={`source-${account.id}`} value={account.id}>
                      {account.name} ({account.balance.toFixed(2)} {account.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationAccount">To Account</Label>
              <Select
                value={destinationAccountId}
                onValueChange={setDestinationAccountId}
              >
                <SelectTrigger id="destinationAccount">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {visibleAccounts.map((account) => (
                    <SelectItem key={`dest-${account.id}`} value={account.id}>
                      {account.name} ({account.balance.toFixed(2)} {account.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add a note for this transfer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DrawerFooter className="px-0 pt-4">
              <Button type="submit" disabled={isLoading || !sourceAccountId || !destinationAccountId || !amount}>
                {isLoading ? 'Processing...' : 'Transfer Money'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TransferDrawer;
