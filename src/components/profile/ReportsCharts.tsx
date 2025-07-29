import React from 'react';
import IncidentSummaryCard from '@/components/ui/horizontal-bar-chart';
import CustomLineChart from '@/components/ui/line-chart';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, BarChart3 } from 'lucide-react';

interface ReportsChartsProps {
  accountBalances: Array<{ key: string; data: number }>;
  monthlyTrends: Array<{ month: string; [key: string]: string | number }>;
  metrics: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
  };
  formatCurrency: (amount: number) => string;
}

const ReportsCharts: React.FC<ReportsChartsProps> = ({ 
  accountBalances, 
  monthlyTrends, 
  metrics, 
  formatCurrency 
}) => {
  // Prepare data for horizontal bar chart
  const chartMetrics = [
    {
      id: 'totalBalance',
      iconSvg: <Wallet className="h-5 w-5" fill="#40D3F4" />,
      label: 'Total Balance',
      value: formatCurrency(metrics.totalBalance),
      trendIconSvg: metrics.totalBalance > 0 ? 
        <TrendingUp className="h-5 w-5 text-green-500" /> : 
        <TrendingDown className="h-5 w-5 text-red-500" />,
      delay: 0,
    },
    {
      id: 'monthlyIncome',
      iconSvg: <DollarSign className="h-5 w-5" fill="#40E5D1" />,
      label: 'Monthly Income',
      value: formatCurrency(metrics.monthlyIncome),
      trendIconSvg: <TrendingUp className="h-5 w-5 text-green-500" />,
      delay: 0.05,
    },
    {
      id: 'monthlyExpenses',
      iconSvg: <BarChart3 className="h-5 w-5" fill="#E84045" />,
      label: 'Monthly Expenses',
      value: formatCurrency(metrics.monthlyExpenses),
      trendIconSvg: <TrendingUp className="h-5 w-5 text-red-500" />,
      delay: 0.1,
    },
    {
      id: 'savingsRate',
      iconSvg: <PiggyBank className="h-5 w-5" fill="#9152EE" />,
      label: 'Savings Rate',
      value: `${metrics.savingsRate.toFixed(1)}%`,
      trendIconSvg: metrics.savingsRate > 20 ? 
        <TrendingUp className="h-5 w-5 text-green-500" /> : 
        <TrendingDown className="h-5 w-5 text-orange-500" />,
      delay: 0.15,
    },
  ];

  const lineChartData = monthlyTrends.map(trend => ({
    month: trend.month,
    Income: Number(trend.income) || 0,
    Expenses: Number(trend.expenses) || 0,
    'Net Savings': Number(trend.net) || 0,
  }));

  const lineChartLines = [
    { dataKey: 'Income', color: '#40E5D1', name: 'Income' },
    { dataKey: 'Expenses', color: '#E84045', name: 'Expenses' },
    { dataKey: 'Net Savings', color: '#9152EE', name: 'Net Savings' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Account Balance Overview */}
      <div className="flex justify-center">
        <IncidentSummaryCard
          title="Account Balance Overview"
          data={accountBalances}
          metrics={chartMetrics}
        />
      </div>

      {/* Monthly Trends */}
      <div className="flex flex-col space-y-6">
        <CustomLineChart
          data={lineChartData}
          lines={lineChartLines}
          title="Monthly Financial Trends"
          height={300}
        />
      </div>
    </div>
  );
};

export default ReportsCharts;