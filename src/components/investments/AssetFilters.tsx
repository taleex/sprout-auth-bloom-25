import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoin, Building2, PieChart, TrendingUp, Star, Clock } from 'lucide-react';

interface AssetFiltersProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showOnlyPopular: boolean;
  onPopularToggle: () => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  selectedTypes,
  onTypeChange,
  sortBy,
  onSortChange,
  showOnlyPopular,
  onPopularToggle
}) => {
  const assetTypes = [
    { value: 'crypto', label: 'Crypto', icon: Bitcoin },
    { value: 'stock', label: 'Stocks', icon: Building2 },
    { value: 'etf', label: 'ETFs', icon: PieChart }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price_desc', label: 'Price High-Low' },
    { value: 'price_asc', label: 'Price Low-High' },
    { value: 'market_cap', label: 'Market Cap' },
    { value: 'volume', label: 'Volume' },
    { value: 'change_desc', label: 'Top Gainers' },
    { value: 'change_asc', label: 'Top Losers' }
  ];

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Asset Types */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Asset Types</div>
        <div className="flex flex-wrap gap-2">
          {assetTypes.map(({ value, label, icon: Icon }) => (
            <Badge
              key={value}
              variant={selectedTypes.includes(value) ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => toggleType(value)}
            >
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sort and Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showOnlyPopular ? "default" : "outline"}
          size="sm"
          onClick={onPopularToggle}
          className="gap-1"
        >
          <Star className="h-3 w-3" />
          Popular Only
        </Button>
      </div>
    </div>
  );
};

export default AssetFilters;