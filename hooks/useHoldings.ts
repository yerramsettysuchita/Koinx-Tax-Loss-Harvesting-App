'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import type { Holding } from '@/types';
import type { ApiHolding } from '@/data/mockHoldings';

interface UseHoldingsResult {
  data: Holding[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHoldings(): UseHoldingsResult {
  const [data, setData] = useState<Holding[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    apiFetch<ApiHolding[]>('/api/holdings')
      .then((raw) => {
        if (!cancelled) {
          // Inject stable id (coin + index handles duplicate coin symbols)
          const holdings: Holding[] = raw.map((h, i) => ({
            ...h,
            id: `${h.coin}-${i}`,
          }));
          setData(holdings);
          setIsLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load holdings');
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [rev]);

  const refetch = useCallback(() => setRev((n) => n + 1), []);
  return { data, isLoading, error, refetch };
}
