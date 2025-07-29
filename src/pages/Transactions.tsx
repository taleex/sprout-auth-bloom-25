
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTransactions } from '@/lib/api';
import { useAccountsData } from '@/hooks/useAccountsData';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { Plus, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TransactionTable from '@/components/transactions/TransactionTable';
import { TransactionsMobileList } from '@/components/transactions/TransactionsMobileList';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { useToast } from '@/hooks/use-toast';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import TransactionImport from '@/components/transactions/TransactionImport';

type TransactionTypeFilters = {
  income: boolean;
  expenses: boolean;
  transfers: boolean;
};

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilters, setTypeFilters] = useState<TransactionTypeFilters>({
    income: true,
    expenses: true,
    transfers: true,
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedAccountForImport, setSelectedAccountForImport] = useState<string>('');
  
  // Ensure categories are loaded for the transactions page
  const { categories, isLoading: categoriesLoading } = useCategoriesData();
  const { accounts } = useAccountsData();
  
  const { data: transactions, isLoading, isError, refetch } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => fetchTransactions(user?.id),
    enabled: !!user?.id,
  });

  // Handle import action from URL params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'import' && accounts && accounts.length > 0) {
      setSelectedAccountForImport(accounts[0].id);
      setIsImportDialogOpen(true);
      // Clear the action param
      setSearchParams({});
    }
  }, [searchParams, accounts, setSearchParams]);

  const handleTransactionSuccess = () => {
    // Invalidate and refetch transactions
    queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    toast({
      title: 'Success',
      description: 'Transaction updated successfully',
    });
  };

  const handleImportClick = () => {
    if (!accounts || accounts.length === 0) {
      toast({
        title: 'No Accounts',
        description: 'You need to create an account first before importing transactions',
        variant: 'destructive',
      });
      return;
    }
    
    // Use the first account as default, or let user choose
    setSelectedAccountForImport(accounts[0].id);
    setIsImportDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilters({
      income: true,
      expenses: true,
      transfers: true,
    });
    setCategoryFilter('all');
  };

  const filteredTransactions = transactions?.filter(transaction => {
    // Text search filter
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter - check if the transaction type is enabled
    const matchesType = 
      (typeFilters.income && transaction.type === 'income') ||
      (typeFilters.expenses && transaction.type === 'expense') ||
      (typeFilters.transfers && transaction.type === 'transfer');

    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      transaction.category_id === categoryFilter ||
      transaction.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  }) || [];

  if (isLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-finapp-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-finapp-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error loading transactions</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const hasActiveFilters = 
    searchTerm || 
    !typeFilters.income || 
    !typeFilters.expenses || 
    !typeFilters.transfers || 
    categoryFilter !== 'all';

  return (
    <div className="min-h-screen bg-finapp-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleImportClick}
              variant="outline"
              className="border-border hover:bg-accent hover:text-accent-foreground text-foreground px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:border-accent-foreground/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            
            <Button 
              onClick={() => navigate('/transactions/form')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-input focus:border-ring focus:ring-0"
            />
          </div>
          
          <div className="flex gap-2">
            <TransactionFilters
              typeFilters={typeFilters}
              onTypeFiltersChange={setTypeFilters}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              categories={categories}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <TransactionTable 
                transactions={filteredTransactions} 
                onUpdate={handleTransactionSuccess}
              />
            </div>
            
            {/* Mobile List */}
            <div className="md:hidden">
              <TransactionsMobileList 
                transactions={filteredTransactions} 
                onUpdate={handleTransactionSuccess}
              />
            </div>
          </>
        ) : (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {hasActiveFilters
                ? 'No transactions found' 
                : 'No transactions yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters or search terms' 
                : 'Start by adding your first transaction'
              }
            </p>
            {!hasActiveFilters && (
              <Button 
                onClick={() => navigate('/transactions/form')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            )}
          </div>
        )}

        {/* Import Dialog */}
        {selectedAccountForImport && (
          <TransactionImport
            accountId={selectedAccountForImport}
            open={isImportDialogOpen}
            onClose={() => setIsImportDialogOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Transactions;
