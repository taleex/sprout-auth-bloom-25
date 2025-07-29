import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import InvestmentsHeader from '@/components/investments/InvestmentsHeader';
import InvestmentAccountsList from '@/components/investments/InvestmentAccountsList';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';

const Investments = () => {
  // Enable real-time price updates
  useRealTimePrices();

  return (
    <PageLayout title="Investments">
      <div className="space-y-6">
        <InvestmentsHeader />
        <InvestmentAccountsList />
      </div>
    </PageLayout>
  );
};

export default Investments;