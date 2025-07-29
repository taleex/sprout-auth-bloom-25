import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'dashboard';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 3,
  className = ''
}) => {
  const renderCardSkeleton = () => (
    <Card className={`bg-card shadow-sm border animate-fade-in ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 animate-pulse" />
              <Skeleton className="h-4 w-16 animate-pulse" />
            </div>
            <Skeleton className="h-6 w-20 animate-pulse" />
          </div>
          <Skeleton className="h-8 w-32 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Card className={`bg-card rounded-xl shadow-sm animate-fade-in ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTableSkeleton = () => (
    <Card className={`bg-card shadow-sm border overflow-hidden animate-fade-in ${className}`}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="text-left p-4">
                    <Skeleton className="h-4 w-16 animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="p-4">
                      <Skeleton className={`h-4 animate-pulse ${j === 0 ? 'w-24' : j === 4 ? 'w-16' : 'w-12'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboardSkeleton = () => (
    <div className={`space-y-6 animate-fade-in ${className}`}>
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-32 animate-pulse" />
            <Skeleton className="h-8 w-8 rounded animate-pulse" />
          </div>
          <div className="space-y-3 mb-6">
            <Skeleton className="h-12 w-56 animate-pulse" />
            <Skeleton className="h-4 w-40 animate-pulse" />
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />
            <Skeleton className="h-4 w-5/6 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const skeletons = {
    card: renderCardSkeleton,
    list: renderListSkeleton,
    table: renderTableSkeleton,
    dashboard: renderDashboardSkeleton
  };

  const SkeletonComponent = skeletons[variant];

  if (variant === 'dashboard') {
    return <SkeletonComponent />;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};