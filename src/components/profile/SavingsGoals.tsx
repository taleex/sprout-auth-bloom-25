
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Target, TrendingUp } from 'lucide-react';
import { Account } from '@/types/accounts';
import { useAccountsData } from '@/hooks/useAccountsData';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';

interface SavingsGoalsProps {
  formatCurrency: (amount: number) => string;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ formatCurrency }) => {
  const { accounts, isLoading } = useAccountsData();
  const { goals, isLoading: goalsLoading, updateGoal } = useSavingsGoals();
  const [editingGoal, setEditingGoal] = useState<{ accountId: string; targetAmount: number } | null>(null);

  // Filter accounts that can have savings goals (savings, investment, goals types)
  const goalAccounts = accounts.filter(account => 
    ['savings', 'investment', 'goals'].includes(account.account_type || 'main')
  );

  const handleSetGoal = async (accountId: string, targetAmount: number) => {
    await updateGoal(accountId, targetAmount);
    setEditingGoal(null);
  };

  const getGoalProgress = (account: Account) => {
    const goal = goals.find(g => g.account_id === account.id);
    if (!goal || goal.target_amount <= 0) return 0;
    return Math.min((account.balance / goal.target_amount) * 100, 100);
  };

  const getGoalTarget = (accountId: string) => {
    const goal = goals.find(g => g.account_id === accountId);
    return goal?.target_amount || 0;
  };

  if (isLoading || goalsLoading) {
    return (
      <Card className="bg-card rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-2 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goalAccounts.length === 0) {
    return (
      <Card className="bg-card rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No savings accounts found</p>
            <p className="text-sm text-muted-foreground">Create a savings, investment, or goals account to set targets.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Savings Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goalAccounts.map((account) => {
            const progress = getGoalProgress(account);
            const targetAmount = getGoalTarget(account.id);
            const isCompleted = progress >= 100;

            return (
              <div key={account.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{account.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {account.account_type} account
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGoal({ accountId: account.id, targetAmount })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Savings Goal for {account.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="target">Target Amount</Label>
                          <Input
                            id="target"
                            type="number"
                            placeholder="Enter target amount"
                            defaultValue={targetAmount}
                            onChange={(e) => setEditingGoal({
                              accountId: account.id,
                              targetAmount: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingGoal(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => editingGoal && handleSetGoal(editingGoal.accountId, editingGoal.targetAmount)}
                          >
                            Save Goal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {targetAmount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(account.balance)} of {formatCurrency(targetAmount)}
                      </span>
                      <span className={`flex items-center gap-1 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                        <TrendingUp className="h-3 w-3" />
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-3 ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}
                    />
                    {isCompleted && (
                      <p className="text-sm text-green-600 font-medium">
                        🎉 Goal achieved! Great job!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-border rounded-lg">
                    <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No goal set</p>
                    <p className="text-xs text-muted-foreground">Click the edit button to set a target</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsGoals;
