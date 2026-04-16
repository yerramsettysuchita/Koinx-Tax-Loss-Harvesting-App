import { describe, it, expect } from 'vitest';
import { calculateHarvestingResult, calculateSavings } from './calculations';
import { mockCapitalGains } from '@/data/mockCapitalGains';
import type { Holding } from '@/types';

// ─── fixtures ────────────────────────────────────────────────────────────────

/** Holding with negative stcg.gain (loss) */
const LOSS_HOLDING: Holding = {
  id: 'sphere-0',
  coin: 'SPHERE',
  coinName: 'Sphere Finance',
  logo: '',
  currentPrice: 0.007,
  totalHolding: 1,
  averageBuyPrice: 0.011,
  stcg: { balance: 1, gain: -0.004 },
  ltcg: { balance: 0, gain: 0 },
};

/** Holding with positive stcg.gain */
const GAIN_HOLDING: Holding = {
  id: 'matic-0',
  coin: 'MATIC',
  coinName: 'Polygon',
  logo: '',
  currentPrice: 22.22,
  totalHolding: 2.75,
  averageBuyPrice: 0.69,
  stcg: { balance: 2.75, gain: 59.24 },
  ltcg: { balance: 0, gain: 0 },
};

/** Holding with both stcg and ltcg gains */
const MIXED_HOLDING: Holding = {
  id: 'wpol-0',
  coin: 'WPOL',
  coinName: 'Wrapped POL',
  logo: '',
  currentPrice: 22.08,
  totalHolding: 2.32,
  averageBuyPrice: 0.52,
  stcg: { balance: 1.32, gain: 49.95 },
  ltcg: { balance: 1, gain: 20 },
};

// Base totals: stcg.profits=70200.88, losses=1548.53 → net=68652.35
//             ltcg.profits=5020, losses=3050 → net=1970
//             total = 70622.35
const BASE_TOTAL =
  (mockCapitalGains.stcg.profits - mockCapitalGains.stcg.losses) +
  (mockCapitalGains.ltcg.profits - mockCapitalGains.ltcg.losses); // 70622.35

// ─── calculateHarvestingResult ───────────────────────────────────────────────

describe('calculateHarvestingResult', () => {
  it('a. baseline: no selections returns unchanged numbers', () => {
    const result = calculateHarvestingResult(mockCapitalGains, []);
    expect(result.afterGains.stcg).toEqual(mockCapitalGains.stcg);
    expect(result.afterGains.ltcg).toEqual(mockCapitalGains.ltcg);
    expect(result.afterGains.totalCapitalGains).toBeCloseTo(BASE_TOTAL, 2);
    expect(result.savings).toBe(0);
  });

  it('b. negative stcg.gain increases stcg losses', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [LOSS_HOLDING]);
    expect(result.afterGains.stcg.losses).toBeCloseTo(
      mockCapitalGains.stcg.losses + Math.abs(LOSS_HOLDING.stcg.gain), 6
    );
    expect(result.afterGains.stcg.profits).toBe(mockCapitalGains.stcg.profits);
  });

  it('c. positive stcg.gain increases stcg profits', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [GAIN_HOLDING]);
    expect(result.afterGains.stcg.profits).toBeCloseTo(
      mockCapitalGains.stcg.profits + GAIN_HOLDING.stcg.gain, 2
    );
  });

  it('d. selecting a pure-gain holding raises total and gives no savings', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [GAIN_HOLDING]);
    expect(result.afterGains.totalCapitalGains).toBeGreaterThan(BASE_TOTAL);
    expect(result.savings).toBe(0);
  });

  it('e. deselecting all returns to baseline (pure function)', () => {
    calculateHarvestingResult(mockCapitalGains, [GAIN_HOLDING, LOSS_HOLDING]);
    const result = calculateHarvestingResult(mockCapitalGains, []);
    expect(result.afterGains.stcg).toEqual(mockCapitalGains.stcg);
    expect(result.afterGains.totalCapitalGains).toBeCloseTo(BASE_TOTAL, 2);
  });

  it('f. savings is never negative', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [GAIN_HOLDING]);
    expect(result.savings).toBeGreaterThanOrEqual(0);
  });

  it('g. mixed holding: positive ltcg goes to ltcg profits', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [MIXED_HOLDING]);
    expect(result.afterGains.ltcg.profits).toBeCloseTo(
      mockCapitalGains.ltcg.profits + MIXED_HOLDING.ltcg.gain, 2
    );
  });

  it('h. handles empty array without throwing', () => {
    expect(() => calculateHarvestingResult(mockCapitalGains, [])).not.toThrow();
  });

  it('i. multiple holdings accumulate correctly', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [GAIN_HOLDING, LOSS_HOLDING]);
    expect(result.afterGains.stcg.profits).toBeCloseTo(
      mockCapitalGains.stcg.profits + GAIN_HOLDING.stcg.gain, 2
    );
    expect(result.afterGains.stcg.losses).toBeCloseTo(
      mockCapitalGains.stcg.losses + Math.abs(LOSS_HOLDING.stcg.gain), 6
    );
  });
});

// ─── calculateSavings ────────────────────────────────────────────────────────

describe('calculateSavings', () => {
  it('returns 0 when after-gains exceed base', () => {
    expect(calculateSavings(mockCapitalGains, BASE_TOTAL + 5000)).toBe(0);
  });

  it('returns exact difference when after-gains are lower', () => {
    expect(calculateSavings(mockCapitalGains, BASE_TOTAL - 500)).toBeCloseTo(500, 2);
  });

  it('returns full base amount when after gains go negative', () => {
    expect(calculateSavings(mockCapitalGains, -10000)).toBeCloseTo(BASE_TOTAL, 2);
  });
});
