
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TransactionSummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  isLoading: boolean;
}

export const TransactionSummaryCards = ({
  totalIncome,
  totalExpenses,
  netBalance,
  isLoading
}: TransactionSummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Income */}
      <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">€{totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">€{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Balance */}
      <Card className={`bg-white shadow-sm border-l-4 ${netBalance >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Net Balance</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                €{netBalance.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-full`}>
              <DollarSign className={`h-6 w-6 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
