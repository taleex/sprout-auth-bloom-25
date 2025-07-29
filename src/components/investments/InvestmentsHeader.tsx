import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import CreateInvestmentAccountDialog from './CreateInvestmentAccountDialog';

const InvestmentsHeader = () => {
  const { toast } = useToast();
  const { portfolioValue, lastUpdated, refreshPrices } = useInvestmentAccounts();

  const handleRefresh = async () => {
    try {
      await refreshPrices();
      toast({
        title: "Prices updated",
        description: "Asset prices have been refreshed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh prices. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Investments</h1>
          <div className="mt-2 space-y-1">
            <p className="text-3xl font-bold text-foreground">
              €{portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <CreateInvestmentAccountDialog />
        </div>
      </div>
    </div>
  );
};

export default InvestmentsHeader;