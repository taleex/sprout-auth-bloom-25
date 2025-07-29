
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { NewBillData } from '@/types/bills';
import { useBillFormValidation } from '@/hooks/useBillFormValidation';
import BillFormFields from './shared/BillFormFields';
import BillFormActions from './shared/BillFormActions';

interface AddBillSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  newBill: NewBillData;
  onUpdateBill: (updates: Partial<NewBillData>) => void;
  onSave: () => Promise<void>;
  isEditing?: boolean;
  editingBillName?: string;
}

const AddBillSidebar: React.FC<AddBillSidebarProps> = ({
  isOpen,
  onClose,
  newBill,
  onUpdateBill,
  onSave,
  isEditing = false,
  editingBillName,
}) => {
  const { validateBill } = useBillFormValidation();

  const handleSave = async () => {
    const validationError = validateBill(newBill);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    await onSave();
  };

  // Prevent body scroll when sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-background/95 backdrop-blur-md border-l border-border/50 z-50 transform transition-all duration-300 ease-in-out shadow-2xl shadow-black/20 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {isEditing ? `Edit ${editingBillName || 'Bill'}` : 'Add New Bill'}
              </h3>
              <p className="text-sm mt-1 text-muted-foreground">
                {isEditing ? 'Update your recurring transaction' : 'Create a recurring income or expense'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-muted hover:text-foreground transition-colors rounded-lg"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <BillFormFields
            bill={newBill}
            onUpdateBill={onUpdateBill}
            layout="vertical"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/20">
          <BillFormActions
            onSave={handleSave}
            onCancel={onClose}
            isEditing={isEditing}
            layout="vertical"
          />
        </div>
      </div>
    </>
  );
};

export default AddBillSidebar;
