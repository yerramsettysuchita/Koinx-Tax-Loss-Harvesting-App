/**
 * Integration test: full data pipeline
 *
 * Exercises the entire chain from raw API shape → id injection →
 * selection filter → calculation → export, using the exact same mock
 * data that the app's API routes serve in production.
 *
 * This is not a unit test — it validates that all layers compose correctly.
 */
import { describe, it, expect } from 'vitest';
import { mockHoldingsRaw } from '@/data/mockHoldings';
import { mockCapitalGains } from '@/data/mockCapitalGains';
import { calculateHarvestingResult } from '@/lib/calculations';
import { toJSON, toCSV } from '@/lib/exportHarvestPlan';
import type { Holding } from '@/types';

// ─── Simulate what useHoldings does ──────────────────────────────────────────

const allHoldings: Holding[] = mockHoldingsRaw.map((h, i) => ({
  ...h,
  id: `${h.coin}-${i}`,
}));

// Pick two real holdings from the dataset for selection
const ethHolding  = allHoldings.find((h) => h.coin === 'ETH')!;
const maticHolding = allHoldings.find((h) => h.coin === 'MATIC')!;

// ─── id injection ─────────────────────────────────────────────────────────────

describe('useHoldings id injection', () => {
  it('every holding has a unique id', () => {
    const ids = allHoldings.map((h) => h.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(allHoldings.length);
  });

  it('id format is coin-index', () => {
    expect(allHoldings[0].id).toBe(`${allHoldings[0].coin}-0`);
  });

  it('maps all 25 holdings from the raw API data', () => {
    expect(allHoldings).toHaveLength(mockHoldingsRaw.length);
    expect(allHoldings.length).toBeGreaterThanOrEqual(25);
  });

  it('preserves nested stcg/ltcg shape', () => {
    allHoldings.forEach((h) => {
      expect(typeof h.stcg.gain).toBe('number');
      expect(typeof h.stcg.balance).toBe('number');
      expect(typeof h.ltcg.gain).toBe('number');
      expect(typeof h.ltcg.balance).toBe('number');
    });
  });
});

// ─── selection → calculation pipeline ────────────────────────────────────────

describe('selection → calculateHarvestingResult pipeline', () => {
  it('no selection: afterGains equals base, savings = 0', () => {
    const result = calculateHarvestingResult(mockCapitalGains, []);
    expect(result.afterGains.stcg).toEqual(mockCapitalGains.stcg);
    expect(result.afterGains.ltcg).toEqual(mockCapitalGains.ltcg);
    expect(result.savings).toBe(0);
  });

  it('ETH + MATIC selected: produces a valid HarvestingResult', () => {
    expect(ethHolding).toBeDefined();
    expect(maticHolding).toBeDefined();
    const result = calculateHarvestingResult(mockCapitalGains, [ethHolding, maticHolding]);
    expect(typeof result.afterGains.totalCapitalGains).toBe('number');
    expect(result.savings).toBeGreaterThanOrEqual(0);
  });

  it('selecting all holdings does not crash and returns finite numbers', () => {
    const result = calculateHarvestingResult(mockCapitalGains, allHoldings);
    expect(isFinite(result.afterGains.totalCapitalGains)).toBe(true);
    expect(isFinite(result.savings)).toBe(true);
  });

  it('savings equals reduction in total capital gains (clamped at 0)', () => {
    const result = calculateHarvestingResult(mockCapitalGains, allHoldings);
    const baseTCG =
      (mockCapitalGains.stcg.profits - mockCapitalGains.stcg.losses) +
      (mockCapitalGains.ltcg.profits - mockCapitalGains.ltcg.losses);
    const reduction = baseTCG - result.afterGains.totalCapitalGains;
    const expectedSavings = Math.max(0, reduction);
    expect(result.savings).toBeCloseTo(expectedSavings, 4);
  });

  it('afterGains.totalCapitalGains equals sum of ST net + LT net', () => {
    const result = calculateHarvestingResult(mockCapitalGains, [ethHolding]);
    const stNet = result.afterGains.stcg.profits - result.afterGains.stcg.losses;
    const ltNet = result.afterGains.ltcg.profits - result.afterGains.ltcg.losses;
    expect(result.afterGains.totalCapitalGains).toBeCloseTo(stNet + ltNet, 6);
  });
});

// ─── calculation → export pipeline ───────────────────────────────────────────

describe('calculation → export pipeline', () => {
  const selected = [ethHolding, maticHolding].filter(Boolean);
  const result   = calculateHarvestingResult(mockCapitalGains, selected);

  it('toCSV produces a string with correct number of rows', () => {
    const csv = toCSV(selected, result);
    const nonEmpty = csv.split('\n').filter(Boolean);
    // header + N data rows + summary
    expect(nonEmpty.length).toBe(1 + selected.length + 1);
  });

  it('toCSV summary row contains actual savings value', () => {
    const csv = toCSV(selected, result);
    const lines = csv.split('\n').filter(Boolean);
    expect(lines[lines.length - 1]).toContain(result.savings.toFixed(2));
  });

  it('toJSON contains all selected asset symbols', () => {
    const json = toJSON(selected, result);
    const { assets } = JSON.parse(json);
    const symbols: string[] = assets.map((a: { symbol: string }) => a.symbol);
    selected.forEach((h) => expect(symbols).toContain(h.coin));
  });

  it('toJSON summary.afterCapitalGains matches calculation', () => {
    const json = toJSON(selected, result);
    const { summary } = JSON.parse(json);
    expect(summary.afterCapitalGains).toBeCloseTo(result.afterGains.totalCapitalGains, 4);
  });
});
