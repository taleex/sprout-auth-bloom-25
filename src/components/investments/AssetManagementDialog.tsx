import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Settings, Edit, TrendingDown, TrendingUp, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAllocations } from '@/hooks/useAllocations';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import { InvestmentAccount, Allocation } from '@/types/investments';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EditAssetDialog from './EditAssetDialog';
import SellAssetDialog from './SellAssetDialog';
interface AssetManagementDialogProps {
  account: InvestmentAccount;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const AssetManagementDialog: React.FC<AssetManagementDialogProps> = ({
  account,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const {
    allocations,
    loading,
    refetch
  } = useAllocations(account.id);
  const { refreshAccounts } = useInvestmentAccounts();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Use external control if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from('investment_accounts')
        .delete()
        .eq('id', account.id);

      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: `"${account.name}" has been successfully deleted.`,
      });

      refreshAccounts();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter active allocations
  const activeAllocations = allocations.filter(allocation => allocation.is_active);
  const totalActivePercentage = activeAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
  const cashPercentage = Math.max(0, 100 - totalActivePercentage);
  const calculateCurrentValue = (allocation: Allocation) => {
    if (!allocation.assets) return 0;
    const shares = allocation.invested_amount / allocation.purchase_price;
    return shares * allocation.assets.current_price;
  };
  const calculateGainLoss = (allocation: Allocation) => {
    const currentValue = calculateCurrentValue(allocation);
    return currentValue - allocation.invested_amount;
  };
  const calculateGainLossPercentage = (allocation: Allocation) => {
    const gainLoss = calculateGainLoss(allocation);
    return allocation.invested_amount > 0 ? gainLoss / allocation.invested_amount * 100 : 0;
  };
  const DialogWrapper = isMobile ? Drawer : Dialog;
  const DialogContentWrapper = isMobile ? DrawerContent : DialogContent;
  const DialogHeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
  const DialogTitleWrapper = isMobile ? DrawerTitle : DialogTitle;
  return <DialogWrapper open={open} onOpenChange={setOpen}>
      <DialogContentWrapper className={isMobile ? "w-full flex flex-col pb-8" : "w-full max-w-6xl flex flex-col pb-8"}>
        <DialogHeaderWrapper className="shrink-0">
          <DialogTitleWrapper className="text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-semibold">{account.name}</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal">Portfolio Management</div>
              </div>
            </div>
          </DialogTitleWrapper>
        </DialogHeaderWrapper>
        
        <div className={`overflow-y-auto ${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4 sm:space-y-6`}>
          {/* Portfolio Summary */}
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="group text-center sm:text-left hover-scale">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    €{account.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="group text-center sm:text-left hover-scale">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Allocated</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    {totalActivePercentage.toFixed(1)}%
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out animate-fade-in"
                        style={{ width: `${Math.min(totalActivePercentage, 100)}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 h-3 bg-gradient-to-r from-transparent via-background/20 to-transparent rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                
                <div className="group text-center sm:text-left hover-scale">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Cash Position</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary-foreground mb-1">
                    {cashPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    €{(account.current_value * cashPercentage / 100).toLocaleString()}
                  </div>
                </div>
                
                <div className="group text-center sm:text-left hover-scale">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <svg className="h-4 w-4 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Active Assets</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-accent-foreground mb-1">
                    {activeAllocations.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {activeAllocations.length === 1 ? 'position' : 'positions'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Over-allocation Warning */}
          {totalActivePercentage > 100 && (
            <Card className="border-destructive bg-destructive/10 animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-destructive">
                      Portfolio Over-Allocated ({totalActivePercentage.toFixed(1)}%)
                    </div>
                    <div className="text-xs text-destructive/80">
                      Please reduce allocations to fix this issue.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Assets List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Positions</h3>
              {activeAllocations.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeAllocations.length} {activeAllocations.length === 1 ? 'asset' : 'assets'}
                </Badge>
              )}
            </div>
            
            <div className={`max-h-[50vh] overflow-y-auto rounded-lg border bg-card/50`}>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-sm text-muted-foreground">Loading assets...</div>
                  </div>
                </div>
              ) : activeAllocations.length > 0 ? (
                <div className="space-y-3 p-4">
                  {activeAllocations.map(allocation => {
                    const currentValue = calculateCurrentValue(allocation);
                    const gainLoss = calculateGainLoss(allocation);
                    const gainLossPercentage = calculateGainLossPercentage(allocation);
                    const isPositive = gainLoss >= 0;
                    
                    return (
                      <Card key={allocation.id} className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col gap-4">
                            {/* Asset Info */}
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary/80 to-secondary flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-secondary-foreground">
                                  {allocation.assets?.symbol.substring(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate">
                                  {allocation.assets?.symbol} - {allocation.assets?.name}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs w-fit">
                                    {allocation.percentage}% allocation
                                  </Badge>
                                  <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    <span>
                                      {isPositive ? '+' : ''}€{Math.abs(gainLoss).toLocaleString()} 
                                      ({isPositive ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Values Grid */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <div className="text-muted-foreground">Invested</div>
                                <div className="font-semibold">€{allocation.invested_amount.toLocaleString()}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-muted-foreground">Current Value</div>
                                <div className="font-semibold">€{currentValue.toLocaleString()}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-muted-foreground">Purchase Price</div>
                                <div className="font-medium">€{allocation.purchase_price.toLocaleString()}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-muted-foreground">Current Price</div>
                                <div className="font-medium">€{allocation.assets?.current_price.toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 border-t border-border/30">
                              <EditAssetDialog allocation={allocation} onSuccess={refetch} />
                              <SellAssetDialog allocation={allocation} onSuccess={refetch} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-medium text-muted-foreground mb-2">No Active Assets</div>
                  <div className="text-sm text-muted-foreground max-w-sm">
                    Start building your portfolio by adding your first asset allocation
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cash Position */}
          {cashPercentage > 0 && (
            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200/50 dark:from-green-950/20 dark:to-emerald-900/20 dark:border-green-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-lg">💰</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-green-800 dark:text-green-200">
                        Cash Position
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {cashPercentage.toFixed(1)}% of portfolio unallocated
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-700 dark:text-green-300">
                      €{(account.current_value * cashPercentage / 100).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Available to invest</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delete Account Section */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-destructive">Danger Zone</div>
                    <div className="text-xs text-muted-foreground">
                      Permanently delete this investment account
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="shrink-0">
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the 
                        investment account "{account.name}" and all associated data including 
                        asset allocations and transaction history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContentWrapper>
    </DialogWrapper>;
};
export default AssetManagementDialog;