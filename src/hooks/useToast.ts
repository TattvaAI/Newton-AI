import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '../types';
import { generateId } from '../lib/utils';
import { UI } from '../constants';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration = UI.TOAST_DURATION
  ) => {
    const id = generateId();
    const toast: Toast = { id, type, title, message, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };
}
