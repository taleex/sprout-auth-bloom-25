import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpensesCategoryListProps {
  expensesByCategory: ExpenseCategory[];
  formatCurrency: (amount: number) => string;
}

const ExpensesCategoryList: React.FC<ExpensesCategoryListProps> = ({ 
  expensesByCategory, 
  formatCurrency 
}) => {
  const colors = ['#9152EE', '#40D3F4', '#40E5D1', '#4C86FF', '#F08083'];

  return (
    <Card className="bg-card shadow-sm border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expensesByCategory.slice(0, 5).map((category, index) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm font-medium text-foreground">{category.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCurrency(category.amount)}</p>
                <p className="text-xs text-muted-foreground">{category.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesCategoryList;