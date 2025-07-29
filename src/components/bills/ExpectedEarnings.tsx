
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { Bill } from '@/types/bills';
import { useIsMobile } from '@/hooks/use-mobile';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ExpectedEarningsProps {
  bills: Bill[];
}

const ExpectedEarnings: React.FC<ExpectedEarningsProps> = ({ bills }) => {
  const isMobile = useIsMobile();
  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  const getBillAmountForMonth = (bill: Bill, monthIndex: number) => {
    const currentYear = new Date().getFullYear();
    
    switch (bill.repeat_pattern) {
      case 'monthly':
        return bill.amount;
      case 'yearly':
        const startMonth = new Date(bill.start_date).getMonth();
        return monthIndex === startMonth ? bill.amount : 0;
      case 'weekly':
        const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
        const weeksInMonth = Math.floor(daysInMonth / 7);
        return bill.amount * weeksInMonth;
      case 'biweekly':
        const biweeklyOccurrences = Math.floor(new Date(currentYear, monthIndex + 1, 0).getDate() / 14);
        return bill.amount * biweeklyOccurrences;
      case 'bimonthly':
        return monthIndex % 2 === 0 ? bill.amount : 0;
      case 'quarterly':
        return monthIndex % 3 === 0 ? bill.amount : 0;
      default:
        return 0;
    }
  };

  const getBillYearlyTotal = (bill: Bill) => {
    let total = 0;
    for (let i = 0; i < 12; i++) {
      total += getBillAmountForMonth(bill, i);
    }
    return total;
  };

  const getMonthlyTotal = (monthIndex: number) => {
    return bills.reduce((total, bill) => total + getBillAmountForMonth(bill, monthIndex), 0);
  };

  const getGrandTotal = () => {
    return bills.reduce((total, bill) => total + getBillYearlyTotal(bill), 0);
  };

  if (bills.length === 0) {
    return (
      <div className="bg-card border border-finapp-border rounded-xl shadow-sm">
        <div className="p-6 border-b border-finapp-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Expected Earnings</h3>
                <p className="text-sm text-muted-foreground">Income projections</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Income
            </Badge>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">No income sources</h4>
          <p className="text-sm text-muted-foreground">Add salary, freelance, or other income sources to see projections</p>
        </div>
      </div>
    );
  }

  // Mobile/Column Layout
  if (isMobile) {
    return (
      <div className="bg-card border border-finapp-border rounded-xl shadow-sm">
        <div className="p-6 border-b border-finapp-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Expected Earnings</h3>
                <p className="text-sm text-muted-foreground">Income projections</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              {formatCurrency(getGrandTotal())} / year
            </Badge>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {bills.map((bill) => (
            <div key={bill.id} className="border border-finapp-border/30 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-foreground">{bill.name}</span>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  {formatCurrency(getBillYearlyTotal(bill))}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTH_NAMES.map((month, monthIndex) => {
                  const amount = getBillAmountForMonth(bill, monthIndex);
                  return (
                    <div key={monthIndex} className="text-center p-2 rounded bg-finapp-muted/20">
                      <div className="text-xs text-muted-foreground mb-1">{month}</div>
                      <div className="text-sm font-medium text-green-600">
                        {amount > 0 ? formatCurrency(amount) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="border-t border-finapp-border/50 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-green-800">Monthly Totals</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                {formatCurrency(getGrandTotal())}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((month, monthIndex) => (
                <div key={monthIndex} className="text-center p-2 rounded bg-green-50">
                  <div className="text-xs text-green-600 mb-1">{month}</div>
                  <div className="text-sm font-medium text-green-700">
                    {formatCurrency(getMonthlyTotal(monthIndex))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Row Layout
  return (
    <div className="bg-card border border-finapp-border rounded-xl shadow-sm">
      <div className="p-6 border-b border-finapp-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Expected Earnings</h3>
              <p className="text-sm text-muted-foreground">Income projections</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            {formatCurrency(getGrandTotal())} / year
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="border border-finapp-border/30 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-finapp-muted/30">
                    <th className="text-left py-4 px-4 font-semibold text-foreground border-b border-finapp-border/30 sticky left-0 bg-finapp-muted/30 z-10 min-w-40">
                      Income Source
                    </th>
                    {MONTH_NAMES.map(month => (
                      <th key={month} className="text-center py-4 px-3 font-medium text-muted-foreground border-b border-finapp-border/30 min-w-20">
                        {month}
                      </th>
                    ))}
                    <th className="text-center py-4 px-4 font-semibold text-foreground border-b border-finapp-border/30 bg-green-50/50 min-w-24">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, index) => (
                    <tr key={bill.id} className={`hover:bg-finapp-muted/20 transition-colors ${index !== bills.length - 1 ? 'border-b border-finapp-border/20' : ''}`}>
                      <td className="py-4 px-4 font-medium text-foreground sticky left-0 bg-card z-10 border-r border-finapp-border/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          {bill.name}
                        </div>
                      </td>
                      {MONTH_NAMES.map((_, monthIndex) => {
                        const amount = getBillAmountForMonth(bill, monthIndex);
                        return (
                          <td key={monthIndex} className="text-center py-4 px-3 text-green-600 font-medium">
                            {amount > 0 ? formatCurrency(amount) : '—'}
                          </td>
                        );
                      })}
                      <td className="text-center py-4 px-4 bg-green-50/50 font-semibold text-green-700">
                        {formatCurrency(getBillYearlyTotal(bill))}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-green-200 bg-green-50/30">
                    <td className="py-4 px-4 font-semibold text-green-800 sticky left-0 bg-green-50/30 z-10 border-r border-finapp-border/20">
                      Monthly Total
                    </td>
                    {MONTH_NAMES.map((_, monthIndex) => (
                      <td key={monthIndex} className="text-center py-4 px-3 font-semibold text-green-700">
                        {formatCurrency(getMonthlyTotal(monthIndex))}
                      </td>
                    ))}
                    <td className="text-center py-4 px-4 bg-green-100/70 font-bold text-green-800">
                      {formatCurrency(getGrandTotal())}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectedEarnings;
