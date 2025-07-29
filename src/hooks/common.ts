import { useState, useEffect } from 'react';

// Generic hook for handling async operations with loading and error states
export const useAsync = <T, E = Error>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err as E);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, dependencies);

  const refetch = () => execute();

  return { data, isLoading, error, refetch };
};

// Hook for handling form state with validation
export const useFormState = <T extends Record<string, any>>(
  initialState: T,
  validationFn?: (data: T) => string[]
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    if (!validationFn) return true;
    
    const validationErrors = validationFn(formData);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors([]);
    setIsDirty(false);
  };

  const setFormErrors = (newErrors: string[]) => {
    setErrors(newErrors);
  };

  return {
    formData,
    errors,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    setFormErrors,
    setFormData,
  };
};

// Hook for handling local storage
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};