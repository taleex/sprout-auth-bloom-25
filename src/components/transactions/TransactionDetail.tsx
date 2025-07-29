
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Save, X, Calendar, FileText, Hash, ArrowRightLeft, Tag } from 'lucide-react';
import { Transaction } from '@/types/transactions';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TransactionDetailProps {
  transaction: Transaction;
  onUpdate: () => void;
  onDelete: () => void;
}

// Track ongoing operations to prevent duplicates
const operationTracker = new Set<string>();

export const TransactionDetail = ({ transaction, onUpdate, onDelete }: TransactionDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    description: transaction.description || '',
    amount: transaction.amount.toString(),
    notes: transaction.notes || '',
    date: new Date(transaction.date).toISOString().slice(0, 16),
    category_id: transaction.category_id || '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories } = useCategoriesData();

  // Get the current category information
  const getCurrentCategory = () => {
    if (transaction.category_id && categories.length > 0) {
      const category = categories.find(cat => cat.id === transaction.category_id);
      if (category) {
        return {
          name: category.name,
          icon: category.icon || '📝',
          color: category.color || '#22c55e'
        };
      }
    }
    
    // Fallback to existing transaction data
    return {
      name: transaction.category || 'Other',
      icon: transaction.category_icon || '📝',
      color: '#22c55e'
    };
  };

  const handleSave = async () => {
    const operationKey = `update-${transaction.id}`;
    
    if (operationTracker.has(operationKey) || isUpdating) return;
    operationTracker.add(operationKey);
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          description: editData.description,
          amount: parseFloat(editData.amount),
          notes: editData.notes,
          date: new Date(editData.date).toISOString(),
          category_id: editData.category_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: 'Transaction updated',
        description: 'Your changes have been saved successfully.',
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update transaction.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
      operationTracker.delete(operationKey);
    }
  };

  const handleDelete = async () => {
    const operationKey = `delete-${transaction.id}`;
    
    if (operationTracker.has(operationKey)) return;

    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    operationTracker.add(operationKey);

    try {
      if (transaction.type === 'expense') {
        const accountId = transaction.account_id || transaction.source_account_id;
        if (accountId) {
          const { error: balanceError } = await supabase.rpc('update_account_balance', {
            account_id: accountId,
            amount_change: transaction.amount
          });
          if (balanceError) throw balanceError;
        }
      } else if (transaction.type === 'income') {
        const accountId = transaction.account_id || transaction.destination_account_id;
        if (accountId) {
          const { error: balanceError } = await supabase.rpc('update_account_balance', {
            account_id: accountId,
            amount_change: -transaction.amount
          });
          if (balanceError) throw balanceError;
        }
      } else if (transaction.type === 'transfer') {
        if (transaction.source_account_id) {
          const { error: sourceError } = await supabase.rpc('update_account_balance', {
            account_id: transaction.source_account_id,
            amount_change: transaction.amount
          });
          if (sourceError) throw sourceError;
        }
        if (transaction.destination_account_id) {
          const { error: destError } = await supabase.rpc('update_account_balance', {
            account_id: transaction.destination_account_id,
            amount_change: -transaction.amount
          });
          if (destError) throw destError;
        }
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: 'Transaction deleted',
        description: 'Transaction has been deleted and balances have been updated.',
      });

      onDelete();
      navigate('/transactions');
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete transaction.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    } finally {
      operationTracker.delete(operationKey);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'transfer':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800';
      case 'income':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800';
      case 'transfer':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const categoryInfo = getCurrentCategory();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            <Edit className="h-4 w-4" />
            Edit Transaction
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditData({
                  description: transaction.description || '',
                  amount: transaction.amount.toString(),
                  notes: transaction.notes || '',
                  date: new Date(transaction.date).toISOString().slice(0, 16),
                  category_id: transaction.category_id || '',
                });
              }}
              className="flex items-center gap-2"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
        
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isUpdating}
          className={`flex items-center gap-2 ${
            isDeleting ? 'bg-destructive hover:bg-destructive/90' : ''
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? 'Confirm Delete' : 'Delete'}
        </Button>
      </div>

      {/* Main Transaction Card */}
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Category Icon */}
              <div 
                className="w-16 h-16 border-2 border-border rounded-2xl flex items-center justify-center text-2xl shadow-sm relative"
                style={{ backgroundColor: `${categoryInfo.color}20` }}
              >
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: categoryInfo.color }}
                />
                {categoryInfo.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Description */}
                {isEditing ? (
                  <Input
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="text-xl font-semibold mb-2 bg-background"
                    placeholder="Transaction description"
                    disabled={isUpdating}
                  />
                ) : (
                  <h1 className="text-xl font-semibold text-foreground mb-2 break-words">
                    {transaction.description || 'Untitled Transaction'}
                  </h1>
                )}
                
                {/* Meta Information */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  <span className="font-medium">{categoryInfo.name}</span>
                  <span>•</span>
                  <span>{transaction.account_name}</span>
                  <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(transaction.type)}`}>
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Amount Display */}
            <div className="text-right">
              {isEditing ? (
                <Input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="text-right text-2xl font-bold w-40 bg-background"
                  step="0.01"
                  disabled={isUpdating}
                />
              ) : (
                <div className="space-y-1">
                  <div className={`text-3xl font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {transaction.transaction_type} transaction
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Category Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Category
            </div>
            {isEditing ? (
              <Select 
                value={editData.category_id} 
                onValueChange={(value) => setEditData({ ...editData, category_id: value })}
                disabled={isUpdating}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(cat => cat.type === transaction.type)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon || '📝'}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-muted/20 rounded-lg py-3 px-4 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border"
                  style={{ backgroundColor: `${categoryInfo.color}20`, borderColor: categoryInfo.color }}
                >
                  {categoryInfo.icon}
                </div>
                <span className="font-medium text-foreground">{categoryInfo.name}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Date Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date & Time
            </div>
            {isEditing ? (
              <Input
                type="datetime-local"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="bg-background"
                disabled={isUpdating}
              />
            ) : (
              <p className="text-foreground pl-6 bg-muted/20 rounded-lg py-3 px-4">
                {formatDate(transaction.date)}
              </p>
            )}
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Notes
            </div>
            {isEditing ? (
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="bg-background text-foreground placeholder:text-muted-foreground min-h-[100px]"
                placeholder="Add notes about this transaction..."
                rows={4}
                disabled={isUpdating}
              />
            ) : (
              <div className="bg-muted/20 rounded-lg py-3 px-4 min-h-[60px] text-foreground">
                {transaction.notes ? (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {transaction.notes}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No notes added to this transaction
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Transfer Details */}
          {transaction.transaction_type === 'transfer' && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  Transfer Details
                </div>
                <div className="bg-muted/20 rounded-lg py-3 px-4 space-y-2">
                  {transaction.source_account_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium text-foreground">{transaction.source_account_name}</span>
                    </div>
                  )}
                  {transaction.destination_account_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-medium text-foreground">{transaction.destination_account_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Transaction ID */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Transaction ID
            </div>
            <p className="text-xs text-muted-foreground font-mono bg-muted/20 rounded-lg py-2 px-3 break-all">
              {transaction.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
