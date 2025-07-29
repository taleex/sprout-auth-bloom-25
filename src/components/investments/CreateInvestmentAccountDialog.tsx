import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';

// Predefined account colors
const accountColors = [
  { value: '#93c5fd', label: 'Blue (Default)' },
  { value: '#cbf587', label: 'Green' },
  { value: '#fdba74', label: 'Orange' },
  { value: '#c4b5fd', label: 'Purple' },
  { value: '#f9a8d4', label: 'Pink' },
  { value: '#a3a3a3', label: 'Gray' },
];

// Investment account icons
const accountIcons = [
  { value: 'trending-up', label: 'Trending Up (Default)' },
  { value: 'line-chart', label: 'Line Chart' },
  { value: 'bar-chart', label: 'Bar Chart' },
  { value: 'target', label: 'Target' },
  { value: 'piggy-bank', label: 'Piggy Bank' },
  { value: 'coins', label: 'Coins' },
];

interface FormValues {
  name: string;
  total_deposits: number;
  currency: string;
  account_type: string;
  color: string;
  icon: string;
}

const CreateInvestmentAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { refreshAccounts } = useInvestmentAccounts();

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      total_deposits: 0,
      currency: 'EUR',
      account_type: 'investment',
      color: '#93c5fd',
      icon: 'trending-up',
    },
  });

  // Reset form when the drawer opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        total_deposits: 0,
        currency: 'EUR',
        account_type: 'investment',
        color: '#93c5fd',
        icon: 'trending-up',
      });
    }
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('investment_accounts')
        .insert({
          user_id: user.user.id,
          name: values.name.trim(),
          total_deposits: values.total_deposits,
        });

      if (error) throw error;

      toast({
        title: "Investment Account Created",
        description: `"${values.name}" has been successfully created.`,
      });

      refreshAccounts();
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create investment account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        size="sm" 
        className="flex items-center gap-2 bg-finapp-accent hover:bg-finapp-accent/90 text-black"
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        Add Account
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Investment Account</SheetTitle>
            <SheetDescription>
              Add a new investment account to track your portfolio.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Account name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Crypto Portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_deposits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Deposit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
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
                          <SelectItem value="investment">Investment</SelectItem>
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

                <SheetFooter className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)} 
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-finapp-accent hover:bg-finapp-accent/90 text-black"
                  >
                    Create Account
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateInvestmentAccountDialog;