
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionForm } from './TransactionForm';
import { TransferForm } from './TransferForm';
import { X } from 'lucide-react';

interface TransactionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransactionPopup: React.FC<TransactionPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('transaction');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            New Transaction
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 rounded-xl flex-shrink-0">
            <TabsTrigger 
              value="transaction" 
              className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              Transaction
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
            >
              Transfer
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="transaction" className="h-full mt-0">
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-6">
                  <div className="flex gap-2 bg-muted rounded-xl p-1 mb-6">
                    <Button
                      variant={transactionType === 'expense' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTransactionType('expense')}
                      className={`flex-1 transition-all duration-200 ${
                        transactionType === 'expense' 
                          ? 'bg-[#cbf587] text-black hover:bg-[#b8e574] shadow-sm' 
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      Expense
                    </Button>
                    <Button
                      variant={transactionType === 'income' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTransactionType('income')}
                      className={`flex-1 transition-all duration-200 ${
                        transactionType === 'income' 
                          ? 'bg-[#cbf587] text-black hover:bg-[#b8e574] shadow-sm' 
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      Income
                    </Button>
                  </div>

                  <TransactionForm 
                    type={transactionType}
                    onSuccess={handleSuccess}
                    onCancel={onClose}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="transfer" className="h-full mt-0">
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-6">
                  <TransferForm 
                    onSuccess={handleSuccess}
                    onCancel={onClose}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
