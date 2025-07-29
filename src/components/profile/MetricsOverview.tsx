
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
  };
  formatCurrency: (amount: number) => string;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, formatCurrency }) => {
  const netIncome = metrics.monthlyIncome - metrics.monthlyExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight">{formatCurrency(metrics.totalBalance)}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-primary/20 rounded-2xl sm:rounded-3xl">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Monthly Income</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 leading-tight">{formatCurrency(metrics.monthlyIncome)}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-green-100 dark:bg-green-950 rounded-2xl sm:rounded-3xl">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Monthly Expenses</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive leading-tight">{formatCurrency(metrics.monthlyExpenses)}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-red-100 dark:bg-red-950 rounded-2xl sm:rounded-3xl">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Net Income</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold leading-tight ${netIncome >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {formatCurrency(netIncome)}
              </p>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl ${netIncome >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
              <DollarSign className={`h-5 w-5 sm:h-6 sm:w-6 ${netIncome >= 0 ? 'text-green-600' : 'text-destructive'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;
