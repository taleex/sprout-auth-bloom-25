import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, Building2, PieChart, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Asset } from '@/types/investments';
import PriceIndicator from './PriceIndicator';

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
  isMobile?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, isMobile = false }) => {
  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'crypto': return <Bitcoin className="h-4 w-4" />;
      case 'etf': return <PieChart className="h-4 w-4" />;
      case 'stock': return <Building2 className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `€${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `€${price.toFixed(2)}`;
    } else {
      return `€${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `€${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `€${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `€${(marketCap / 1e6).toFixed(1)}M`;
    } else if (marketCap > 0) {
      return `€${marketCap.toLocaleString()}`;
    }
    return '';
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-primary/10 border hover:border-primary/20 dark:hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              {getAssetIcon(asset.asset_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{asset.symbol}</div>
              <div className={`text-xs text-muted-foreground ${isMobile ? 'line-clamp-1' : ''}`}>
                {asset.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {asset.asset_type.toUpperCase()}
                </Badge>
                {asset.market_cap > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {formatMarketCap(asset.market_cap)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-sm">
              {formatPrice(asset.current_price)}
            </div>
            <PriceIndicator 
              priceChange24h={asset.price_change_24h} 
              size="sm"
            />
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;