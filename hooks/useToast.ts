'use client';

import { useCallback } from 'react';
import { toastStore, type ToastType } from '@/lib/toastStore';

/** Call showToast() from any client component to fire a toast notification. */
export function useToast() {
  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => toastStore.show(message, type),
    []
  );
  return { showToast };
}
