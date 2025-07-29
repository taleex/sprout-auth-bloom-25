import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Allocation } from '@/types/investments';

interface EditAssetDialogProps {
  allocation: Allocation;
  onSuccess: () => void;
}

const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ allocation, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    percentage: allocation.percentage,
    purchase_price: allocation.purchase_price,
    invested_amount: allocation.invested_amount,
    investment_start_date: new Date(allocation.investment_start_date)
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (formData.percentage <= 0 || formData.percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Percentage must be between 0.1% and 100%",
        variant: "destructive",
      });
      return;
    }

    if (formData.purchase_price <= 0 || formData.invested_amount <= 0) {
      toast({
        title: "Invalid Values",
        description: "Purchase price and invested amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('allocations')
        .update({
          percentage: formData.percentage,
          purchase_price: formData.purchase_price,
          invested_amount: formData.invested_amount,
          investment_start_date: format(formData.investment_start_date, 'yyyy-MM-dd')
        })
        .eq('id', allocation.id);

      if (error) throw error;

      toast({
        title: "Asset Updated",
        description: "Asset allocation has been updated successfully.",
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error updating asset:', error);
      
      // Handle specific validation errors
      if (error.message?.includes('allocation percentage')) {
        toast({
          title: "Allocation Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update asset allocation. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit size={12} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Asset - {allocation.assets?.symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Portfolio Allocation Percentage */}
          <div className="space-y-2">
            <Label htmlFor="percentage">Portfolio Allocation (%)</Label>
            <Input
              id="percentage"
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                percentage: Number(e.target.value) 
              }))}
            />
          </div>

          {/* Purchase Price */}
          <div className="space-y-2">
            <Label htmlFor="purchase-price">Purchase Price (€)</Label>
            <Input
              id="purchase-price"
              type="number"
              min="0"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                purchase_price: Number(e.target.value) 
              }))}
            />
          </div>

          {/* Invested Amount */}
          <div className="space-y-2">
            <Label htmlFor="invested-amount">Amount Invested (€)</Label>
            <Input
              id="invested-amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.invested_amount}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                invested_amount: Number(e.target.value) 
              }))}
            />
          </div>

          {/* Investment Start Date */}
          <div className="space-y-2">
            <Label>Investment Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.investment_start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.investment_start_date ? (
                    format(formData.investment_start_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.investment_start_date}
                  onSelect={(date) => date && setFormData(prev => ({ 
                    ...prev, 
                    investment_start_date: date 
                  }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update Asset'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetDialog;