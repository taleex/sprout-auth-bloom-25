
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyAccountsMessage: React.FC = () => {
  return (
    <Card className="w-full bg-card shadow-sm border">
      <CardContent className="p-6 text-center">
        <p className="text-muted-foreground">No accounts found. Create your first account to get started.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyAccountsMessage;
