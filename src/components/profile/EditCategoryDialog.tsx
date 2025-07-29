
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Trash2 } from 'lucide-react';
import { Category } from '@/types/categories';
import CategoryIconSelector from './CategoryIconSelector';
import CategoryColorSelector from './CategoryColorSelector';

interface EditCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  editForm: { name: string; icon: string; color: string };
  onFormChange: (form: { name: string; icon: string; color: string }) => void;
  onSave: () => void;
  onDelete?: (categoryId: string) => void;
  validateEditForm: () => boolean;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  editForm,
  onFormChange,
  onSave,
  onDelete,
  validateEditForm
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = () => {
    if (validateEditForm()) {
      onSave();
    }
  };

  const handleDelete = () => {
    if (category && onDelete) {
      onDelete(category.id);
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  if (!category) return null;

  const isUserCategory = category.user_id !== null;
  const isDefaultCategory = category.user_id === null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {isDefaultCategory ? 'Personalizar Categoria Padrão' : 'Editar Categoria'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: editForm.color }}
            >
              <CategoryIconSelector
                selectedIcon={editForm.icon}
                onIconSelect={() => {}}
                isInline
              />
            </div>
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nome da Categoria</Label>
            {isDefaultCategory ? (
              <>
                <Input
                  value={editForm.name}
                  disabled
                  className="bg-muted text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  O nome das categorias padrão não pode ser alterado
                </p>
              </>
            ) : (
              <Input
                value={editForm.name}
                onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
                placeholder="Digite o nome da categoria"
                className="text-sm"
              />
            )}
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            {isDefaultCategory ? (
              <>
                <Label className="text-sm font-medium">Ícone</Label>
                <div className="p-3 border border-border rounded-md bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <CategoryIconSelector
                        selectedIcon={editForm.icon}
                        onIconSelect={() => {}}
                        isInline
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Ícone da categoria</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    O ícone das categorias padrão não pode ser alterado
                  </p>
                </div>
              </>
            ) : (
              <CategoryIconSelector
                selectedIcon={editForm.icon}
                onIconSelect={(icon) => onFormChange({ ...editForm, icon })}
              />
            )}
          </div>

          {/* Color Selector */}
          <CategoryColorSelector
            selectedColor={editForm.color}
            onColorSelect={(color) => onFormChange({ ...editForm, color })}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!validateEditForm()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isDefaultCategory ? 'Aplicar Cor' : 'Salvar'}
              </Button>
            </div>
            
            {/* Delete Button - Only for user categories */}
            {isUserCategory && onDelete && (
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Categoria
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a categoria "{category.name}"? 
                      Esta ação não pode ser desfeita e todas as transações associadas 
                      a esta categoria ficarão sem categoria.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
