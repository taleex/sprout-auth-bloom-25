
import React from 'react';
import { Account } from '@/types/accounts';
import AccountsList from '@/components/accounts/list/AccountsList';
import InlineAccountForm from '@/components/accounts/InlineAccountForm';

interface AccountsMainContentProps {
  accounts: Account[];
  isLoading: boolean;
  isCreatingAccount: boolean;
  isEditingAccount: string | null;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onToggleVisibility: (id: string, hide_balance: boolean) => Promise<void>;
  onSaveEdit: (account: Partial<Account>) => void;
  onCancelEdit: () => void;
}

const AccountsMainContent: React.FC<AccountsMainContentProps> = ({
  accounts,
  isLoading,
  isCreatingAccount,
  isEditingAccount,
  onEdit,
  onDelete,
  onToggleVisibility,
  onSaveEdit,
  onCancelEdit,
}) => {
  return (
    <div className="lg:col-span-2">
      {isCreatingAccount && (
        <InlineAccountForm 
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      )}
      
      <AccountsList 
        accounts={accounts} 
        isLoading={isLoading} 
        onEdit={onEdit} 
        onDelete={onDelete}
        onToggleVisibility={onToggleVisibility}
        editingAccountId={isEditingAccount}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default AccountsMainContent;
