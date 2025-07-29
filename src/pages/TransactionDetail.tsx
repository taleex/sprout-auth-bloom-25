
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TransactionDetail as TransactionDetailComponent } from '@/components/transactions/TransactionDetail';
import { Transaction } from '@/types/transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transaction, isLoading, error, refetch } = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      if (!id) throw new Error('Transaction ID is required');

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          transaction_type,
          description,
          notes,
          date,
          photo_url,
          account_id,
          source_account_id,
          destination_account_id,
          categories(name, icon),
          accounts!transactions_account_id_fkey(name),
          source_account:accounts!transactions_source_account_id_fkey(name),
          destination_account:accounts!transactions_destination_account_id_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        amount: Number(data.amount),
        type: data.type as 'income' | 'expense' | 'transfer',
        transaction_type: data.transaction_type as 'manual' | 'transfer' | 'automated',
        description: data.description || 'Transaction',
        notes: data.notes,
        date: data.date,
        photo_url: data.photo_url,
        account_id: data.account_id,
        source_account_id: data.source_account_id,
        destination_account_id: data.destination_account_id,
        category: data.categories?.name || 'Other',
        category_icon: data.categories?.icon || '📝',
        account_name: data.accounts?.name || 'Unknown Account',
        source_account_name: data.source_account?.name,
        destination_account_name: data.destination_account?.name,
      } as Transaction;
    },
    enabled: !!id,
  });

  const handleUpdate = () => {
    refetch();
  };

  const handleDelete = () => {
    navigate('/transactions');
  };

  if (error || (!isLoading && !transaction)) {
    return (
      <PageLayout title="Transaction Not Found">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Transaction not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The transaction you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Transactions
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={transaction ? `Transaction Details` : 'Transaction'} 
      isLoading={isLoading}
      actions={
        <Button
          variant="ghost"
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
      }
    >
      {isLoading ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      ) : (
        transaction && (
          <TransactionDetailComponent
            transaction={transaction}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )
      )}
    </PageLayout>
  );
};

export default TransactionDetail;
