import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, CalendarIcon, Download, Bitcoin, Building2, PieChart, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAssets } from '@/hooks/useAssets';
import { useAllocations } from '@/hooks/useAllocations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAssetSearch } from '@/hooks/useAssetSearch';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import PortfolioRebalanceDialog from './PortfolioRebalanceDialog';
import AssetFilters from './AssetFilters';
import AssetCard from './AssetCard';

interface InvestmentDetails {
  asset_id: string;
  percentage: number;
  invested_amount: number;
  purchase_price: number;
  investment_start_date: Date;
}

interface AddAssetDialogProps {
  accountId: string;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ accountId }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [investmentDetails, setInvestmentDetails] = useState<Partial<InvestmentDetails>>({
    investment_start_date: new Date(),
    percentage: 10,
    invested_amount: 1000,
    purchase_price: 0
  });
  const [loading, setLoading] = useState(false);
  const [populatingAssets, setPopulatingAssets] = useState(false);
  const { toast } = useToast();
  const { assets, loading: assetsLoading, refetch } = useAssets();
  const { allocations, refetch: refetchAllocations } = useAllocations(accountId);
  const isMobile = useIsMobile();

  // Get already allocated asset IDs (only active allocations)
  const allocatedAssetIds = useMemo(() => 
    new Set(allocations.filter(allocation => allocation.is_active !== false).map(allocation => allocation.asset_id)),
    [allocations]
  );

  // Asset search and filtering
  const {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    showOnlyPopular,
    setShowOnlyPopular,
    filteredAssets
  } = useAssetSearch({ assets, allocatedAssetIds });

  // Get current total allocation percentage (only active allocations)
  const currentTotalPercentage = allocations
    .filter(allocation => allocation.is_active !== false)
    .reduce((sum, allocation) => sum + allocation.percentage, 0);
  const remainingPercentage = Math.max(0, 100 - currentTotalPercentage);


  const selectedAsset = assets.find(asset => asset.id === selectedAssetId);

  const handleAssetSelect = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAssetId(assetId);
      setInvestmentDetails(prev => ({
        ...prev,
        asset_id: assetId,
        purchase_price: asset.current_price,
        percentage: Math.min(remainingPercentage, 10)
      }));
      setStep('details');
    }
  };

  const handlePopulateAssets = async () => {
    setPopulatingAssets(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-assets');
      
      if (error) throw error;
      
      toast({
        title: "Assets Updated",
        description: data.message || "Asset database has been populated with the latest assets.",
      });
      
      refetch(); // Refresh assets list
    } catch (error: any) {
      console.error('Error populating assets:', error);
      toast({
        title: "Failed to Update Assets",
        description: "There was an error updating the asset database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPopulatingAssets(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssetId || !investmentDetails.investment_start_date || !investmentDetails.invested_amount || !investmentDetails.purchase_price || !investmentDetails.percentage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate percentage doesn't exceed remaining allocation
    if (investmentDetails.percentage! > remainingPercentage) {
      toast({
        title: "Invalid Allocation",
        description: `Cannot allocate more than ${remainingPercentage}% (remaining allocation).`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('allocations')
        .insert({
          investment_account_id: accountId,
          asset_id: selectedAssetId,
          percentage: investmentDetails.percentage!,
          initial_price: selectedAsset?.current_price || 0,
          purchase_price: investmentDetails.purchase_price!,
          invested_amount: investmentDetails.invested_amount!,
          investment_start_date: format(investmentDetails.investment_start_date!, 'yyyy-MM-dd')
        });

      if (error) throw error;

      toast({
        title: "Asset Added Successfully",
        description: `${selectedAsset?.symbol} added to your portfolio.`,
      });

      // Reset form
      setStep('select');
      setSelectedAssetId('');
      setInvestmentDetails({
        investment_start_date: new Date(),
        percentage: 10,
        invested_amount: 1000,
        purchase_price: 0
      });
      setSearchTerm('');
      setOpen(false);
      
      // Refresh data
      refetch();
      refetchAllocations();
    } catch (error: any) {
      console.error('Error adding asset:', error);
      
      const isUniqueConstraintError = error?.message?.includes('duplicate key value violates unique constraint');
      
      toast({
        title: "Failed to Add Asset",
        description: isUniqueConstraintError 
          ? "This asset is already in your portfolio."
          : "There was an error adding the asset to your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'crypto': return <Bitcoin className="h-4 w-4" />;
      case 'etf': return <PieChart className="h-4 w-4" />;
      case 'stock': return <Building2 className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const DialogWrapper = isMobile ? Drawer : Dialog;
  const DialogTriggerWrapper = isMobile ? DrawerTrigger : DialogTrigger;
  const DialogContentWrapper = isMobile ? DrawerContent : DialogContent;
  const DialogHeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
  const DialogTitleWrapper = isMobile ? DrawerTitle : DialogTitle;

  const renderAssetSelection = () => (
    <div className={`space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
      {/* Current Allocations Summary */}
      {allocations.filter(a => a.is_active !== false).length > 0 && (
        <Card className="bg-gradient-to-r from-secondary/10 to-muted/10 border-secondary/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Current Portfolio</h4>
              <Badge variant="secondary" className="text-xs">
                {currentTotalPercentage.toFixed(1)}% allocated
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {allocations.filter(a => a.is_active !== false).map(allocation => (
                <Badge key={allocation.id} variant="outline" className="text-xs">
                  {allocation.assets?.symbol} ({allocation.percentage}%)
                </Badge>
              ))}
            </div>
            {remainingPercentage > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                {remainingPercentage.toFixed(1)}% remaining allocation available
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentTotalPercentage > 100 && (
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:from-red-950/20 dark:to-red-900/20 dark:border-red-800/30">
          <CardContent className="p-3">
            <div className="text-sm text-red-800 dark:text-red-200">
              <strong>Portfolio Over-Allocated ({currentTotalPercentage.toFixed(1)}%)</strong>
              <p className="text-xs mt-1 mb-2">Your portfolio exceeds 100% allocation. Please rebalance before adding new assets.</p>
              <PortfolioRebalanceDialog accountId={accountId} currentTotalPercentage={currentTotalPercentage} />
            </div>
          </CardContent>
        </Card>
      )}

      {remainingPercentage <= 0 && currentTotalPercentage <= 100 && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/20 dark:to-amber-900/20 dark:border-amber-800/30">
          <CardContent className="p-3">
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Portfolio Fully Allocated</strong>
              <p className="text-xs mt-1">Your portfolio is 100% allocated. To add new assets, you'll need to rebalance existing allocations first.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Database Management */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {assets.length} assets available
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePopulateAssets}
          disabled={populatingAssets}
          className="gap-2"
        >
          <Download className="h-3 w-3" />
          {populatingAssets ? 'Updating...' : 'Update Assets'}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search assets by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <AssetFilters
        selectedTypes={selectedTypes}
        onTypeChange={setSelectedTypes}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showOnlyPopular={showOnlyPopular}
        onPopularToggle={() => setShowOnlyPopular(!showOnlyPopular)}
      />

      {/* Asset List */}
      <ScrollArea className={`${isMobile ? 'h-[50vh]' : 'h-[400px]'}`}>
        {assetsLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Loading assets...</div>
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => handleAssetSelect(asset.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <div className="space-y-2">
              <div>No assets found matching your criteria</div>
              {assets.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePopulateAssets}
                  disabled={populatingAssets}
                  className="gap-2"
                >
                  <Download className="h-3 w-3" />
                  {populatingAssets ? 'Loading Assets...' : 'Load Asset Database'}
                </Button>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const renderInvestmentDetails = () => (
    <div className={`space-y-4 ${isMobile ? 'px-4 pb-4' : ''}`}>
      {/* Selected Asset Summary */}
      {selectedAsset && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                {getAssetIcon(selectedAsset.asset_type)}
              </div>
              <div>
                <div className="font-semibold text-sm">{selectedAsset.symbol}</div>
                <div className="text-xs text-muted-foreground">{selectedAsset.name}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-semibold text-sm">€{selectedAsset.current_price.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Current Price</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Details Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investment Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Investment Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !investmentDetails.investment_start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {investmentDetails.investment_start_date ? (
                    format(investmentDetails.investment_start_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={investmentDetails.investment_start_date}
                  onSelect={(date) => setInvestmentDetails(prev => ({ ...prev, investment_start_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Purchase Price */}
          <div className="space-y-2">
            <Label htmlFor="purchase-price">Purchase Price (€)</Label>
            <Input
              id="purchase-price"
              type="number"
              min="0"
              step="0.01"
              value={investmentDetails.purchase_price || ''}
              onChange={(e) => setInvestmentDetails(prev => ({ 
                ...prev, 
                purchase_price: Number(e.target.value) 
              }))}
              placeholder="Price when you bought"
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
              value={investmentDetails.invested_amount || ''}
              onChange={(e) => setInvestmentDetails(prev => ({ 
                ...prev, 
                invested_amount: Number(e.target.value) 
              }))}
              placeholder="Total amount invested"
            />
          </div>

          {/* Portfolio Percentage */}
          <div className="space-y-2">
            <Label htmlFor="percentage">Portfolio Allocation (%)</Label>
            <Input
              id="percentage"
              type="number"
              min="0.1"
              max={remainingPercentage}
              step="0.1"
              value={investmentDetails.percentage || ''}
              onChange={(e) => setInvestmentDetails(prev => ({ 
                ...prev, 
                percentage: Number(e.target.value) 
              }))}
              placeholder={`Max: ${remainingPercentage.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Current Value Calculation */}
        {selectedAsset && investmentDetails.purchase_price && investmentDetails.invested_amount && (
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30">
            <CardContent className="p-3">
              <h4 className="font-semibold text-sm mb-2">Investment Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Invested Amount:</div>
                  <div className="font-semibold">€{investmentDetails.invested_amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current Value:</div>
                  <div className="font-semibold">
                    €{((investmentDetails.invested_amount / investmentDetails.purchase_price!) * selectedAsset.current_price).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Purchase Price:</div>
                  <div className="font-semibold">€{investmentDetails.purchase_price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current Price:</div>
                  <div className="font-semibold">€{selectedAsset.current_price.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Gain/Loss:</span>
                  <span className={`font-semibold text-sm ${
                    selectedAsset.current_price > investmentDetails.purchase_price! 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedAsset.current_price > investmentDetails.purchase_price! ? '+' : ''}
                    €{(((investmentDetails.invested_amount / investmentDetails.purchase_price!) * selectedAsset.current_price) - investmentDetails.invested_amount).toLocaleString()}
                    {' '}
                    ({(((selectedAsset.current_price / investmentDetails.purchase_price!) - 1) * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-2 pt-2 ${isMobile ? 'sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 -mx-4 px-4 py-3' : 'justify-end'}`}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setStep('select')}
          disabled={loading}
          className={isMobile ? 'flex-1' : ''}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !investmentDetails.investment_start_date || !investmentDetails.invested_amount || !investmentDetails.purchase_price || !investmentDetails.percentage}
          className={`${isMobile ? 'flex-1' : ''} bg-primary hover:bg-primary/90`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            'Add Investment'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <DialogWrapper open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setStep('select');
        setSelectedAssetId('');
        setInvestmentDetails({
          investment_start_date: new Date(),
          percentage: 10,
          invested_amount: 1000,
          purchase_price: 0
        });
      }
    }}>
      <DialogTriggerWrapper asChild>
        <Button variant="outline" size="sm" className="flex-1" disabled={currentTotalPercentage > 100}>
          <Plus size={16} className="mr-1" />
          Add Asset
        </Button>
      </DialogTriggerWrapper>
      <DialogContentWrapper className={isMobile ? '' : 'sm:max-w-[700px] max-h-[90vh] overflow-hidden'}>
        <DialogHeaderWrapper>
          <DialogTitleWrapper>
            {step === 'select' ? 'Select Asset' : 'Investment Details'}
          </DialogTitleWrapper>
        </DialogHeaderWrapper>
        {step === 'select' ? renderAssetSelection() : renderInvestmentDetails()}
      </DialogContentWrapper>
    </DialogWrapper>
  );
};

export default AddAssetDialog;
