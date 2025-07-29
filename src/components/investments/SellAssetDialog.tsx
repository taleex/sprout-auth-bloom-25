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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Allocation } from '@/types/investments';

interface SellAssetDialogProps {
  allocation: Allocation;
  onSuccess: () => void;
}

type SellType = 'full' | 'partial';
type RedistributionMethod = 'cash' | 'proportional' | 'manual';

const SellAssetDialog: React.FC<SellAssetDialogProps> = ({ allocation, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellType, setSellType] = useState<SellType>('full');
  const [redistributionMethod, setRedistributionMethod] = useState<RedistributionMethod>('cash');
  const [sellPercentage, setSellPercentage] = useState(50);
  const [sellPrice, setSellPrice] = useState(allocation.assets?.current_price || 0);
  const { toast } = useToast();

  const calculateCurrentValue = () => {
    if (!allocation.assets) return 0;
    const shares = allocation.invested_amount / allocation.purchase_price;
    return shares * allocation.assets.current_price;
  };

  const calculateSellValue = () => {
    const currentValue = calculateCurrentValue();
    if (sellType === 'full') {
      return currentValue;
    } else {
      return (currentValue * sellPercentage) / 100;
    }
  };

  const calculateGainLoss = () => {
    const sellValue = calculateSellValue();
    const investedPortion = sellType === 'full' 
      ? allocation.invested_amount 
      : (allocation.invested_amount * sellPercentage) / 100;
    return sellValue - investedPortion;
  };

  const handleSell = async () => {
    if (sellPrice <= 0) {
      toast({
        title: "Invalid Sell Price",
        description: "Sell price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (sellType === 'partial' && (sellPercentage <= 0 || sellPercentage >= 100)) {
      toast({
        title: "Invalid Sell Percentage",
        description: "Sell percentage must be between 1% and 99%",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (sellType === 'full') {
        // Mark allocation as sold (inactive)
        const { error } = await supabase
          .from('allocations')
          .update({
            is_active: false,
            sold_date: new Date().toISOString().split('T')[0],
            sold_price: sellPrice
          })
          .eq('id', allocation.id);

        if (error) throw error;

        toast({
          title: "Asset Sold",
          description: `Successfully sold all of ${allocation.assets?.symbol}`,
        });
      } else {
        // Partial sell: reduce the allocation
        const newPercentage = allocation.percentage * (1 - sellPercentage / 100);
        const newInvestedAmount = allocation.invested_amount * (1 - sellPercentage / 100);

        const { error } = await supabase
          .from('allocations')
          .update({
            percentage: newPercentage,
            invested_amount: newInvestedAmount
          })
          .eq('id', allocation.id);

        if (error) throw error;

        toast({
          title: "Partial Sale Completed",
          description: `Sold ${sellPercentage}% of ${allocation.assets?.symbol}`,
        });
      }

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error selling asset:', error);
      toast({
        title: "Sale Failed",
        description: "Failed to process the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSellType('full');
    setRedistributionMethod('cash');
    setSellPercentage(50);
    setSellPrice(allocation.assets?.current_price || 0);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1">
          <TrendingDown size={12} />
          Sell
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown size={20} />
            Sell Asset - {allocation.assets?.symbol}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Position Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Current Value</div>
                  <div className="font-semibold">€{calculateCurrentValue().toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Invested Amount</div>
                  <div className="font-semibold">€{allocation.invested_amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current Price</div>
                  <div className="font-semibold">€{allocation.assets?.current_price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Portfolio %</div>
                  <div className="font-semibold">{allocation.percentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sell Type Selection */}
          <div className="space-y-3">
            <Label>Sell Type</Label>
            <RadioGroup value={sellType} onValueChange={(value) => setSellType(value as SellType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full">Sell All (Complete Exit)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial">Partial Sale</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Partial Sale Options */}
          {sellType === 'partial' && (
            <div className="space-y-3">
              <Label htmlFor="sell-percentage">Percentage to Sell (%)</Label>
              <Input
                id="sell-percentage"
                type="number"
                min="1"
                max="99"
                value={sellPercentage}
                onChange={(e) => setSellPercentage(Number(e.target.value))}
              />
            </div>
          )}

          {/* Sell Price */}
          <div className="space-y-2">
            <Label htmlFor="sell-price">Sell Price per Share (€)</Label>
            <Input
              id="sell-price"
              type="number"
              min="0"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
            />
            <div className="text-xs text-muted-foreground">
              Current market price: €{allocation.assets?.current_price.toLocaleString()}
            </div>
          </div>

          <Separator />

          {/* Sale Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-3">Sale Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Sale Value</div>
                  <div className="font-semibold">€{calculateSellValue().toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Gain/Loss</div>
                  <div className={`font-semibold ${calculateGainLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateGainLoss() >= 0 ? '+' : ''}€{calculateGainLoss().toLocaleString()}
                  </div>
                </div>
                {sellType === 'partial' && (
                  <>
                    <div>
                      <div className="text-muted-foreground">Remaining %</div>
                      <div className="font-semibold">
                        {(allocation.percentage * (1 - sellPercentage / 100)).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Remaining Value</div>
                      <div className="font-semibold">
                        €{(calculateCurrentValue() * (1 - sellPercentage / 100)).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Warning for Full Sale */}
          {sellType === 'full' && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <div className="font-medium">Complete Asset Sale</div>
                    <div className="text-xs mt-1">
                      This will completely remove {allocation.assets?.symbol} from your portfolio. 
                      The freed allocation will be converted to cash position.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
              onClick={handleSell} 
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              {loading ? 'Processing...' : sellType === 'full' ? 'Sell All' : 'Sell Partial'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellAssetDialog;