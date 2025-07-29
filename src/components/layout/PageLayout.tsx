import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

const PageLayout = ({ title, children, actions, isLoading = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-finapp-background">
      <Navbar />
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;