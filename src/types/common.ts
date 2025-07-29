// Common interfaces used across components
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  isLoading: boolean;
}

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface SearchProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export interface SortProps {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface FormActionProps {
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  saveText?: string;
  cancelText?: string;
}