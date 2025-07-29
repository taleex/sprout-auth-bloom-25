
import React, { memo, useCallback } from 'react';
import { Account } from '@/types/accounts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onToggleVisibility: (id: string, hide_balance: boolean) => Promise<void>;
  formatCurrency: (amount: number, currency?: string) => string;
  accountTypeMap: Record<string, { label: string; color: string }>;
}

const AccountCard: React.FC<AccountCardProps> = memo(({ 
  account, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  formatCurrency, 
  accountTypeMap 
}) => {
  // Set a default color if none is specified
  const accountColor = account.color || '#cbf587';
  const typeInfo = accountTypeMap[account.account_type || 'main'] || { label: 'Other', color: 'bg-gray-100 text-gray-800' };
  
  const handleEdit = useCallback(() => {
    onEdit(account);
  }, [onEdit, account]);

  const handleDelete = useCallback(() => {
    onDelete(account.id);
  }, [onDelete, account.id]);
  
  return (
    <Card 
      className="overflow-hidden bg-card shadow-sm border border-border rounded-lg transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] animate-fade-in"
      style={{ borderLeft: `4px solid ${accountColor}` }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-foreground">{account.name}</h3>
              <Badge className={`text-xs ${typeInfo.color}`}>
                {typeInfo.label}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2 text-foreground tabular-nums">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-scale-in">
              <DropdownMenuItem onClick={handleEdit} className="hover-scale">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive hover-scale"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
});

AccountCard.displayName = 'AccountCard';

export default AccountCard;
