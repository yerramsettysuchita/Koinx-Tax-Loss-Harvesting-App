import type { Holding, HarvestingResult } from '@/types';

// ─── CSV helpers ─────────────────────────────────────────────────────────────

/** Wrap a value in quotes and double any internal quotes — RFC 4180 compliant. */
export function escapeCSVCell(value: string | number): string {
  const s = String(value);
  // needs quoting if it contains comma, double-quote, or newline
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Builds a raw CSV string from selected holdings + harvesting result. */
export function toCSV(holdings: Holding[], result: HarvestingResult): string {
  const header = [
    'Asset', 'Symbol', 'Quantity', 'Current Value (USD)',
    'Short-term Gain/Loss', 'Long-term Gain/Loss', 'Total Gain/Loss',
  ].map(escapeCSVCell).join(',');

  const rows = holdings.map((h) =>
    [
      h.coinName, h.coin, h.totalHolding, h.currentPrice.toFixed(2),
      h.stcg.gain.toFixed(2), h.ltcg.gain.toFixed(2),
      (h.stcg.gain + h.ltcg.gain).toFixed(2),
    ].map(escapeCSVCell).join(',')
  );

  const summary = [
    '', '', '', '',
    '', 'Estimated Tax Savings', result.savings.toFixed(2),
  ].map(escapeCSVCell).join(',');

  return [header, ...rows, '', summary].join('\n');
}

/** Returns a formatted JSON string summarising the harvest plan. */
export function toJSON(holdings: Holding[], result: HarvestingResult): string {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        assetsToSell: holdings.length,
        totalLoss: holdings.reduce(
          (sum, h) => sum + h.stcg.gain + h.ltcg.gain, 0
        ),
        estimatedSavings: result.savings,
        afterCapitalGains: result.afterGains.totalCapitalGains,
      },
      assets: holdings.map((h) => ({
        id: h.id,
        name: h.coinName,
        symbol: h.coin,
        quantity: h.totalHolding,
        currentPrice: h.currentPrice,
        shortTermGainLoss: h.stcg.gain,
        longTermGainLoss: h.ltcg.gain,
        totalGainLoss: h.stcg.gain + h.ltcg.gain,
      })),
    },
    null,
    2
  );
}

/**
 * Triggers a CSV file download in the browser.
 * Uses Blob + temporary anchor — no library required.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
