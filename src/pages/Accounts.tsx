
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Account } from '@/types/accounts';
import AccountsHeader from '@/components/accounts/AccountsHeader';
import AccountsMainContent from '@/components/accounts/AccountsMainContent';
import AccountsSidebar from '@/components/accounts/AccountsSidebar';
import { useAccountsData } from '@/hooks/useAccountsData';
import { useAccountsActions } from '@/hooks/useAccountsActions';

const Accounts = () => {
  const { accounts, isLoading, fetchAccounts } = useAccountsData();
  const { handleSaveAccount, handleDelete, handleToggleVisibility } = useAccountsActions(fetchAccounts);
  
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState<string | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const handleEdit = (account: Account) => {
    setIsEditingAccount(account.id);
  };

  const handleNewAccount = () => {
    setIsCreatingAccount(true);
  };

  const handleSaveEdit = async (accountData: Partial<Account>) => {
    await handleSaveAccount(accountData);
    setIsCreatingAccount(false);
    setIsEditingAccount(null);
  };

  const handleCancelEdit = () => {
    setIsCreatingAccount(false);
    setIsEditingAccount(null);
  };

  return (
    <div className="min-h-screen bg-finapp-background">
      <Navbar />
      <div className="container py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AccountsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <AccountsMainContent
              accounts={accounts}
              isLoading={isLoading}
              isCreatingAccount={isCreatingAccount}
              isEditingAccount={isEditingAccount}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div className="lg:col-span-1">
            <AccountsSidebar
              accounts={accounts}
              isCreatingAccount={isCreatingAccount}
              isTransferOpen={isTransferOpen}
              onNewAccount={handleNewAccount}
              onOpenTransfer={() => setIsTransferOpen(true)}
              onCloseTransfer={() => setIsTransferOpen(false)}
              onTransferSuccess={fetchAccounts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
