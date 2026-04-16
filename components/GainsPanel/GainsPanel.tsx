import { GainsCard } from './GainsCard';
import { GainsPanelSkeleton } from '@/components/states/LoadingSkeleton';
import { ErrorState } from '@/components/states/ErrorState';
import type { CapitalGains, HarvestingResult } from '@/types';

interface GainsPanelProps {
  baseGains: CapitalGains | null;
  result: HarvestingResult | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ZERO_GAINS: CapitalGains = {
  stcg: { profits: 0, losses: 0 },
  ltcg: { profits: 0, losses: 0 },
};

export function GainsPanel({ baseGains, result, isLoading, error, onRetry }: GainsPanelProps) {
  if (isLoading) return <GainsPanelSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <ErrorState message={error} onRetry={onRetry} variant="page" />
      </div>
    );
  }

  const pre = baseGains ?? ZERO_GAINS;
  const afterStcg = result?.afterGains.stcg ?? { profits: 0, losses: 0 };
  const afterLtcg = result?.afterGains.ltcg ?? { profits: 0, losses: 0 };
  const savings = result?.savings ?? 0;

  return (
    <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-4">
      <GainsCard
        variant="pre"
        stcgProfits={pre.stcg.profits}
        stcgLosses={pre.stcg.losses}
        ltcgProfits={pre.ltcg.profits}
        ltcgLosses={pre.ltcg.losses}
      />
      <GainsCard
        variant="after"
        stcgProfits={afterStcg.profits}
        stcgLosses={afterStcg.losses}
        ltcgProfits={afterLtcg.profits}
        ltcgLosses={afterLtcg.losses}
        savings={savings}
      />
    </div>
  );
}
