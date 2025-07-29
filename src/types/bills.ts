export interface Bill {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  repeat_pattern: 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
  repeat_interval: number;
  specific_dates: number[] | null;
  start_date: string;
  account_id: string | null;
  category_id: string | null;
  specific_day: number | null;
  color: string;
  notes: string | null;
  is_active: boolean;
  include_in_forecast: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewBillData {
  name: string;
  amount: number;
  type: string;
  repeat_pattern: string;
  start_date: string;
  account_id: string;
  category_id?: string;
  specific_day?: number;
  notification_enabled?: boolean;
  notes?: string;
}