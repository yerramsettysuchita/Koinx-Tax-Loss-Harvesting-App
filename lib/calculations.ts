import type { CapitalGains, Holding, HarvestingResult } from '@/types';

/**
 * Apply selected holdings' gains/losses to the base capital gains.
 *
 * Per spec:
 *   - If holding gain > 0  → add to profits for that term
 *   - If holding gain < 0  → add the absolute value to losses for that term
 *
 * Pure function — no side effects, always deterministic.
 */
export function calculateHarvestingResult(
  baseGains: CapitalGains,
  selectedHoldings: Holding[]
): HarvestingResult {
  let addSTProfits = 0, addSTLosses = 0;
  let addLTProfits = 0, addLTLosses = 0;

  for (const h of selectedHoldings) {
    const stGain = h.stcg.gain;
    const ltGain = h.ltcg.gain;

    if (stGain >= 0) addSTProfits += stGain;
    else addSTLosses += Math.abs(stGain);

    if (ltGain >= 0) addLTProfits += ltGain;
    else addLTLosses += Math.abs(ltGain);
  }

  const afterST = {
    profits: baseGains.stcg.profits + addSTProfits,
    losses: baseGains.stcg.losses + addSTLosses,
  };
  const afterLT = {
    profits: baseGains.ltcg.profits + addLTProfits,
    losses: baseGains.ltcg.losses + addLTLosses,
  };

  const afterSTNet = afterST.profits - afterST.losses;
  const afterLTNet = afterLT.profits - afterLT.losses;
  const totalCapitalGains = afterSTNet + afterLTNet;

  return {
    afterGains: { stcg: afterST, ltcg: afterLT, totalCapitalGains },
    savings: calculateSavings(baseGains, totalCapitalGains),
  };
}

/**
 * Tax saved = pre-harvesting realised gains minus post-harvesting realised gains.
 * Cannot go below zero.
 */
export function calculateSavings(base: CapitalGains, afterTotalCapitalGains: number): number {
  const preTotal =
    (base.stcg.profits - base.stcg.losses) + (base.ltcg.profits - base.ltcg.losses);
  return Math.max(preTotal - Math.max(afterTotalCapitalGains, 0), 0);
}
