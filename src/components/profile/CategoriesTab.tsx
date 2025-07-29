
import React, { useState } from 'react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { Category } from '@/types/categories';
import { useCategoryForm } from '@/hooks/useCategoryForm';
import CategoryFormCard from './categories/CategoryFormCard';
import CategorySection from './categories/CategorySection';
import EditCategoryDialog from './EditCategoryDialog';

const CategoriesTab = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategoriesData();
  const {
    editForm,
    newCategory,
    showAddForm,
    setEditForm,
    setNewCategory,
    setShowAddForm,
    resetNewCategoryForm,
    validateNewCategory,
    validateEditForm
  } = useCategoryForm();

  // Modal state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      icon: category.icon || 'shopping-cart',
      color: category.color || '#22c55e'
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !validateEditForm()) return;

    const isDefaultCategory = editingCategory.user_id === null;
    
    // For default categories, only update the color
    if (isDefaultCategory) {
      await updateCategory(editingCategory.id, {
        color: editForm.color
      });
    } else {
      // For user categories, update all fields
      await updateCategory(editingCategory.id, {
        name: editForm.name,
        icon: editForm.icon,
        color: editForm.color
      });
    }

    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleAddCategory = async () => {
    if (!validateNewCategory()) return;

    await createCategory({
      name: newCategory.name,
      type: newCategory.type,
      icon: newCategory.icon,
      color: newCategory.color,
      user_id: '', // Will be set by the hook
      updated_at: new Date().toISOString(),
    });

    resetNewCategoryForm();
  };

  // Group categories by type
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  if (isLoading) {
    return (
      <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your transactions with custom categories</p>
        </div>

        {/* Add New Category */}
        <CategoryFormCard
          showForm={showAddForm}
          formData={newCategory}
          onFormDataChange={setNewCategory}
          onToggleForm={() => setShowAddForm(!showAddForm)}
          onSave={handleAddCategory}
          onCancel={() => setShowAddForm(false)}
          isValid={validateNewCategory()}
        />

        {/* Income Categories */}
        <CategorySection
          title="Income"
          categories={incomeCategories}
          count={incomeCategories.length}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />

        {/* Expense Categories */}
        <CategorySection
          title="Expenses"
          categories={expenseCategories}
          count={expenseCategories.length}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />

        {/* Edit Category Dialog */}
        <EditCategoryDialog
          category={editingCategory}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          editForm={editForm}
          onFormChange={setEditForm}
          onSave={handleSaveEdit}
          onDelete={handleDeleteCategory}
          validateEditForm={validateEditForm}
        />
      </div>
    </div>
  );
};

export default CategoriesTab;
