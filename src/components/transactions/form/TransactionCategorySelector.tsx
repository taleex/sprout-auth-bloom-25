
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import CategoryIconSelector from '@/components/profile/CategoryIconSelector';

interface TransactionCategorySelectorProps {
  type: 'expense' | 'income';
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export const TransactionCategorySelector: React.FC<TransactionCategorySelectorProps> = ({
  type,
  categoryId,
  onCategoryChange,
}) => {
  const { categories } = useCategoriesData();

  // Filter categories by type and separate default from custom
  const filteredCategories = categories.filter(category => category.type === type);
  const defaultCategories = filteredCategories.filter(category => category.user_id === null);
  const customCategories = filteredCategories.filter(category => category.user_id !== null);

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category *</Label>
      <Select value={categoryId} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {/* Default Categories */}
          {defaultCategories.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0">
                Default Categories
              </div>
              {defaultCategories.map(category => (
                <SelectItem key={category.id} value={category.id} className="py-2">
                  <div className="flex items-center gap-3 w-full">
                    <div 
                      className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: category.color || '#22c55e' }}
                    />
                    <CategoryIconSelector
                      selectedIcon={category.icon || 'shopping-cart'}
                      onIconSelect={() => {}}
                      isInline
                    />
                    <span className="flex-1 text-left">{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          {/* Separator between default and custom categories */}
          {defaultCategories.length > 0 && customCategories.length > 0 && (
            <Separator className="my-1" />
          )}

          {/* Custom Categories */}
          {customCategories.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0">
                Custom Categories
              </div>
              {customCategories.map(category => (
                <SelectItem key={category.id} value={category.id} className="py-2">
                  <div className="flex items-center gap-3 w-full">
                    <div 
                      className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: category.color || '#22c55e' }}
                    />
                    <CategoryIconSelector
                      selectedIcon={category.icon || 'shopping-cart'}
                      onIconSelect={() => {}}
                      isInline
                    />
                    <span className="flex-1 text-left">{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          {/* Empty state */}
          {filteredCategories.length === 0 && (
            <div className="px-2 py-4 text-center text-muted-foreground text-sm">
              No {type} categories available
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
