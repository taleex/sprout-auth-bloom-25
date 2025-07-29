export interface InvestmentAccount {
  id: string;
  name: string;
  total_deposits: number;
  current_value: number;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  asset_type: 'stock' | 'crypto' | 'etf';
  current_price: number;
  price_updated_at: string;
  update_frequency: 'realtime' | 'hourly' | 'daily';
  last_price_fetch: string;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  created_at: string;
}

export interface Allocation {
  id: string;
  investment_account_id: string;
  asset_id: string;
  percentage: number;
  initial_price: number;
  purchase_price: number;
  invested_amount: number;
  investment_start_date: string;
  created_at: string;
  updated_at: string;
  sold_date?: string;
  sold_price?: number;
  is_active: boolean;
  assets?: Asset;
}

export interface Deposit {
  id: string;
  investment_account_id: string;
  amount: number;
  deposit_date: string;
  created_at: string;
}