import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bill } from '@/types/bills';
import { useIsMobile } from '@/hooks/use-mobile';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
interface YearlyNetProjectionProps {
  incomeBills: Bill[];
  expenseBills: Bill[];
}
const YearlyNetProjection: React.FC<YearlyNetProjectionProps> = ({
  incomeBills,
  expenseBills
}) => {
  const isMobile = useIsMobile();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
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
  const getMonthlyTotal = (monthIndex: number, type: 'income' | 'expense') => {
    const bills = type === 'income' ? incomeBills : expenseBills;
    return bills.reduce((total, bill) => total + getBillAmountForMonth(bill, monthIndex), 0);
  };
  const getGrandTotal = (type: 'income' | 'expense') => {
    const bills = type === 'income' ? incomeBills : expenseBills;
    return bills.reduce((total, bill) => total + getBillYearlyTotal(bill), 0);
  };
  const totalIncome = getGrandTotal('income');
  const totalExpenses = getGrandTotal('expense');
  const netProjection = totalIncome - totalExpenses;
  const allBills = [...incomeBills, ...expenseBills];

  // Mobile Layout with Improved UX
  if (isMobile) {
    const monthIncome = getMonthlyTotal(selectedMonth, 'income');
    const monthExpenses = getMonthlyTotal(selectedMonth, 'expense');
    const selectedMonthNet = monthIncome - monthExpenses;
    if (allBills.length === 0) {
      return <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Yearly Net Projection</CardTitle>
                <CardDescription>Combined income and expense forecast</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted">
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2">No bills configured</h4>
            <p className="text-sm text-muted-foreground">Add income and expense bills to see your net projection</p>
          </CardContent>
        </Card>;
    }
    return <Card className="bg-card mx-2 sm:mx-0">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-primary/10 shrink-0">
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl truncate">Yearly Net Projection</CardTitle>
              <CardDescription className="text-sm">Combined income and expense forecast</CardDescription>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">Income</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-600 truncate">
                  +{formatCurrency(totalIncome)}
                </p>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">Expenses</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-red-600 truncate">
                  -{formatCurrency(totalExpenses)}
                </p>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">Net</span>
                </div>
                <p className={`text-base sm:text-lg font-bold truncate ${netProjection >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netProjection)}
                </p>
              </Card>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-4 pb-4">
          <div className="space-y-4">
            {/* Yearly Summary */}
            

            {/* All Bills with Yearly Totals */}
            <div className="space-y-3 px-2">
              {allBills.map(bill => {
              const yearlyTotal = getBillYearlyTotal(bill);
              return <Card key={bill.id} className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-3 h-3 rounded-full shrink-0 ${bill.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium block text-sm sm:text-base truncate">{bill.name}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{bill.repeat_pattern}</span>
                        </div>
                      </div>
                      <span className={`font-bold text-sm sm:text-base shrink-0 ${bill.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {bill.type === 'income' ? '+' : '-'}{formatCurrency(yearlyTotal)}
                      </span>
                    </div>
                  </Card>;
            })}
            </div>
          </div>
        </CardContent>
      </Card>;
  }

  // Desktop Layout
  return <div className="bg-card rounded-xl shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-finapp-accent">
              <Calculator className="h-5 w-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Yearly Net Projection</h3>
              <p className="text-sm text-muted-foreground">Combined income and expense forecast</p>
            </div>
          </div>
          
        </div>
      </div>
      <div className="p-6">
        {allBills.length === 0 ? <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-muted">
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2 text-foreground">No bills configured</h4>
            <p className="text-sm text-muted-foreground">Add income and expense bills to see your net projection</p>
          </div> : <div className="w-full overflow-auto">
            <div className="min-w-[900px]">
              <div className="rounded-lg overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left py-3 px-4 font-semibold sticky left-0 z-10 min-w-[120px] bg-muted border-r border-border text-foreground">
                        Bill Name
                      </th>
                      {MONTH_NAMES.map(month => <th key={month} className="text-center py-3 px-2 font-medium min-w-[70px] text-muted-foreground">
                          {month}
                        </th>)}
                      <th className="text-center py-3 px-4 font-semibold min-w-[80px] bg-muted border-l border-border text-foreground">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Income Bills */}
                    {incomeBills.map((bill, index) => <tr key={bill.id} className={`hover:bg-muted/50 transition-colors ${index !== incomeBills.length - 1 || expenseBills.length > 0 ? 'border-b border-border' : ''}`}>
                        <td className="py-3 px-4 font-medium sticky left-0 bg-background z-10 border-r border-border text-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="truncate">{bill.name}</span>
                          </div>
                        </td>
                        {MONTH_NAMES.map((_, monthIndex) => {
                    const amount = getBillAmountForMonth(bill, monthIndex);
                    return <td key={monthIndex} className="text-center py-3 px-2 font-medium text-xs text-emerald-600">
                              {amount > 0 ? `+${formatCurrency(amount)}` : '—'}
                            </td>;
                  })}
                        <td className="text-center py-3 px-4 font-semibold text-xs bg-muted text-emerald-600 border-l border-border">
                          +{formatCurrency(getBillYearlyTotal(bill))}
                        </td>
                      </tr>)}
                    
                    {/* Expense Bills */}
                    {expenseBills.map((bill, index) => <tr key={bill.id} className={`hover:bg-muted/50 transition-colors ${index !== expenseBills.length - 1 ? 'border-b border-border' : ''}`}>
                        <td className="py-3 px-4 font-medium sticky left-0 bg-background z-10 border-r border-border text-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="truncate">{bill.name}</span>
                          </div>
                        </td>
                        {MONTH_NAMES.map((_, monthIndex) => {
                    const amount = getBillAmountForMonth(bill, monthIndex);
                    return <td key={monthIndex} className="text-center py-3 px-2 font-medium text-xs text-red-600">
                              {amount > 0 ? `-${formatCurrency(amount)}` : '—'}
                            </td>;
                  })}
                        <td className="text-center py-3 px-4 font-semibold text-xs bg-muted text-red-600 border-l border-border">
                          -{formatCurrency(getBillYearlyTotal(bill))}
                        </td>
                      </tr>)}

                    {/* Net Total Row */}
                    <tr className="border-t-2 border-border bg-muted">
                      <td className="py-3 px-4 font-semibold sticky left-0 z-10 bg-muted border-r border-border text-foreground">
                        Net Total
                      </td>
                      {MONTH_NAMES.map((_, monthIndex) => {
                    const monthIncome = getMonthlyTotal(monthIndex, 'income');
                    const monthExpenses = getMonthlyTotal(monthIndex, 'expense');
                    const netFlow = monthIncome - monthExpenses;
                    return <td key={monthIndex} className="text-center py-3 px-2 font-semibold text-xs" style={{
                      color: netFlow >= 0 ? '#059669' : '#dc2626'
                    }}>
                            {formatCurrency(netFlow)}
                          </td>;
                  })}
                      <td className="text-center py-3 px-4 font-bold text-xs bg-muted border-l border-border" style={{
                    color: netProjection >= 0 ? '#059669' : '#dc2626'
                  }}>
                        {formatCurrency(netProjection)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default YearlyNetProjection;