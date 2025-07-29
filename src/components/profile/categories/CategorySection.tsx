import React from 'react';
import { Category } from '@/types/categories';
import CategoryRow from '../CategoryRow';

interface CategorySectionProps {
  title: string;
  categories: Category[];
  count: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  categories,
  count,
  onEdit,
  onDelete
}) => {
  const getDefaultCategories = (cats: Category[]) => cats.filter(cat => cat.user_id === null);
  const getCustomCategories = (cats: Category[]) => cats.filter(cat => cat.user_id !== null);

  const defaultCategories = getDefaultCategories(categories);
  const customCategories = getCustomCategories(categories);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      
      <div className="space-y-2">
        {/* Default Categories */}
        {defaultCategories.length > 0 && (
          <div className="space-y-2">
            {defaultCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div className="space-y-2 mt-3">
            {customCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            <p className="text-sm">No {title.toLowerCase()} categories yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Create your first category to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;