
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Account } from '@/types/accounts';

const accountTypes = [
  { value: 'main', label: 'Main' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
  { value: 'goals', label: 'Goals' },
];

const currencyOptions = ['EUR', 'USD', 'GBP'];

const colorOptions = [
  { value: '#cbf587', label: 'Green' },
  { value: '#87b1f5', label: 'Blue' },
  { value: '#f587cb', label: 'Pink' },
  { value: '#f5d787', label: 'Yellow' },
  { value: '#9887f5', label: 'Purple' },
];

interface InlineAccountFormProps {
  onSave: (account: Partial<Account>) => void;
  onCancel: () => void;
  initialValues?: Partial<Account>;
}

const InlineAccountForm: React.FC<InlineAccountFormProps> = ({ 
  onSave, 
  onCancel,
  initialValues = {} 
}) => {
  const [name, setName] = useState(initialValues.name || '');
  const [balance, setBalance] = useState(initialValues.balance?.toString() || '0');
  const [currency, setCurrency] = useState(initialValues.currency || 'EUR');
  const [accountType, setAccountType] = useState<'main' | 'savings' | 'investment' | 'goals'>(
    (initialValues.account_type as 'main' | 'savings' | 'investment' | 'goals') || 'main'
  );
  const [color, setColor] = useState(initialValues.color || '#cbf587');
  const [hideBalance, setHideBalance] = useState(initialValues.hide_balance || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    setIsSaving(true);
    
    try {
      const accountData: Partial<Account> = {
        name: name.trim(),
        balance: parseFloat(balance) || 0,
        currency,
        account_type: accountType,
        color,
        hide_balance: hideBalance,
      };

      // If we're editing an existing account, include the ID
      if (initialValues.id) {
        accountData.id = initialValues.id;
      }

      await onSave(accountData);
    } catch (error) {
      console.error('Error saving account:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full bg-card shadow-sm border mb-4">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input 
            id="name"
            placeholder="e.g. My Checking Account" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoFocus 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="balance">Initial Balance</Label>
          <Input 
            id="balance"
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            value={balance} 
            onChange={(e) => setBalance(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={(value) => setCurrency(value)}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((curr) => (
                <SelectItem key={curr} value={curr}>{curr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account-type">Account Type</Label>
          <Select 
            value={accountType} 
            onValueChange={(value) => {
              setAccountType(value as 'main' | 'savings' | 'investment' | 'goals');
            }}
          >
            <SelectTrigger id="account-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color Tag</Label>
          <Select value={color} onValueChange={(value) => setColor(value)}>
            <SelectTrigger id="color">
              <SelectValue>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: color }} 
                  />
                  {colorOptions.find(c => c.value === color)?.label || 'Custom'}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map(colorOption => (
                <SelectItem key={colorOption.value} value={colorOption.value}>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: colorOption.value }} 
                    />
                    {colorOption.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="hide-balance" 
            checked={!hideBalance} 
            onCheckedChange={(checked) => setHideBalance(!checked)} 
          />
          <Label htmlFor="hide-balance">Include in total balance</Label>
        </div>
        
        <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            <Check className="mr-2 h-4 w-4" /> 
            {isSaving ? 'Saving...' : 'Save Account'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineAccountForm;
