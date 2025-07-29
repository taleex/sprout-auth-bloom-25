import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BillsManagement from '@/components/bills/BillsManagement';
import YearlyNetProjection from '@/components/bills/YearlyNetProjection';
import { useBillsData } from '@/hooks/useBillsData';
const Bills = () => {
  const {
    bills,
    isLoading,
    addBill,
    updateBill,
    deleteBill
  } = useBillsData();
  const expenseBills = bills.filter(bill => bill.type === 'expense');
  const incomeBills = bills.filter(bill => bill.type === 'income');
  return <div className="min-h-screen bg-finapp-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Clean Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-finapp-foreground">Recurring Transactions</h1>
          <p className="mt-1 text-muted-foreground">Manage your recurring income and expenses with forecasting</p>
        </div>

        {/* Bills Management */}
        <div className="mb-8">
          <BillsManagement bills={bills} isLoading={isLoading} onSaveBill={addBill} onUpdateBill={updateBill} onDeleteBill={deleteBill} />
        </div>

        {/* Yearly Net Projection */}
        <div className="w-full">
          <YearlyNetProjection incomeBills={incomeBills} expenseBills={expenseBills} />
        </div>
      </main>
    </div>;
};
export default Bills;