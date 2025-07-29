import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ReportsLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card shadow-sm border border-border rounded-lg p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-[560px] w-[375px] rounded-3xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
};

export default ReportsLoading;