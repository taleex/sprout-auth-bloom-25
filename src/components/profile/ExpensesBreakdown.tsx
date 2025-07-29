
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpensesBreakdownProps {
  expensesByCategory: ExpenseCategory[];
  formatCurrency: (amount: number) => string;
}

const ExpensesBreakdown: React.FC<ExpensesBreakdownProps> = ({ 
  expensesByCategory, 
  formatCurrency 
}) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500'
  ];

  if (expensesByCategory.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Expenses Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Expenses Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expensesByCategory.slice(0, 5).map((category, index) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
                <p className="text-xs text-gray-500">{category.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesBreakdown;
