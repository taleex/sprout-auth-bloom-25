export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}