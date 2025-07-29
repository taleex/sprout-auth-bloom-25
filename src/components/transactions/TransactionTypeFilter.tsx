
import React from 'react';
import { Button } from '@/components/ui/button';

type TransactionFilter = 'all' | 'income' | 'expenses' | 'transfers';

interface TransactionTypeFilterProps {
  value: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
}

export const TransactionTypeFilter = ({ value, onChange }: TransactionTypeFilterProps) => {
  const filters: { key: TransactionFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'transfers', label: 'Transfers' },
  ];

  return (
    <div className="bg-card rounded-xl p-1 shadow-sm border border-border">
      <div className="flex">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant="ghost"
            onClick={() => onChange(filter.key)}
            className={`flex-1 rounded-lg transition-all duration-200 ${
              value === filter.key
                ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
