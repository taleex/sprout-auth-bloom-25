
export interface Account {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  currency: string;
  hide_balance: boolean;
  is_archived: boolean;
  created_at?: string;
  updated_at?: string;
  account_type?: string; // Changed from union type to string to match database
  color?: string;
  icon?: string;
}

export interface Transfer {
  id?: string;
  user_id: string;
  source_account_id: string;
  destination_account_id: string;
  amount: number;
  created_at?: string;
  notes?: string;
}
