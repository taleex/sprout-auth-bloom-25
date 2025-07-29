import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PieChart, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useAllocations } from '@/hooks/useAllocations';
import { InvestmentAccount } from '@/types/investments';
import PriceIndicator from './PriceIndicator';
import { format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

interface PortfolioViewProps {
  account: InvestmentAccount;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ account }) => {
  const { allocations, loading } = useAllocations(account.id);

  const calculateAssetValue = (allocation: any) => {
    if (!allocation.assets || !allocation.is_active) return 0;
    
    // Use new investment tracking if available (invested_amount and purchase_price)
    if (allocation.purchase_price && allocation.purchase_price > 0 && 
        allocation.invested_amount && allocation.invested_amount > 0) {
      const shares = allocation.invested_amount / allocation.purchase_price;
      return shares * allocation.assets.current_price;
    }
    
    // Fallback to old calculation for existing allocations (percentage and initial_price)
    if (allocation.initial_price && allocation.initial_price > 0 && allocation.percentage > 0) {
      const allocatedAmount = (account.total_deposits * allocation.percentage) / 100;
      const priceRatio = allocation.assets.current_price / allocation.initial_price;
      return allocatedAmount * priceRatio;
    }
    
    return 0;
  };

  const calculateAssetGainLoss = (allocation: any) => {
    if (!allocation.assets || !allocation.is_active) return 0;
    
    const currentValue = calculateAssetValue(allocation);
    
    // Use new investment tracking if available
    if (allocation.purchase_price && allocation.purchase_price > 0 && 
        allocation.invested_amount && allocation.invested_amount > 0) {
      return currentValue - allocation.invested_amount;
    }
    
    // Fallback to old calculation for existing allocations
    if (allocation.initial_price && allocation.initial_price > 0 && allocation.percentage > 0) {
      const allocatedAmount = (account.total_deposits * allocation.percentage) / 100;
      return currentValue - allocatedAmount;
    }
    
    return 0;
  };

  const calculateInvestmentPeriod = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    
    const years = differenceInYears(now, start);
    const months = differenceInMonths(now, start) % 12;
    const days = differenceInDays(now, start) % 30;
    
    if (years > 0) {
      return `${years}y ${months}m`;
    } else if (months > 0) {
      return `${months}m ${days}d`;
    } else {
      return `${days}d`;
    }
  };

  // Only consider active allocations for calculations
  const activeAllocations = allocations.filter(allocation => allocation.is_active !== false);
  const totalAllocatedPercentage = activeAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
  const cashPercentage = Math.max(0, 100 - totalAllocatedPercentage);
  const cashValue = (account.total_deposits * cashPercentage) / 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <PieChart size={16} className="mr-1" />
          View Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{account.name} - Portfolio Details</DialogTitle>
        </DialogHeader>
        
        {/* Fixed Portfolio Summary */}
        <div className="flex-shrink-0 bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="text-lg font-semibold">
              €{account.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Deposits</span>
            <span className="text-sm">
              €{account.total_deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
            <div className={`flex items-center gap-1 text-sm ${
              account.current_value >= account.total_deposits ? 'text-green-600' : 'text-red-600'
            }`}>
              {account.current_value >= account.total_deposits ? 
                <TrendingUp size={14} /> : <TrendingDown size={14} />
              }
              <span>
                €{Math.abs(account.current_value - account.total_deposits).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Asset Allocations */}
        <div className="flex-1 min-h-0">
          <div className="mb-4">
            <h4 className="font-medium">Asset Allocations ({activeAllocations.length} active)</h4>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {activeAllocations.map((allocation) => {
                  const assetValue = calculateAssetValue(allocation);
                  const assetGainLoss = calculateAssetGainLoss(allocation);
                  const isPositive = assetGainLoss >= 0;
                  const hasNewTracking = allocation.purchase_price && allocation.invested_amount && allocation.investment_start_date;
                  
                  // Calculate percentage gain/loss
                  const investedAmount = hasNewTracking ? allocation.invested_amount : (account.total_deposits * allocation.percentage) / 100;
                  const percentageGain = investedAmount > 0 ? ((assetValue - investedAmount) / investedAmount) * 100 : 0;

                  return (
                    <div key={allocation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             <h5 className="font-medium">{allocation.assets?.name || 'Unknown Asset'}</h5>
                             <Badge variant="secondary" className="text-xs">
                               {allocation.assets?.symbol}
                             </Badge>
                             {allocation.assets && (
                               <PriceIndicator 
                                 priceChange24h={allocation.assets.price_change_24h} 
                                 size="sm" 
                                 showIcon={false}
                               />
                             )}
                           </div>
                          <p className="text-sm text-muted-foreground">
                            {allocation.percentage}% allocation
                            {hasNewTracking && allocation.investment_start_date && (
                              <span className="ml-2 inline-flex items-center gap-1">
                                <Calendar size={12} />
                                {calculateInvestmentPeriod(allocation.investment_start_date)}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">
                            €{assetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <div className={`flex items-center gap-1 text-sm justify-end ${
                            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>
                              {isPositive ? '+' : ''}€{Math.abs(assetGainLoss).toLocaleString('en-US', { 
                                minimumFractionDigits: 2, maximumFractionDigits: 2 
                              })}
                              {' '}({isPositive ? '+' : ''}{percentageGain.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">Invested:</span>
                            <span className="ml-1">
                              €{investedAmount.toLocaleString('en-US', { 
                                minimumFractionDigits: 2, maximumFractionDigits: 2 
                              })}
                            </span>
                          </div>
                          {hasNewTracking && (
                            <div>
                              <span className="font-medium">Purchase Price:</span>
                              <span className="ml-1">
                                €{allocation.purchase_price.toLocaleString('en-US', { 
                                  minimumFractionDigits: 2, maximumFractionDigits: 4 
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1">
                             <span className="font-medium">Current Price:</span>
                             <span className="ml-1">
                               €{allocation.assets?.current_price?.toLocaleString('en-US', { 
                                 minimumFractionDigits: 2, maximumFractionDigits: 4 
                               }) || '0.00'}
                             </span>
                             {allocation.assets?.update_frequency === 'realtime' && (
                               <span className="text-green-500 text-xs">●</span>
                             )}
                           </div>
                          {hasNewTracking && allocation.investment_start_date && (
                            <div>
                              <span className="font-medium">Started:</span>
                              <span className="ml-1">
                                {format(new Date(allocation.investment_start_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {hasNewTracking && allocation.purchase_price && allocation.assets?.current_price && (
                        <div className="pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Price Change:</span>
                            <span className={`ml-1 ${
                              allocation.assets.current_price >= allocation.purchase_price 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {allocation.assets.current_price >= allocation.purchase_price ? '+' : ''}
                              {(((allocation.assets.current_price / allocation.purchase_price) - 1) * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Cash Position */}
                {cashPercentage > 0 && (
                  <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">Cash</h5>
                        <p className="text-sm text-muted-foreground">
                          Unallocated funds • {cashPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          €{cashValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">No change</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeAllocations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No active assets allocated</p>
                    <p className="text-sm">Add assets to start building your portfolio</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioView;
