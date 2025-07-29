
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/bills';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface ProjectionTableProps {
  title: string;
  bills: Bill[];
  getBillAmountForMonth: (bill: Bill, monthIndex: number) => number;
  getMonthlyTotal: (monthIndex: number, type: 'expense' | 'income') => number;
  getBillYearlyTotal: (bill: Bill) => number;
  getGrandTotal: (type: 'expense' | 'income') => number;
  type: 'expense' | 'income';
  icon: React.ReactNode;
  badgeColor: string;
}

const ProjectionTable: React.FC<ProjectionTableProps> = ({ 
  title, 
  bills, 
  getBillAmountForMonth, 
  getMonthlyTotal, 
  getBillYearlyTotal, 
  getGrandTotal, 
  type,
  icon,
  badgeColor
}) => {
  const formatCurrency = (amount: number) => `€ ${amount.toFixed(2)}`;

  if (bills.length === 0) {
    return (
      <Card className="rounded-3xl shadow-sm border-0 bg-card">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <div className="w-2 h-8 bg-[#cbf587] rounded-full"></div>
            {title}
            <Badge className={`ml-auto text-xs font-medium ${badgeColor}`}>
              {type === 'expense' ? 'Expenses' : 'Income'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              {icon}
            </div>
            <p className="text-muted-foreground text-lg">
              No {type === 'expense' ? 'expenses' : 'income'} configured yet
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              Add some bills above to see projections
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-sm border-0 bg-card">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-8 bg-[#cbf587] rounded-full"></div>
          {title}
          <Badge className={`ml-auto text-xs font-medium ${badgeColor}`}>
            {type === 'expense' ? 'Expenses' : 'Income'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-3 font-semibold text-foreground sticky left-0 bg-background">Bill Name</th>
                {MONTHS.map(month => (
                  <th key={month} className="text-center py-4 px-3 font-semibold text-foreground min-w-24">
                    {month.slice(0, 3)}
                  </th>
                ))}
                <th className="text-center py-4 px-3 font-semibold text-black bg-[#cbf587] min-w-24 rounded-lg">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-3 font-medium text-foreground sticky left-0 bg-background">{bill.name}</td>
                  {MONTHS.map((_, monthIndex) => {
                    const amount = getBillAmountForMonth(bill, monthIndex);
                    return (
                      <td key={monthIndex} className="text-center py-4 px-3 text-muted-foreground">
                        {amount > 0 ? formatCurrency(amount) : '—'}
                      </td>
                    );
                  })}
                  <td className="text-center py-4 px-3 bg-[#cbf587] font-semibold text-black rounded-lg">
                    {formatCurrency(getBillYearlyTotal(bill))}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-muted/50">
                <td className="py-4 px-3 font-bold text-foreground sticky left-0 bg-muted/50">Monthly Total</td>
                {MONTHS.map((_, monthIndex) => (
                  <td key={monthIndex} className="text-center py-4 px-3 font-semibold text-foreground">
                    {formatCurrency(getMonthlyTotal(monthIndex, type))}
                  </td>
                ))}
                <td className="text-center py-4 px-3 bg-[#cbf587] font-bold text-black rounded-lg">
                  {formatCurrency(getGrandTotal(type))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionTable;
