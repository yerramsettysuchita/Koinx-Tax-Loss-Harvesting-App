export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatCrypto(value: number, symbol: string): string {
  const decimals = value < 1 ? 4 : value < 10 ? 3 : 2;
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${symbol}`;
}

/**
 * Formats a gain value with +/- sign prefix and no cents for whole numbers.
 * e.g. 55320.15 → "+$55,320.15"  |  -1200 → "-$1,200"
 */
export function formatSignedGain(value: number): string {
  const sign = value >= 0 ? '+' : '-';
  const abs = Math.abs(value);
  const str = abs.toLocaleString('en-US', {
    minimumFractionDigits: abs % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${sign}$${str}`;
}

/**
 * Formats a value for the GainsCard table.
 * Losses passed as positive numbers get a "- $ " prefix.
 * e.g. 743 (loss) → "- $ 743"  |  1540 (profit) → "$ 1,540"
 */
export function formatGainCardValue(value: number): string {
  const abs = Math.abs(value);
  const str = abs.toLocaleString('en-US', {
    minimumFractionDigits: abs % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `- $ ${str}` : `$ ${str}`;
}
