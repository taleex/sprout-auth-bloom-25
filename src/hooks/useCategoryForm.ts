
import { useState } from 'react';

interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface EditFormData {
  name: string;
  icon: string;
  color: string;
}

export const useCategoryForm = () => {
  const [editForm, setEditForm] = useState<EditFormData>({ 
    name: '', 
    icon: '', 
    color: '' 
  });
  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    icon: 'shopping-cart',
    color: '#22c55e'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const resetNewCategoryForm = () => {
    setNewCategory({
      name: '',
      type: 'expense',
      icon: 'shopping-cart',
      color: '#22c55e'
    });
    setShowAddForm(false);
  };

  const validateForm = (form: CategoryFormData | EditFormData): boolean => {
    return form.name.trim().length > 0;
  };

  const validateNewCategory = (): boolean => {
    return validateForm(newCategory);
  };

  const validateEditForm = (): boolean => {
    return validateForm(editForm);
  };

  return {
    // State
    editForm,
    newCategory,
    showAddForm,
    
    // Setters
    setEditForm,
    setNewCategory,
    setShowAddForm,
    
    // Actions
    resetNewCategoryForm,
    
    // Validation
    validateNewCategory,
    validateEditForm,
  };
};
