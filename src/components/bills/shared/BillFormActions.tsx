
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BillFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const BillFormActions: React.FC<BillFormActionsProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  layout = 'horizontal'
}) => {
  const containerClasses = layout === 'horizontal' 
    ? 'flex flex-col sm:flex-row gap-3 pt-4'
    : 'flex gap-3';

  return (
    <div className={cn(containerClasses, layout === 'horizontal' && 'border-t border-border')}>
      <Button
        onClick={onSave}
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
      >
        {isEditing ? 'Update Bill' : 'Save Bill'}
      </Button>
      <Button
        variant="outline"
        onClick={onCancel}
        className="flex-1 hover:bg-muted hover:text-foreground border-border text-muted-foreground transition-colors"
      >
        Cancel
      </Button>
    </div>
  );
};

export default BillFormActions;
