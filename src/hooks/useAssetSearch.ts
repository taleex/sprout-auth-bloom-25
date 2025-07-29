
import { useState, useMemo } from 'react';
import { Asset } from '@/types/investments';

interface UseAssetSearchProps {
  assets: Asset[];
  allocatedAssetIds: Set<string>;
}

export const useAssetSearch = ({ assets, allocatedAssetIds }: UseAssetSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['crypto', 'stock', 'etf']);
  const [sortBy, setSortBy] = useState('name');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      // Search filter
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = selectedTypes.includes(asset.asset_type);
      
      // Not already allocated
      const notAlreadyAllocated = !allocatedAssetIds.has(asset.id);
      
      // Popular filter (based on market cap and update frequency)
      const isPopular = showOnlyPopular ? 
        (asset.market_cap && asset.market_cap > 1000000000) || 
        asset.update_frequency === 'realtime' || 
        ['BTC', 'ETH', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA'].includes(asset.symbol)
        : true;

      return matchesSearch && matchesType && notAlreadyAllocated && isPopular;
    });

    // Sort assets with improved logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'market_cap': {
          const aMarketCap = a.market_cap || 0;
          const bMarketCap = b.market_cap || 0;
          // Sort by market cap descending (largest first)
          return bMarketCap - aMarketCap;
        }
        case 'volume': {
          const aVolume = a.volume_24h || 0;
          const bVolume = b.volume_24h || 0;
          // Sort by volume descending (highest first)
          return bVolume - aVolume;
        }
        case 'change_desc': {
          const aChange = a.price_change_24h || 0;
          const bChange = b.price_change_24h || 0;
          // Sort by price change descending (highest gains first)
          return bChange - aChange;
        }
        case 'change_asc': {
          const aChange = a.price_change_24h || 0;
          const bChange = b.price_change_24h || 0;
          // Sort by price change ascending (biggest losses first)
          return aChange - bChange;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [assets, searchTerm, selectedTypes, sortBy, showOnlyPopular, allocatedAssetIds]);

  return {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    showOnlyPopular,
    setShowOnlyPopular,
    filteredAssets: filteredAndSortedAssets
  };
};
