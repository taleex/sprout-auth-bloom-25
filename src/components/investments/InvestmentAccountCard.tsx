
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, TrendingUp, TrendingDown } from 'lucide-react';
import AddAssetDialog from './AddAssetDialog';
import PortfolioView from './PortfolioView';
import AssetManagementDialog from './AssetManagementDialog';
import { InvestmentAccount } from '@/types/investments';

interface InvestmentAccountCardProps {
  account: InvestmentAccount;
}

const InvestmentAccountCard: React.FC<InvestmentAccountCardProps> = ({ account }) => {
  const [showAssetManagement, setShowAssetManagement] = useState(false);
  
  const gainLossPercentage = account.total_deposits > 0 
    ? ((account.current_value - account.total_deposits) / account.total_deposits) * 100 
    : 0;
  
  const isPositive = gainLossPercentage >= 0;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{account.name}</h3>
            <p className="text-sm text-muted-foreground">{account.asset_count} assets</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAssetManagement(true)}
          >
            <Settings size={16} />
          </Button>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-2xl font-bold text-foreground">
              €{account.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">
              Total deposits: €{account.total_deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? '+' : ''}{gainLossPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <AddAssetDialog accountId={account.id} />
          <PortfolioView account={account} />
        </div>
      </div>

      <AssetManagementDialog 
        account={account} 
        open={showAssetManagement}
        onOpenChange={setShowAssetManagement}
      />
    </div>
  );
};

export default InvestmentAccountCard;
