
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountsListSkeletonProps {
  count?: number;
}

const AccountsListSkeleton: React.FC<AccountsListSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="w-full bg-card shadow-sm border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-8 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountsListSkeleton;
