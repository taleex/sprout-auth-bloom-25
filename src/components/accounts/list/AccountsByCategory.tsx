
import React, { memo, useMemo } from 'react';
import { Account } from '@/types/accounts';
import AccountCard from './AccountCard';
import InlineAccountForm from '../InlineAccountForm';

interface AccountsByCategoryProps {
  categoryName: string;
  accounts: Account[];
  editingAccountId: string | null;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onToggleVisibility: (id: string, hide_balance: boolean) => Promise<void>;
  onSaveEdit: (account: Partial<Account>) => void;
  onCancelEdit: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
  accountTypeMap: Record<string, { label: string; color: string }>;
}

const AccountsByCategory: React.FC<AccountsByCategoryProps> = memo(({
  categoryName,
  accounts,
  editingAccountId,
  onEdit,
  onDelete,
  onToggleVisibility,
  onSaveEdit,
  onCancelEdit,
  formatCurrency,
  accountTypeMap
}) => {
  const typeInfo = useMemo(() => 
    accountTypeMap[categoryName] || { label: 'Other', color: 'bg-gray-100 text-gray-800' }, 
    [accountTypeMap, categoryName]
  );
  
  const displayName = useMemo(() => 
    typeInfo.label || categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
    [typeInfo.label, categoryName]
  );

  const renderedAccounts = useMemo(() => {
    return accounts.map((account) => {
      // If this account is being edited
      if (editingAccountId === account.id) {
        return (
          <InlineAccountForm
            key={account.id}
            initialValues={account}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        );
      }
      
      return (
        <AccountCard
          key={account.id}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
          formatCurrency={formatCurrency}
          accountTypeMap={accountTypeMap}
        />
      );
    });
  }, [accounts, editingAccountId, onEdit, onDelete, onToggleVisibility, onSaveEdit, onCancelEdit, formatCurrency, accountTypeMap]);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground capitalize">
        {displayName} Accounts
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderedAccounts}
      </div>
    </div>
  );
});

export default AccountsByCategory;
