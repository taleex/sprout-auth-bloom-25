export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  transaction_type: 'manual' | 'transfer' | 'automated';
  description: string | null;
  notes: string | null;
  date: string;
  photo_url: string | null;
  account_id: string;
  category_id: string | null;
  source_account_id: string | null;
  destination_account_id: string | null;
  category: string;
  category_icon: string;
  account_name: string;
  source_account_name?: string;
  destination_account_name?: string;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}