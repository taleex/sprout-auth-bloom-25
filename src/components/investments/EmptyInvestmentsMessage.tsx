import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LineChart } from 'lucide-react';

const EmptyInvestmentsMessage = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <LineChart size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Investment Accounts</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Start building your investment portfolio by creating your first investment account.
      </p>
      <Button className="bg-accent hover:bg-accent/80">
        <PlusCircle size={16} className="mr-2" />
        Create Investment Account
      </Button>
    </div>
  );
};

export default EmptyInvestmentsMessage;