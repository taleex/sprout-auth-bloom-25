import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialInsightsProps {
  metrics: {
    savingsRate: number;
  };
  expensesByCategory: Array<{ category: string }>;
  accountBalances: Array<{ key: string }>;
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ 
  metrics, 
  expensesByCategory, 
  accountBalances 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Emergency Fund</span>
              <span className="text-sm font-semibold text-green-600">Good</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Savings Rate</span>
              <span className={`text-sm font-semibold ${metrics.savingsRate > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                {metrics.savingsRate > 20 ? 'Excellent' : 'Needs Improvement'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expense Control</span>
              <span className="text-sm font-semibold text-blue-600">Moderate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              • Your highest expense category is <span className="font-semibold text-foreground">
                {expensesByCategory[0]?.category || 'N/A'}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              • You have <span className="font-semibold text-foreground">{accountBalances.length}</span> active accounts
            </p>
            <p className="text-sm text-muted-foreground">
              • Your savings rate is <span className={`font-semibold ${metrics.savingsRate > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                {metrics.savingsRate.toFixed(1)}%
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInsights;