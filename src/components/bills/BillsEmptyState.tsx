
import React from 'react';
import { PlusCircle } from 'lucide-react';

const BillsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <PlusCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg">No bills configured yet</p>
      <p className="text-muted-foreground/70 text-sm mt-1">Add your first bill to start forecasting</p>
    </div>
  );
};

export default BillsEmptyState;
