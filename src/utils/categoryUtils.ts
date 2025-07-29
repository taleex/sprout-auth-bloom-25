
import React from 'react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { CategoryInfo } from '@/types/categories';

export const useCategoryInfo = () => {
  const { categories } = useCategoriesData();

  const categoriesMap = React.useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.id, cat);
    });
    return map;
  }, [categories]);

  const getCategoryInfo = (transaction: any): CategoryInfo => {
    // First try to get from the transaction's category_id if available
    if (transaction.category_id && categoriesMap.has(transaction.category_id)) {
      const category = categoriesMap.get(transaction.category_id);
      return {
        name: category.name,
        icon: category.icon || '📝',
        color: category.color || '#22c55e'
      };
    }
    
    // Fallback to the transaction's existing category data
    return {
      name: transaction.category || 'Other',
      icon: transaction.category_icon || '📝',
      color: '#22c55e'
    };
  };

  return { getCategoryInfo, categoriesMap };
};
