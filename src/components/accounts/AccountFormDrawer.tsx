
import React from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '@/types/accounts';
import { toast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountFormDrawerProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
  isCreateMode: boolean;
  onSuccess: () => void;
}

// Predefined account colors
const accountColors = [
  { value: '#cbf587', label: 'Green (Default)' },
  { value: '#93c5fd', label: 'Blue' },
  { value: '#fdba74', label: 'Orange' },
  { value: '#c4b5fd', label: 'Purple' },
  { value: '#f9a8d4', label: 'Pink' },
  { value: '#a3a3a3', label: 'Gray' },
];

// Account type options
const accountTypes = [
  { value: 'main', label: 'Main Account' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
  { value: 'goals', label: 'Goals' },
];

// Predefined icons (we'll use emoji names for now)
const accountIcons = [
  { value: 'wallet', label: 'Wallet' },
  { value: 'bank', label: 'Bank' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'piggy-bank', label: 'Savings' },
  { value: 'trending-up', label: 'Investment' },
  { value: 'target', label: 'Goal' },
];

interface FormValues {
  name: string;
  balance: number;
  currency: string;
  account_type: string;
  color: string;
  icon: string;
  hide_balance: boolean;
}

const AccountFormDrawer = ({
  open,
  onClose,
  account,
  isCreateMode,
  onSuccess,
}: AccountFormDrawerProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: account?.name || '',
      balance: account?.balance || 0,
      currency: account?.currency || 'EUR',
      account_type: account?.account_type || 'main',
      color: account?.color || '#cbf587',
      icon: account?.icon || 'wallet',
      hide_balance: account?.hide_balance || false,
    },
  });

  // Reset form when the drawer opens or the account changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: account?.name || '',
        balance: account?.balance || 0,
        currency: account?.currency || 'EUR',
        account_type: account?.account_type || 'main',
        color: account?.color || '#cbf587',
        icon: account?.icon || 'wallet',
        hide_balance: account?.hide_balance || false,
      });
    }
  }, [open, account, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // For now, we'll just simulate a successful save without Supabase
      
      // Get existing accounts from localStorage or initialize empty array
      const existingAccounts = JSON.parse(localStorage.getItem('mockAccounts') || '[]');
      
      if (isCreateMode) {
        // Create new account with mock ID
        const newAccount: Account = {
          id: Date.now().toString(),
          user_id: 'mock-user',
          name: values.name,
          balance: values.balance,
          currency: values.currency,
          account_type: values.account_type as 'main' | 'savings' | 'investment' | 'goals',
          color: values.color,
          icon: values.icon,
          hide_balance: values.hide_balance,
          is_archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        existingAccounts.push(newAccount);
        localStorage.setItem('mockAccounts', JSON.stringify(existingAccounts));
        
        toast({
          title: "Account Created",
          description: `"${values.name}" has been successfully created.`,
        });
      } else if (account) {
        // Update existing account
        const updatedAccounts = existingAccounts.map((acc: Account) => 
          acc.id === account.id 
            ? { 
                ...acc, 
                name: values.name,
                balance: values.balance,
                currency: values.currency,
                account_type: values.account_type as 'main' | 'savings' | 'investment' | 'goals',
                color: values.color,
                icon: values.icon,
                hide_balance: values.hide_balance,
                updated_at: new Date().toISOString(),
              }
            : acc
        );
        
        localStorage.setItem('mockAccounts', JSON.stringify(updatedAccounts));
        
        toast({
          title: "Account Updated",
          description: `"${values.name}" has been successfully updated.`,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isCreateMode ? 'Create Account' : 'Edit Account'}</SheetTitle>
          <SheetDescription>
            {isCreateMode
              ? 'Add a new financial account to track your money.'
              : 'Update your account details.'}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Checking Account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value || '0'))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="EUR" defaultValue="EUR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountColors.map((color) => (
                          <SelectItem 
                            key={color.value} 
                            value={color.value}
                            className="flex items-center gap-2"
                          >
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hide_balance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Include in Total Balance</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this account in your homepage total balance
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-finapp-accent hover:bg-finapp-accent/90 text-black"
                >
                  {isCreateMode ? 'Create Account' : 'Save Changes'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountFormDrawer;
