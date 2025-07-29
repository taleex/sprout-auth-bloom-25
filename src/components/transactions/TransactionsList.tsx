
import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/types/transactions';
import { formatCurrency } from '@/lib/utils';

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionsList = memo(({ transactions, isLoading }: TransactionsListProps) => {
  const navigate = useNavigate();

  const handleTransactionClick = useCallback((transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  }, [navigate]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }, []);

  const sortedGroups = useMemo(() => {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
      const dateKey = formatDate(transaction.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(groupedTransactions).sort(([a], [b]) => {
      if (a === 'Today') return -1;
      if (b === 'Today') return 1;
      if (a === 'Yesterday') return -1;
      if (b === 'Yesterday') return 1;
      return 0;
    });
  }, [transactions, formatDate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-card rounded-xl shadow-sm animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderedTransactions = useMemo(() => {
    return sortedGroups.map(([dateGroup, groupTransactions]) => (
      <div key={dateGroup} className="animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-3">{dateGroup}</h3>
        <div className="space-y-2">
          {groupTransactions.map((transaction) => (
            <Card 
              key={transaction.id}
              className="bg-card rounded-xl shadow-sm hover:shadow-elegant transition-all duration-300 cursor-pointer border border-border hover:border-primary/30 hover:scale-[1.02] animate-fade-in hover-scale"
              onClick={() => handleTransactionClick(transaction.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                      {transaction.category_icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.account_name}</span>
                        {transaction.transaction_type === 'transfer' && (
                          <>
                            <span>•</span>
                             <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                              Transfer
                             </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold tabular-nums ${
                      transaction.type === 'expense' 
                        ? 'text-destructive' 
                        : 'text-success'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground/70 capitalize">
                      {transaction.transaction_type}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ));
  }, [sortedGroups, handleTransactionClick]);

  return (
    <div className="space-y-6">
      {renderedTransactions}

      {transactions.length === 0 && (
        <Card className="bg-card rounded-xl shadow-sm animate-fade-in">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground text-lg">
              No transactions found for this period
            </div>
            <p className="text-muted-foreground/70 text-sm mt-2">
              Transactions will appear here once you start adding them
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
