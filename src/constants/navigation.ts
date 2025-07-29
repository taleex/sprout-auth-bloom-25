import { Home, CreditCard, TrendingUp, Receipt, LineChart, LucideIcon } from 'lucide-react';

export interface NavigationItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/accounts', icon: CreditCard, label: 'Accounts' },
  { to: '/investments', icon: LineChart, label: 'Investments' },
  { to: '/transactions', icon: TrendingUp, label: 'Transactions' },
  { to: '/bills', icon: Receipt, label: 'Recurring' },
];