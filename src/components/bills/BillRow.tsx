
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Trash, Wallet } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { useAccountsData } from '@/hooks/useAccountsData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BillRowProps {
  bill: any;
  onUpdate: (updates: any) => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit?: () => void;
}

const BillRow: React.FC<BillRowProps> = ({ bill, onUpdate, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: bill.name,
    repeat_pattern: bill.repeat_pattern,
    category_id: bill.category_id,
    amount: bill.amount,
    type: bill.type,
    account_id: bill.account_id,
    specific_day: bill.specific_day
  });
  const { categories } = useCategoriesData();
  const { accounts } = useAccountsData();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: bill.name,
      repeat_pattern: bill.repeat_pattern,
      category_id: bill.category_id,
      amount: bill.amount,
      type: bill.type,
      account_id: bill.account_id,
      specific_day: bill.specific_day
    });
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;
  const formatFrequency = (pattern: string, specificDay: number | null) => {
    const patterns: { [key: string]: string } = {
      monthly: 'Monthly',
      yearly: 'Yearly',
      weekly: 'Weekly',
      specific_dates: 'Custom'
    };
    
    let frequency = patterns[pattern] || pattern;
    if (specificDay && (pattern === 'monthly' || pattern === 'yearly')) {
      frequency += ` (Day ${specificDay})`;
    }
    return frequency;
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'No category';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}`.trim() : 'Unknown';
  };

  const getAccountName = (accountId: string | null) => {
    if (!accountId) return 'No account';
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Unknown';
  };

  const filteredCategories = categories.filter(cat => cat.type === editData.type);
  const activeAccounts = accounts.filter(account => !account.is_archived);

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-finapp-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.repeat_pattern}
            onValueChange={(value) => setEditData({ ...editData, repeat_pattern: value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="specific_dates">Custom</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select
            value={editData.account_id || ''}
            onValueChange={(value) => setEditData({ ...editData, account_id: value || null })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              {activeAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    {account.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select
            value={editData.category_id || ''}
            onValueChange={(value) => setEditData({ ...editData, category_id: value || null })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <input
            type="number"
            step="0.01"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-2 py-1 text-sm border border-finapp-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editData.type}
            onValueChange={(value) => setEditData({ ...editData, type: value, category_id: null })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="h-7 px-2 text-xs"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-2 text-xs"
            >
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="group hover:bg-finapp-muted/30 transition-colors">
      <TableCell className="font-medium text-foreground">
        {bill.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFrequency(bill.repeat_pattern, bill.specific_day)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-1">
          <Wallet className="w-3 h-3" />
          {getAccountName(bill.account_id)}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {getCategoryName(bill.category_id)}
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {formatCurrency(bill.amount)}
      </TableCell>
      <TableCell>
        <Badge 
          variant="secondary"
          className={bill.type === 'income' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
          }
        >
          {bill.type === 'income' ? 'Income' : 'Expense'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete} 
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default BillRow;
