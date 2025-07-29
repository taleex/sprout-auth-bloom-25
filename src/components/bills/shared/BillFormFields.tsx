
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, CreditCard, Calendar, CalendarDays, BarChart3, Target } from 'lucide-react';
import { NewBillData } from '@/types/bills';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import AccountSelect from '../AccountSelect';
import SpecificDaySelect from '../SpecificDaySelect';

interface BillFormFieldsProps {
  bill: NewBillData;
  onUpdateBill: (updates: Partial<NewBillData>) => void;
  layout?: 'grid' | 'vertical';
}

const BillFormFields: React.FC<BillFormFieldsProps> = ({
  bill,
  onUpdateBill,
  layout = 'grid'
}) => {
  const { categories, isLoading: categoriesLoading } = useCategoriesData();
  const filteredCategories = categories.filter(cat => cat.type === bill.type);

  const fieldClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-6';

  const inputBaseClasses = "w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background border border-border text-foreground placeholder:text-muted-foreground hover:border-muted-foreground";

  const labelClasses = "block text-sm font-medium text-foreground";

  return (
    <div className={fieldClasses}>
      <div className="space-y-2">
        <label className={labelClasses}>Bill Name *</label>
        <input
          type="text"
          value={bill.name}
          onChange={(e) => onUpdateBill({ name: e.target.value })}
          placeholder="e.g., Salary, Rent, Netflix"
          className={inputBaseClasses}
        />
      </div>
      
      <div className="space-y-2">
        <label className={labelClasses}>Type *</label>
        <Select
          value={bill.type}
          onValueChange={(value) => onUpdateBill({ type: value, category_id: null })}
        >
          <SelectTrigger className="w-full border-border bg-background text-foreground hover:border-muted-foreground transition-colors">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Income
              </div>
            </SelectItem>
            <SelectItem value="expense">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-600" />
                Expense
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className={labelClasses}>Amount (€) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={bill.amount}
          onChange={(e) => onUpdateBill({ amount: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className={inputBaseClasses}
        />
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Account *</label>
        <AccountSelect
          value={bill.account_id}
          onValueChange={(value) => onUpdateBill({ account_id: value })}
          placeholder="Select account to affect"
          required={true}
        />
      </div>
      
      <div className="space-y-2">
        <label className={labelClasses}>Frequency</label>
        <Select
          value={bill.repeat_pattern}
          onValueChange={(value) => onUpdateBill({ 
            repeat_pattern: value,
            specific_day: (value === 'weekly' || value === 'specific_dates') ? null : bill.specific_day 
          })}
        >
          <SelectTrigger className="w-full border-border bg-background text-foreground hover:border-muted-foreground transition-colors">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Monthly
              </div>
            </SelectItem>
            <SelectItem value="yearly">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Yearly
              </div>
            </SelectItem>
            <SelectItem value="weekly">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Weekly
              </div>
            </SelectItem>
            <SelectItem value="specific_dates">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Custom Dates
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SpecificDaySelect
        value={bill.specific_day}
        onValueChange={(value) => onUpdateBill({ specific_day: value })}
        repeatPattern={bill.repeat_pattern}
      />
      
      <div className="space-y-2">
        <label className={labelClasses}>Category</label>
        <Select
          value={bill.category_id || ''}
          onValueChange={(value) => onUpdateBill({ category_id: value || null })}
          disabled={categoriesLoading}
        >
          <SelectTrigger className="w-full border-border bg-background text-foreground hover:border-muted-foreground transition-colors">
            <SelectValue placeholder="Select category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-category">No category</SelectItem>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Notes</label>
        <textarea
          value={bill.notes || ''}
          onChange={(e) => onUpdateBill({ notes: e.target.value || null })}
          placeholder="Optional notes..."
          rows={layout === 'vertical' ? 3 : 1}
          className={`${inputBaseClasses} resize-none`}
        />
      </div>
    </div>
  );
};

export default BillFormFields;
