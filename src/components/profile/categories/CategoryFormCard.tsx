import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save, X } from 'lucide-react';
import CategoryIconSelector from '../CategoryIconSelector';
import CategoryColorSelector from '../CategoryColorSelector';

interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface CategoryFormCardProps {
  showForm: boolean;
  formData: CategoryFormData;
  onFormDataChange: (data: CategoryFormData) => void;
  onToggleForm: () => void;
  onSave: () => void;
  onCancel: () => void;
  isValid: boolean;
}

const CategoryFormCard: React.FC<CategoryFormCardProps> = ({
  showForm,
  formData,
  onFormDataChange,
  onToggleForm,
  onSave,
  onCancel,
  isValid
}) => {
  return (
    <Card className="mb-6 bg-card border border-border shadow-sm rounded-lg hover:shadow-elegant transition-all duration-300">
      <CardHeader className="px-4 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Add Category</CardTitle>
          <Button
            onClick={onToggleForm}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      {showForm && (
        <CardContent className="px-4 py-4 pt-0 border-t border-border animate-fade-in">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" className="text-sm font-medium">Name</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  className="h-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={formData.type === 'income' ? 'default' : 'outline'}
                    onClick={() => onFormDataChange({ ...formData, type: 'income' })}
                    className="flex-1 h-9 text-xs transition-all duration-200"
                    size="sm"
                  >
                    Income
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === 'expense' ? 'default' : 'outline'}
                    onClick={() => onFormDataChange({ ...formData, type: 'expense' })}
                    className="flex-1 h-9 text-xs transition-all duration-200"
                    size="sm"
                  >
                    Expense
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CategoryIconSelector
                selectedIcon={formData.icon}
                onIconSelect={(icon) => onFormDataChange({ ...formData, icon })}
              />
              <CategoryColorSelector
                selectedColor={formData.color}
                onColorSelect={(color) => onFormDataChange({ ...formData, color })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onSave}
                disabled={!isValid}
                className="h-8 px-3 text-xs hover:scale-105 transition-all duration-200"
                size="sm"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CategoryFormCard;