
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank, Home, ShoppingCart } from 'lucide-react';

const BudgetCalculator = () => {
  const [income, setIncome] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const numericIncome = parseFloat(income) || 0;
  const needs = numericIncome * 0.5;
  const wants = numericIncome * 0.3;
  const savings = numericIncome * 0.2;

  return (
    <Card className="bg-card border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">50-30-20 Budget Rule</CardTitle>
        <p className="text-sm text-muted-foreground">Enter your monthly income to see how you should split your earnings</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="income" className="text-sm font-medium text-foreground">
            Monthly Income
          </Label>
          <Input
            id="income"
            type="number"
            placeholder="Enter your monthly income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        {numericIncome > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Needs</p>
                  <p className="text-xs text-muted-foreground">50%</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(needs)}</p>
              <p className="text-xs text-muted-foreground mt-1">Housing, utilities, groceries</p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Wants</p>
                  <p className="text-xs text-muted-foreground">30%</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(wants)}</p>
              <p className="text-xs text-muted-foreground mt-1">Entertainment, dining out</p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Savings</p>
                  <p className="text-xs text-muted-foreground">20%</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(savings)}</p>
              <p className="text-xs text-muted-foreground mt-1">Emergency fund, investments</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
