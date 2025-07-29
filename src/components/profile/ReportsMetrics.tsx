import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, BarChart3 } from 'lucide-react';

interface ReportsMetricsProps {
  metrics: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
  };
  formatCurrency: (amount: number) => string;
}

const ReportsMetrics: React.FC<ReportsMetricsProps> = ({ metrics, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-card shadow-sm border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalBalance)}</p>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.monthlyIncome)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(metrics.monthlyExpenses)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.savingsRate.toFixed(1)}%</p>
            </div>
            <PiggyBank className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsMetrics;