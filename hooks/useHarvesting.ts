'use client';

import { useMemo } from 'react';
import { calculateHarvestingResult } from '@/lib/calculations';
import type { CapitalGains, Holding, HarvestingResult } from '@/types';

/**
 * Derives the After-Harvesting result from the live API data.
 * Returns null while data is still loading.
 */
export function useHarvesting(
  selectedIds: string[],
  holdings: Holding[] | null,
  baseGains: CapitalGains | null
): HarvestingResult | null {
  return useMemo(() => {
    if (!holdings || !baseGains) return null;
    const selected = holdings.filter((h) => selectedIds.includes(h.id));
    return calculateHarvestingResult(baseGains, selected);
  }, [selectedIds, holdings, baseGains]);
}
