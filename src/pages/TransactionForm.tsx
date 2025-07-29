
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TransactionForm as TransactionFormComponent } from '@/components/transactions/TransactionForm';
import { TransferForm } from '@/components/transactions/TransferForm';
import { useToast } from '@/hooks/use-toast';

const TransactionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('transaction');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Transaction created successfully',
    });
    navigate('/transactions');
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-finapp-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/transactions')}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">New Transaction</h1>
            <p className="text-muted-foreground mt-1">
              Create a new transaction or transfer between accounts
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-xl">
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

            <TabsContent value="transaction" className="mt-0">
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

                <TransactionFormComponent 
                  type={transactionType}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            </TabsContent>

            <TabsContent value="transfer" className="mt-0">
              <div className="space-y-6">
                <TransferForm 
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TransactionForm;
