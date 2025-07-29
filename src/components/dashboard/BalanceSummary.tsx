
import React, { useState, useMemo, useCallback } from 'react';
import { Account } from '@/types/accounts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccountsData } from '@/hooks/useAccountsData';
import { formatCurrency } from '@/lib/utils';
import { ACCOUNT_TYPE_LABELS } from '@/constants/app';

const BalanceSummary = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const { accounts, isLoading: loading } = useAccountsData();

  const toggleBalanceVisibility = useCallback(() => {
    setHideBalance(prev => !prev);
  }, []);

  const { totalBalance, categorizedAccounts, activeAccountsCount } = useMemo(() => {
    const visibleAccounts = accounts.filter(account => !account.hide_balance);
    const total = visibleAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    const categorized = accounts.reduce((acc, account) => {
      const category = account.account_type || 'main';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(account);
      return acc;
    }, {} as Record<string, Account[]>);

    return {
      totalBalance: total,
      categorizedAccounts: categorized,
      activeAccountsCount: visibleAccounts.length
    };
  }, [accounts]);

  const getCategoryBalance = useCallback((categoryAccounts: Account[]): number => {
    return categoryAccounts
      .filter(account => !account.hide_balance)
      .reduce((sum, account) => sum + account.balance, 0);
  }, []);

  return (
    <Card className="bg-card border border-border transition-all duration-300 hover:shadow-elegant hover:scale-[1.01] animate-fade-in">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Total Balance</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBalanceVisibility}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 hover-scale"
          >
            {hideBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="mb-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-56 animate-pulse" />
              <Skeleton className="h-4 w-40 animate-pulse" />
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <p className="text-4xl font-bold text-foreground tracking-tight tabular-nums">
                {hideBalance ? '••••••' : formatCurrency(totalBalance)}
              </p>
              <p className="text-sm text-muted-foreground">
                {activeAccountsCount} active {activeAccountsCount === 1 ? 'account' : 'accounts'} included
              </p>
            </div>
          )}
        </div>

        {!loading && Object.entries(categorizedAccounts).length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border animate-fade-in">
            {Object.entries(categorizedAccounts).map(([category, categoryAccounts]) => (
              <div key={category} className="flex justify-between items-center text-sm transition-all duration-200 hover:bg-muted/30 rounded p-2 -m-2">
                <span className="text-muted-foreground font-medium capitalize">
                  {ACCOUNT_TYPE_LABELS[category as keyof typeof ACCOUNT_TYPE_LABELS] || category}
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {hideBalance ? '••••••' : formatCurrency(getCategoryBalance(categoryAccounts))}
                </span>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="space-y-3 pt-4 border-t border-border">
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />
            <Skeleton className="h-4 w-5/6 animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceSummary;
