import React from 'react';
import { useReportsData } from '@/hooks/useReportsData';
import MetricsOverview from './MetricsOverview';
import BudgetCalculator from './BudgetCalculator';
import ExpensesBreakdown from './ExpensesBreakdown';
import SavingsGoals from './SavingsGoals';
import CustomLineChart from '@/components/ui/line-chart';
import ReportsLoading from './ReportsLoading';
const ReportsTab = () => {
  const {
    reportsData,
    isLoading
  } = useReportsData();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  if (isLoading) {
    return <ReportsLoading />;
  }
  if (!reportsData) {
    return <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-sm sm:text-base">No financial data available</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Start by adding some transactions to see your reports.</p>
        </div>
      </div>;
  }
  const {
    monthlyTrends,
    metrics,
    expensesByCategory
  } = reportsData;

  // Prepare chart data
  const lineChartData = monthlyTrends.map(trend => ({
    month: trend.month,
    Income: Number(trend.income) || 0,
    Expenses: Number(trend.expenses) || 0,
    'Net Savings': Number(trend.net) || 0
  }));
  const lineChartLines = [{
    dataKey: 'Income',
    color: '#10b981',
    name: 'Income'
  }, {
    dataKey: 'Expenses',
    color: '#ef4444',
    name: 'Expenses'
  }, {
    dataKey: 'Net Savings',
    color: '#8b5cf6',
    name: 'Net Savings'
  }];
  return <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">Financial Reports</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your financial health and plan your budget effectively</p>
        </div>

        {/* Metrics Overview */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <MetricsOverview metrics={metrics} formatCurrency={formatCurrency} />
        </div>

        {/* Budget Calculator */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <BudgetCalculator />
        </div>

        {/* Savings Goals */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <SavingsGoals formatCurrency={formatCurrency} />
        </div>

        {/* Expenses Breakdown */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <ExpensesBreakdown expensesByCategory={expensesByCategory} formatCurrency={formatCurrency} />
        </div>
      </div>
    </div>;
};
export default ReportsTab;