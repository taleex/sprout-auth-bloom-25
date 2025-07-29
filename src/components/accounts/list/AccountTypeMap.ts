
// Map account types to friendly names and icon colors
export const accountTypeMap: Record<string, { label: string; color: string }> = {
  main: { label: 'Main', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  savings: { label: 'Savings', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  investment: { label: 'Investment', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  goals: { label: 'Goals', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

// Note: formatCurrency moved to src/lib/utils.ts for centralization
