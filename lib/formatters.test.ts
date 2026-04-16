import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatCrypto,
  formatSignedGain,
  formatGainCardValue,
} from './formatters';

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a whole number with 2 decimal places', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats a decimal value', () => {
    expect(formatCurrency(3.14)).toBe('$3.14');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a large value with comma separators', () => {
    expect(formatCurrency(70622.35)).toBe('$70,622.35');
  });

  it('formats a negative value', () => {
    expect(formatCurrency(-1548.53)).toBe('-$1,548.53');
  });

  it('respects custom decimals argument', () => {
    expect(formatCurrency(1234.5678, 4)).toBe('$1,234.5678');
  });
});

// ─── formatPercent ───────────────────────────────────────────────────────────

describe('formatPercent', () => {
  it('prefixes positive values with +', () => {
    expect(formatPercent(12.5)).toBe('+12.50%');
  });

  it('does not double-prefix negative values', () => {
    expect(formatPercent(-3.7)).toBe('-3.70%');
  });

  it('formats zero without a sign', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

// ─── formatCrypto ─────────────────────────────────────────────────────────────

describe('formatCrypto', () => {
  it('appends the coin symbol', () => {
    expect(formatCrypto(1.5, 'ETH')).toContain('ETH');
  });

  it('uses 4 decimal places for values below 1', () => {
    const result = formatCrypto(0.0004, 'BTC');
    // 0.0004 → "0.0004 BTC"
    expect(result).toBe('0.0004 BTC');
  });

  it('uses fewer decimals for larger values', () => {
    const result = formatCrypto(250, 'SOL');
    // 250 → "250 SOL" (0 decimals since value >= 10)
    expect(result).toBe('250 SOL');
  });
});

// ─── formatSignedGain ────────────────────────────────────────────────────────

describe('formatSignedGain', () => {
  it('prefixes positive values with +$', () => {
    expect(formatSignedGain(55320.15)).toBe('+$55,320.15');
  });

  it('prefixes negative values with -$', () => {
    expect(formatSignedGain(-1200)).toBe('-$1,200');
  });

  it('formats zero with + sign and no cents', () => {
    expect(formatSignedGain(0)).toBe('+$0');
  });

  it('omits cents for whole numbers', () => {
    expect(formatSignedGain(500)).toBe('+$500');
  });

  it('includes cents when fractional', () => {
    expect(formatSignedGain(89.41)).toBe('+$89.41');
  });

  it('handles very small negative gains (rounds to 2dp)', () => {
    expect(formatSignedGain(-0.004)).toBe('-$0.00');
  });
});

// ─── formatGainCardValue ─────────────────────────────────────────────────────

describe('formatGainCardValue', () => {
  it('formats positive value with $ prefix and space', () => {
    expect(formatGainCardValue(70290.29)).toBe('$ 70,290.29');
  });

  it('formats negative value as - $ prefix (losses display)', () => {
    expect(formatGainCardValue(-1548.53)).toBe('- $ 1,548.53');
  });

  it('formats zero as $ 0', () => {
    expect(formatGainCardValue(0)).toBe('$ 0');
  });

  it('omits cents for whole-number positives', () => {
    expect(formatGainCardValue(5020)).toBe('$ 5,020');
  });

  it('omits cents for whole-number negatives', () => {
    expect(formatGainCardValue(-3050)).toBe('- $ 3,050');
  });

  it('includes cents when fractional', () => {
    expect(formatGainCardValue(1548.53)).toBe('$ 1,548.53');
  });
});
