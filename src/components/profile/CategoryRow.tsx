import React from 'react';
import { Category } from '@/types/categories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CategoryIconSelector from './CategoryIconSelector';
interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}
const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  onEdit,
  onDelete
}) => {
  const isUserCategory = category.user_id !== null;
  const handleContainerClick = () => {
    // Both user and default categories can be edited now
    // Default categories will only allow color editing
    onEdit(category);
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(category);
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return <div className="group relative bg-card hover:bg-accent/5 border border-border hover:border-border/60 rounded-lg transition-all duration-200 cursor-pointer" onClick={handleContainerClick}>
      <div className="p-4 flex items-center gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0" style={{
          backgroundColor: category.color || '#22c55e'
        }}>
          {category.icon && <div className="w-5 h-5 text-current">
              <CategoryIconSelector selectedIcon={category.icon} onIconSelect={() => {}} isInline />
            </div>}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm truncate">{category.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              category.type === 'income' 
                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            }`}>
              {category.type === 'income' ? 'Income' : 'Expense'}
            </span>
            {!isUserCategory && (
              <span className="text-xs text-muted-foreground">Default</span>
            )}
          </div>
        </div>

        {/* Actions for user categories only */}
        {isUserCategory && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEditClick}
              className="h-8 w-8 p-0 hover:bg-primary/10 rounded-md"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600 rounded-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{category.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(category.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>;
};
export default CategoryRow;