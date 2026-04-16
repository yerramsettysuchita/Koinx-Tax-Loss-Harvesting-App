'use client';

import { useState, useEffect, useCallback } from 'react';

type SetState<T> = (value: T | ((prev: T) => T)) => void;

/**
 * useState that persists its value to localStorage.
 * Returns the same [state, setState] tuple as useState.
 * Safe to use with SSR — reads localStorage only on mount.
 */
export function usePersistedState<T>(key: string, defaultValue: T): [T, SetState<T>] {
  const [state, setStateRaw] = useState<T>(defaultValue);

  // Hydrate from localStorage on first mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setStateRaw(JSON.parse(raw) as T);
      }
    } catch {
      // corrupted storage — fall back to default
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setState: SetState<T> = useCallback(
    (value) => {
      setStateRaw((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // storage full or unavailable — still update React state
        }
        return next;
      });
    },
    [key]
  );

  return [state, setState];
}
