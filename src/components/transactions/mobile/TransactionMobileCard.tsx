
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Transaction } from '@/types/transactions';
import { formatCurrency } from '@/lib/utils';
import { useCategoryInfo } from '@/utils/categoryUtils';

interface TransactionMobileCardProps {
  transaction: Transaction;
  onDeleteClick: (transaction: Transaction, e: React.MouseEvent) => void;
}

export const TransactionMobileCard: React.FC<TransactionMobileCardProps> = ({
  transaction,
  onDeleteClick,
}) => {
  const { getCategoryInfo } = useCategoryInfo();
  const categoryInfo = getCategoryInfo(transaction);

  return (
    <Card className="bg-card border border-border hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <Link 
          to={`/transactions/${transaction.id}`}
          className="block p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg flex-shrink-0 relative">
                <div 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: categoryInfo.color }}
                />
                {categoryInfo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {transaction.description || 'Transaction'}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="truncate">{categoryInfo.name}</span>
                  <span>•</span>
                  <span className="truncate">{transaction.account_name}</span>
                  {transaction.transaction_type === 'transfer' && (
                    <>
                      <span>•</span>
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5"
                      >
                        Transfer
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <div className={`font-semibold text-sm ${
                  transaction.type === 'expense' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs text-muted-foreground/70 capitalize">
                  {transaction.transaction_type}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-muted"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={`/transactions/${transaction.id}`}
                      className="flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => onDeleteClick(transaction, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
