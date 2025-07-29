
import React, { useMemo, useState } from 'react';
import { Account } from '@/types/accounts';
import AccountsByCategory from './AccountsByCategory';
import AccountsListSkeleton from './AccountsListSkeleton';
import EmptyAccountsMessage from './EmptyAccountsMessage';
import DeleteAccountDialog from './DeleteAccountDialog';
import { accountTypeMap } from './AccountTypeMap';
import { formatCurrency } from '@/lib/utils';

interface AccountsListProps {
  accounts: Account[];
  isLoading: boolean;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onToggleVisibility: (id: string, hide_balance: boolean) => Promise<void>;
  editingAccountId: string | null;
  onSaveEdit: (account: Partial<Account>) => void;
  onCancelEdit: () => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ 
  accounts, 
  isLoading, 
  onEdit, 
  onDelete, 
  onToggleVisibility,
  editingAccountId,
  onSaveEdit,
  onCancelEdit
}) => {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  
  const categoryAccounts = useMemo(() => {
    return accounts.reduce((acc: Record<string, Account[]>, account) => {
      const category = account.account_type || 'main';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(account);
      return acc;
    }, {});
  }, [accounts]);

  const handleDeleteConfirm = (accountId: string) => {
    onDelete(accountId);
    setAccountToDelete(null);
  };

  if (isLoading) {
    return <AccountsListSkeleton />;
  }

  if (accounts.length === 0) {
    return <EmptyAccountsMessage />;
  }

  // Sort categories to show main accounts first
  const orderedCategories = Object.keys(categoryAccounts).sort((a, b) => {
    if (a === 'main') return -1;
    if (b === 'main') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-8">
      {orderedCategories.map((category) => (
        <AccountsByCategory
          key={category}
          categoryName={category}
          accounts={categoryAccounts[category]}
          editingAccountId={editingAccountId}
          onEdit={onEdit}
          onDelete={(accountId) => setAccountToDelete(accountId)}
          onToggleVisibility={onToggleVisibility}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          formatCurrency={formatCurrency}
          accountTypeMap={accountTypeMap}
        />
      ))}

      {/* Delete Confirmation Dialog */}
      <DeleteAccountDialog
        accountId={accountToDelete}
        onOpenChange={(open) => !open && setAccountToDelete(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default AccountsList;
