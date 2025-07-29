// Currency and formatting utilities
export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
} as const;

export type Currency = keyof typeof CURRENCIES;

// Account types
export const ACCOUNT_TYPES = {
  MAIN: 'main',
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
  GOALS: 'goals',
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// Bill repeat patterns
export const BILL_REPEAT_PATTERNS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
} as const;

export type BillRepeatPattern = typeof BILL_REPEAT_PATTERNS[keyof typeof BILL_REPEAT_PATTERNS];

// Asset types for investments
export const ASSET_TYPES = {
  STOCK: 'stock',
  CRYPTO: 'crypto',
  ETF: 'etf',
} as const;

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

// Default colors for UI elements
export const DEFAULT_COLORS = [
  '#cbf587', // Default green
  '#93c5fd', // Blue
  '#fdba74', // Orange
  '#c4b5fd', // Purple
  '#f9a8d4', // Pink
  '#a3a3a3', // Gray
] as const;

// Default account type mappings
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [ACCOUNT_TYPES.MAIN]: 'Main Account',
  [ACCOUNT_TYPES.SAVINGS]: 'Savings',
  [ACCOUNT_TYPES.INVESTMENT]: 'Investment',
  [ACCOUNT_TYPES.GOALS]: 'Goals',
};

// Default transaction type mappings
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TRANSACTION_TYPES.INCOME]: 'Income',
  [TRANSACTION_TYPES.EXPENSE]: 'Expense',
  [TRANSACTION_TYPES.TRANSFER]: 'Transfer',
};

// Default bill repeat pattern mappings
export const BILL_REPEAT_PATTERN_LABELS: Record<BillRepeatPattern, string> = {
  [BILL_REPEAT_PATTERNS.WEEKLY]: 'Weekly',
  [BILL_REPEAT_PATTERNS.MONTHLY]: 'Monthly',
  [BILL_REPEAT_PATTERNS.QUARTERLY]: 'Quarterly',
  [BILL_REPEAT_PATTERNS.YEARLY]: 'Yearly',
  [BILL_REPEAT_PATTERNS.CUSTOM]: 'Custom',
};