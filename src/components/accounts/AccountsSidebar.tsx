
import React from 'react';
import { Account } from '@/types/accounts';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeftRight } from 'lucide-react';
import BalanceSummary from '@/components/dashboard/BalanceSummary';
import InlineTransferForm from '@/components/accounts/InlineTransferForm';

interface AccountsSidebarProps {
  accounts: Account[];
  isCreatingAccount: boolean;
  isTransferOpen: boolean;
  onNewAccount: () => void;
  onOpenTransfer: () => void;
  onCloseTransfer: () => void;
  onTransferSuccess: () => void;
}

const AccountsSidebar: React.FC<AccountsSidebarProps> = ({
  accounts,
  isCreatingAccount,
  isTransferOpen,
  onNewAccount,
  onOpenTransfer,
  onCloseTransfer,
  onTransferSuccess,
}) => {
  return (
    <div>
      <BalanceSummary />
      <div className="mt-4 space-y-2">
        <Button 
          onClick={onNewAccount} 
          className="w-full" 
          size="lg"
          disabled={isCreatingAccount}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Account
        </Button>
        <Button
          onClick={isTransferOpen ? onCloseTransfer : onOpenTransfer}
          variant={isTransferOpen ? "secondary" : "outline"}
          className="w-full"
          size="lg"
          disabled={accounts.filter(a => !a.is_archived).length < 2}
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          {isTransferOpen ? 'Cancel Transfer' : 'Transfer Money'}
        </Button>
      </div>

      {/* Inline Transfer Form */}
      {isTransferOpen && (
        <InlineTransferForm
          accounts={accounts.filter(a => !a.is_archived)}
          onSuccess={() => {
            onTransferSuccess();
            onCloseTransfer();
          }}
          onCancel={onCloseTransfer}
        />
      )}
    </div>
  );
};

export default AccountsSidebar;
