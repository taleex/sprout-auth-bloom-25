
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CategoryData } from '@/types/transactions';

interface TransactionsChartProps {
  categoryData: CategoryData[];
  totalAmount: number;
  isLoading: boolean;
  transactionType: 'expenses' | 'income';
  title?: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#f97316', // orange  
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export const TransactionsChart = ({ 
  categoryData, 
  totalAmount, 
  isLoading,
  transactionType,
  title 
}: TransactionsChartProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = categoryData.reduce((config, item, index) => {
    config[item.category] = {
      label: item.category,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {} as any);

  const chartData = categoryData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        
        {categoryData.length > 0 ? (
          <div className="space-y-6">
            {/* Donut Chart */}
            <div className="relative">
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [`€${Number(value).toLocaleString()}`, '']}
                      />} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Center Total */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    €{totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Categories</h4>
              <div className="space-y-3">
                {categoryData.slice(0, 5).map((category, index) => (
                  <div 
                    key={category.category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {category.percentage}%
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      €{category.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              No {transactionType} found for this period
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
