import React from 'react';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import InvestmentAccountCard from './InvestmentAccountCard';
import EmptyInvestmentsMessage from './EmptyInvestmentsMessage';

const InvestmentAccountsList = () => {
  const { accounts, loading, error } = useInvestmentAccounts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading investment accounts: {error.message}</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return <EmptyInvestmentsMessage />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <InvestmentAccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};

export default InvestmentAccountsList;