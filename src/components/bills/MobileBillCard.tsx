
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Bill } from '@/types/bills';

interface MobileBillCardProps {
  bill: Bill;
  onUpdate: (updates: Partial<Bill>) => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit?: () => void;
}

const MobileBillCard: React.FC<MobileBillCardProps> = ({ bill, onUpdate, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBill, setEditedBill] = useState(bill);

  const handleSave = async () => {
    await onUpdate(editedBill);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBill(bill);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-[#cbf587] bg-[#cbf587]/5">
        <CardContent className="p-4 space-y-4">
          <input
            type="text"
            value={editedBill.name}
            onChange={(e) => setEditedBill({ ...editedBill, name: e.target.value })}
            placeholder="Bill name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={editedBill.repeat_pattern}
              onChange={(e) => setEditedBill({ ...editedBill, repeat_pattern: e.target.value as 'weekly' | 'monthly' | 'biweekly' | 'bimonthly' | 'quarterly' | 'yearly' })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
              <option value="specific_dates">Custom</option>
            </select>
            <input
              type="number"
              value={editedBill.amount}
              onChange={(e) => setEditedBill({ ...editedBill, amount: parseFloat(e.target.value) || 0 })}
              placeholder="Amount"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#cbf587] text-black hover:bg-[#b8e76f]"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-foreground">{bill.name}</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium text-foreground">€ {bill.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frequency:</span>
            <span className="capitalize">{bill.repeat_pattern}</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              bill.type === 'income' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {bill.type === 'income' ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileBillCard;
