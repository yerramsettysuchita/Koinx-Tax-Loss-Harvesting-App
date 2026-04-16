import { describe, it, expect } from 'vitest';
import { escapeCSVCell, toCSV, toJSON } from './exportHarvestPlan';
import type { Holding, HarvestingResult } from '@/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockHolding: Holding = {
  id: 'eth-0',
  coin: 'ETH',
  coinName: 'Ethereum',
  logo: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
  currentPrice: 216182,
  totalHolding: 0.0004211938732637162,
  averageBuyPrice: 3909.79,
  stcg: { balance: 0.0004211938732637162, gain: 89.41 },
  ltcg: { balance: 0, gain: 0 },
};

const mockResult: HarvestingResult = {
  afterGains: {
    stcg: { profits: 70290.29, losses: 1548.53 },
    ltcg: { profits: 5020, losses: 3050 },
    totalCapitalGains: 70711.76,
  },
  savings: 0,
};

// ─── escapeCSVCell ────────────────────────────────────────────────────────────

describe('escapeCSVCell', () => {
  it('passes through simple strings unchanged', () => {
    expect(escapeCSVCell('hello')).toBe('hello');
  });

  it('passes through numbers as strings unchanged', () => {
    expect(escapeCSVCell(42)).toBe('42');
    expect(escapeCSVCell(3.14)).toBe('3.14');
  });

  it('wraps values containing commas in double quotes', () => {
    expect(escapeCSVCell('hello, world')).toBe('"hello, world"');
  });

  it('wraps values containing double quotes and escapes internal quotes', () => {
    expect(escapeCSVCell('say "hi"')).toBe('"say ""hi"""');
  });

  it('wraps values containing newlines', () => {
    expect(escapeCSVCell('line1\nline2')).toBe('"line1\nline2"');
  });

  it('wraps values containing carriage returns', () => {
    expect(escapeCSVCell('line1\rline2')).toBe('"line1\rline2"');
  });
});

// ─── toCSV ────────────────────────────────────────────────────────────────────

describe('toCSV', () => {
  it('starts with the expected header row', () => {
    const csv = toCSV([mockHolding], mockResult);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(
      'Asset,Symbol,Quantity,Current Value (USD),Short-term Gain/Loss,Long-term Gain/Loss,Total Gain/Loss'
    );
  });

  it('includes one data row per holding', () => {
    const csv = toCSV([mockHolding], mockResult);
    const lines = csv.split('\n').filter(Boolean);
    expect(lines.length).toBe(3); // header + 1 data + summary
  });

  it('data row contains correct coin name and symbol', () => {
    const csv = toCSV([mockHolding], mockResult);
    const dataRow = csv.split('\n')[1];
    expect(dataRow).toContain('Ethereum');
    expect(dataRow).toContain('ETH');
  });

  it('appends estimated tax savings in last non-empty line', () => {
    const csv = toCSV([mockHolding], mockResult);
    const lines = csv.split('\n').filter(Boolean);
    const summaryRow = lines[lines.length - 1];
    expect(summaryRow).toContain('Estimated Tax Savings');
    expect(summaryRow).toContain(mockResult.savings.toFixed(2));
  });

  it('total gain/loss column equals stcg.gain + ltcg.gain', () => {
    const csv = toCSV([mockHolding], mockResult);
    const dataRow = csv.split('\n')[1];
    const expected = (mockHolding.stcg.gain + mockHolding.ltcg.gain).toFixed(2);
    expect(dataRow).toContain(expected);
  });

  it('handles multiple holdings', () => {
    const holding2: Holding = { ...mockHolding, id: 'matic-1', coin: 'MATIC', coinName: 'Polygon' };
    const csv = toCSV([mockHolding, holding2], mockResult);
    const lines = csv.split('\n').filter(Boolean);
    expect(lines.length).toBe(4); // header + 2 data + summary
  });
});

// ─── toJSON ───────────────────────────────────────────────────────────────────

describe('toJSON', () => {
  it('produces valid JSON', () => {
    const json = toJSON([mockHolding], mockResult);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('includes generatedAt ISO timestamp', () => {
    const json = toJSON([mockHolding], mockResult);
    const parsed = JSON.parse(json);
    expect(typeof parsed.generatedAt).toBe('string');
    expect(new Date(parsed.generatedAt).toISOString()).toBe(parsed.generatedAt);
  });

  it('summary has correct assetsToSell count', () => {
    const json = toJSON([mockHolding], mockResult);
    const { summary } = JSON.parse(json);
    expect(summary.assetsToSell).toBe(1);
  });

  it('summary estimatedSavings matches result.savings', () => {
    const json = toJSON([mockHolding], mockResult);
    const { summary } = JSON.parse(json);
    expect(summary.estimatedSavings).toBe(mockResult.savings);
  });

  it('assets array contains one entry with correct symbol', () => {
    const json = toJSON([mockHolding], mockResult);
    const { assets } = JSON.parse(json);
    expect(assets).toHaveLength(1);
    expect(assets[0].symbol).toBe('ETH');
  });

  it('asset totalGainLoss equals stcg.gain + ltcg.gain', () => {
    const json = toJSON([mockHolding], mockResult);
    const { assets } = JSON.parse(json);
    expect(assets[0].totalGainLoss).toBeCloseTo(
      mockHolding.stcg.gain + mockHolding.ltcg.gain, 4
    );
  });
});
