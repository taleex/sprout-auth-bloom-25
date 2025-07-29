import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceIndicatorProps {
  priceChange24h: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showPercentage?: boolean;
}

const PriceIndicator: React.FC<PriceIndicatorProps> = ({
  priceChange24h,
  size = 'md',
  showIcon = true,
  showPercentage = true
}) => {
  const isPositive = priceChange24h > 0;
  const isNegative = priceChange24h < 0;
  const isNeutral = priceChange24h === 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUp size={iconSizes[size]} />;
    if (isNegative) return <TrendingDown size={iconSizes[size]} />;
    return <Minus size={iconSizes[size]} />;
  };

  const getColorClass = () => {
    if (isPositive) return 'text-green-600 dark:text-green-400';
    if (isNegative) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn(
      'flex items-center gap-1 font-medium',
      sizeClasses[size],
      getColorClass()
    )}>
      {showIcon && getIcon()}
      {showPercentage && (
        <span>
          {isPositive && '+'}
          {priceChange24h.toFixed(2)}%
        </span>
      )}
    </div>
  );
};

export default PriceIndicator;