// Re-export all common hooks for easy importing
export * from './common';
export * from './use-mobile';
export * from './use-toast';

// Custom hooks specifically for the FinApp
export { useAccountsData } from './useAccountsData';
export { useAccountsActions } from './useAccountsActions';
export { useAccountDeletion } from './useAccountDeletion';
export { useAllocations } from './useAllocations';
export { useAssets } from './useAssets';
export { useAssetSearch } from './useAssetSearch';

export { useBillFormValidation } from './useBillFormValidation';
export { useBillsCrud } from './useBillsCrud';
export { useBillsData } from './useBillsData';
export { useBillsManager } from './useBillsManager';
export { useBillsNotifications } from './useBillsNotifications';
export { useBillsState } from './useBillsState';
export { useBillsTable } from './useBillsTable';
export { useCategoriesData } from './useCategoriesData';
export { useCategoryForm } from './useCategoryForm';
export { useInvestmentAccounts } from './useInvestmentAccounts';
export { useNotifications } from './useNotifications';
export { useOptimisticUpdates } from './useOptimisticUpdates';
export { usePasswordChange } from './usePasswordChange';
export { useProfileData } from './useProfileData';
export { useProfileImageUpload } from './useProfileImageUpload';
export { useRealTimePrices } from './useRealTimePrices';
export { useRealTimeUpdates } from './useRealTimeUpdates';
export { useReportsData } from './useReportsData';
export { useSavingsGoals } from './useSavingsGoals';
export { useTheme } from './useTheme';
export { useTransactionsData } from './useTransactionsData';
export { useUserPreferences } from './useUserPreferences';