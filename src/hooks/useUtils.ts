//src\hooks\useUtils.ts

import { useState, useCallback } from 'react';
import type { ValidationSchema } from '../types/utils';

/**
 * ローカルストレージ管理用カスタムフック
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('ストレージの更新に失敗しました:', error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * フォーム状態管理用カスタムフック
 */
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  validationSchema?: ValidationSchema<T>
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((name: keyof T, value: T[keyof T]) => {
    if (!validationSchema || !validationSchema[name]) return '';

    const rules = validationSchema[name];
    for (const rule of rules) {
      const result = rule(value);
      if (typeof result === 'string') return result;
      if (!result) return `${String(name)}が不正です`;
    }
    return '';
  }, [validationSchema]);

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  };
}

/**
 * UI状態管理用カスタムフック
 */
export function useUIState() {
  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<any[]>([]);

  const showModal = useCallback((modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  }, []);

  const hideModal = useCallback((modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  }, []);

  const showToast = useCallback((toast: any) => {
    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  return {
    isLoading,
    setIsLoading,
    modals,
    showModal,
    hideModal,
    toasts,
    showToast,
    removeToast
  };
}

/**
 * カスタムバリデーション用フック
 */
export function useValidation<T>(value: T, rules: ((value: T) => boolean)[]) {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(() => {
    for (const rule of rules) {
      if (!rule(value)) {
        setError('入力値が不正です');
        return false;
      }
    }
    setError(null);
    return true;
  }, [value, rules]);

  return { error, validate };
}