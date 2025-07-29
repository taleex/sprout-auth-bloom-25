
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportsData {
  accountBalances: Array<{
    key: string;
    data: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    [key: string]: string | number;
  }>;
  metrics: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    netWorth: number;
  };
  expensesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export const useReportsData = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReportsData = async () => {
    try {
      setIsLoading(true);

      // Fetch accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('is_archived', false);

      if (accountsError) throw accountsError;

      // Fetch transactions for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories(name, icon),
          accounts!transactions_account_id_fkey(name)
        `)
        .gte('date', sixMonthsAgo.toISOString())
        .order('date', { ascending: true });

      if (transactionsError) throw transactionsError;

      // Process account balances
      const accountBalances = (accounts || []).map(account => ({
        key: account.name,
        data: account.balance,
      }));

      // Process monthly trends
      const monthlyData = new Map<string, { [key: string]: number }>();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        monthlyData.set(monthKey, { income: 0, expenses: 0, net: 0 });
      }

      // Aggregate transactions by month
      (transactions || []).forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        if (monthlyData.has(monthKey)) {
          const monthData = monthlyData.get(monthKey)!;
          if (transaction.type === 'income') {
            monthData.income += transaction.amount;
          } else if (transaction.type === 'expense') {
            monthData.expenses += transaction.amount;
          }
          monthData.net = monthData.income - monthData.expenses;
        }
      });

      const monthlyTrends = Array.from(monthlyData.entries()).map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.net,
      }));

      // Calculate metrics
      const totalBalance = (accounts || []).reduce((sum, account) => sum + account.balance, 0);
      const currentMonth = new Date();
      const currentMonthKey = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
      const currentMonthData = monthlyData.get(currentMonthKey) || { income: 0, expenses: 0, net: 0 };
      
      const metrics = {
        totalBalance,
        monthlyIncome: currentMonthData.income,
        monthlyExpenses: currentMonthData.expenses,
        savingsRate: currentMonthData.income > 0 ? (currentMonthData.net / currentMonthData.income) * 100 : 0,
        netWorth: totalBalance,
      };

      // Process expenses by category
      const categoryExpenses = new Map<string, number>();
      let totalExpenses = 0;

      (transactions || []).forEach(transaction => {
        if (transaction.type === 'expense') {
          const categoryName = transaction.categories?.name || 'Other';
          categoryExpenses.set(categoryName, (categoryExpenses.get(categoryName) || 0) + transaction.amount);
          totalExpenses += transaction.amount;
        }
      });

      const expensesByCategory = Array.from(categoryExpenses.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      })).sort((a, b) => b.amount - a.amount);

      setReportsData({
        accountBalances,
        monthlyTrends,
        metrics,
        expensesByCategory,
      });

    } catch (error: any) {
      console.error('Error fetching reports data:', error);
      toast({
        title: "Error loading reports",
        description: error.message || "Failed to load reports data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  return {
    reportsData,
    isLoading,
    refetch: fetchReportsData,
  };
};
