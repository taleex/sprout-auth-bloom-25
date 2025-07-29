import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAllocations } from '@/hooks/useAllocations';
import { supabase } from '@/integrations/supabase/client';
import { Allocation } from '@/types/investments';

interface PortfolioRebalanceDialogProps {
  accountId: string;
  currentTotalPercentage: number;
}

const PortfolioRebalanceDialog: React.FC<PortfolioRebalanceDialogProps> = ({ 
  accountId, 
  currentTotalPercentage 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rebalancedAllocations, setRebalancedAllocations] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const { allocations, refetch } = useAllocations(accountId);

  // Initialize rebalanced allocations with equal distribution
  const initializeEqualDistribution = () => {
    const equalPercentage = 100 / allocations.length;
    const newAllocations: { [key: string]: number } = {};
    allocations.forEach(allocation => {
      newAllocations[allocation.id] = Math.round(equalPercentage * 10) / 10; // Round to 1 decimal
    });
    setRebalancedAllocations(newAllocations);
  };

  // Initialize rebalanced allocations with proportional scaling
  const initializeProportionalScaling = () => {
    const scalingFactor = 100 / currentTotalPercentage;
    const newAllocations: { [key: string]: number } = {};
    allocations.forEach(allocation => {
      newAllocations[allocation.id] = Math.round(allocation.percentage * scalingFactor * 10) / 10;
    });
    setRebalancedAllocations(newAllocations);
  };

  const calculateNewTotal = () => {
    return Object.values(rebalancedAllocations).reduce((sum, percentage) => sum + percentage, 0);
  };

  const handleRebalance = async () => {
    const newTotal = calculateNewTotal();
    if (Math.abs(newTotal - 100) > 0.1) {
      toast({
        title: "Invalid Allocation",
        description: `Total allocation must equal 100% (currently ${newTotal.toFixed(1)}%)`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update all allocations
      const updates = Object.entries(rebalancedAllocations).map(([allocationId, percentage]) => 
        supabase
          .from('allocations')
          .update({ percentage })
          .eq('id', allocationId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error('Failed to update some allocations');
      }

      toast({
        title: "Portfolio Rebalanced",
        description: "Your portfolio allocations have been successfully updated.",
      });

      setOpen(false);
      refetch();
    } catch (error) {
      console.error('Error rebalancing portfolio:', error);
      toast({
        title: "Rebalancing Failed",
        description: "There was an error updating your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && allocations.length > 0) {
      initializeProportionalScaling();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50">
          <RotateCcw size={16} className="mr-1" />
          Rebalance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Rebalance Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Status */}
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/20 dark:to-amber-900/20 dark:border-amber-800/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Current Portfolio Status</h4>
                <Badge variant="destructive">
                  {currentTotalPercentage.toFixed(1)}% allocated
                </Badge>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Your portfolio is over-allocated. Please adjust the percentages below to total exactly 100%.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={initializeEqualDistribution}
              className="flex-1"
            >
              Equal Distribution
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={initializeProportionalScaling}
              className="flex-1"
            >
              Proportional Scaling
            </Button>
          </div>

          {/* Allocation Inputs */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Adjust Allocations</Label>
            {allocations.map((allocation) => (
              <div key={allocation.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {allocation.assets?.symbol} - {allocation.assets?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Currently: {allocation.percentage}%
                  </div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={rebalancedAllocations[allocation.id] || 0}
                    onChange={(e) => setRebalancedAllocations(prev => ({
                      ...prev,
                      [allocation.id]: Number(e.target.value)
                    }))}
                    className="text-right"
                  />
                </div>
                <span className="text-sm text-muted-foreground w-4">%</span>
              </div>
            ))}
          </div>

          {/* New Total */}
          <Card className={`${Math.abs(calculateNewTotal() - 100) <= 0.1 
            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30' 
            : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:from-red-950/20 dark:to-red-900/20 dark:border-red-800/30'
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">New Total Allocation:</span>
                <Badge variant={Math.abs(calculateNewTotal() - 100) <= 0.1 ? "default" : "destructive"}>
                  {calculateNewTotal().toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRebalance}
            disabled={loading || Math.abs(calculateNewTotal() - 100) > 0.1}
          >
            {loading ? 'Rebalancing...' : 'Apply Rebalancing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioRebalanceDialog;