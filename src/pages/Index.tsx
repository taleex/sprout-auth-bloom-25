
import React from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import BalanceSummary from '@/components/dashboard/BalanceSummary';
import { 
  Plus,
  ArrowLeftRight,
  Receipt,
  BarChart3,
  TrendingUp,
  Wallet,
  Clock,
  Calendar,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Add Transaction',
      href: '/transactions/new',
      icon: Plus,
    },
    {
      title: 'Transfer Money',
      href: '/accounts?action=transfer',
      icon: ArrowLeftRight,
    },
    {
      title: 'Add Recurring',
      href: '/bills?action=add',
      icon: Receipt,
    },
    {
      title: 'Import Transactions',
      href: '/transactions?action=import',
      icon: Upload,
    }
  ];

  const mainSections = [
    {
      title: 'Accounts',
      description: 'Manage balances and transfers',
      href: '/accounts',
      icon: Wallet,
    },
    {
      title: 'Transactions',
      description: 'View spending history',
      href: '/transactions',
      icon: BarChart3,
    },
    {
      title: 'Investments',
      description: 'Track portfolio performance',
      href: '/investments',
      icon: TrendingUp,
    },
    {
      title: 'Recurring',
      description: 'Recurring payments & income',
      href: '/bills',
      icon: Calendar,
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {getGreeting()}!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Here's your financial overview for today
          </p>
        </div>

        {/* Balance Summary */}
        <BalanceSummary />

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Quick Actions</h2>
              <p className="text-muted-foreground">
                Common tasks to manage your finances
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.href} className="group">
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] hover:border-primary/30">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {action.title}
                          </h3>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Manage Your Finances</h2>
              <p className="text-muted-foreground">
                Access all your financial tools and data
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mainSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link key={section.title} to={section.href} className="group">
                    <Card className="relative overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] hover:border-primary/30">
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                            <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {section.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Info */}
        <Card className="bg-card border border-border transition-all duration-200 hover:shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  Welcome back, {user?.email?.split('@')[0]}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  Account verified: {user?.email_confirmed_at ? (
                    <span className="inline-flex items-center gap-1 text-success">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-warning">
                      <span className="w-2 h-2 bg-warning rounded-full"></span>
                      Pending
                    </span>
                  )}
                </p>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-border hover:bg-muted hover:border-primary/30 transition-all duration-200">
                  Manage Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
