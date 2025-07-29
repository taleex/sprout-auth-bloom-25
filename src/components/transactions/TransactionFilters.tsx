
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Category } from '@/types/categories';

type TransactionTypeFilters = {
  income: boolean;
  expenses: boolean;
  transfers: boolean;
};

interface TransactionFiltersProps {
  typeFilters: TransactionTypeFilters;
  onTypeFiltersChange: (filters: TransactionTypeFilters) => void;
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
  categories: Category[];
  onClearFilters: () => void;
}

export const TransactionFilters = ({
  typeFilters,
  onTypeFiltersChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onClearFilters,
}: TransactionFiltersProps) => {
  const hasActiveFilters = 
    !typeFilters.income || !typeFilters.expenses || !typeFilters.transfers || categoryFilter !== 'all';

  const handleTypeToggle = (values: string[]) => {
    onTypeFiltersChange({
      income: values.includes('income'),
      expenses: values.includes('expenses'),
      transfers: values.includes('transfers'),
    });
  };

  const activeTypeValues = [
    ...(typeFilters.income ? ['income'] : []),
    ...(typeFilters.expenses ? ['expenses'] : []),
    ...(typeFilters.transfers ? ['transfers'] : []),
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:border-accent-foreground/20 ${
            hasActiveFilters ? 'bg-accent text-accent-foreground border-accent-foreground/20' : ''
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              •
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-6" align="end">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-foreground mb-4">Filter Transactions</h4>
          </div>
          
          {/* Transaction Type Toggles */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Transaction Types</label>
            <ToggleGroup
              type="multiple"
              value={activeTypeValues}
              onValueChange={handleTypeToggle}
              className="flex flex-col gap-2 w-full"
            >
              <ToggleGroupItem
                value="income"
                className="w-full justify-start data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700 data-[state=on]:border-emerald-200 hover:bg-emerald-50 transition-colors"
              >
                Income
              </ToggleGroupItem>
              <ToggleGroupItem
                value="expenses"
                className="w-full justify-start data-[state=on]:bg-red-100 data-[state=on]:text-red-700 data-[state=on]:border-red-200 hover:bg-red-50 transition-colors"
              >
                Expenses
              </ToggleGroupItem>
              <ToggleGroupItem
                value="transfers"
                className="w-full justify-start data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                Transfers
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
