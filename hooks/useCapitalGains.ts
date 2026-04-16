'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import type { CapitalGains } from '@/types';

interface UseCapitalGainsResult {
  data: CapitalGains | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCapitalGains(): UseCapitalGainsResult {
  const [data, setData] = useState<CapitalGains | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // API returns { capitalGains: { stcg, ltcg } } per spec
    apiFetch<{ capitalGains: CapitalGains }>('/api/capital-gains')
      .then(({ capitalGains }) => {
        if (!cancelled) {
          setData(capitalGains);
          setIsLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load capital gains');
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [rev]);

  const refetch = useCallback(() => setRev((n) => n + 1), []);
  return { data, isLoading, error, refetch };
}
