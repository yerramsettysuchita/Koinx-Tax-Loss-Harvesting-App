'use client';

import { useEffect, useRef } from 'react';
import { X, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCrypto } from '@/lib/formatters';
import { toJSON, toCSV, downloadCSV } from '@/lib/exportHarvestPlan';
import { toastStore } from '@/lib/toastStore';
import type { Holding, HarvestingResult } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedHoldings: Holding[];
  result: HarvestingResult;
}

export function HarvestPlanModal({ isOpen, onClose, selectedHoldings, result }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape to close + focus trap
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const el = modalRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    // auto-focus close button
    const timer = setTimeout(() => modalRef.current?.querySelector<HTMLElement>('button')?.focus(), 50);
    return () => { document.removeEventListener('keydown', onKeyDown); clearTimeout(timer); };
  }, [isOpen, onClose]);

  async function handleCopyJSON() {
    try {
      await navigator.clipboard.writeText(toJSON(selectedHoldings, result));
      toastStore.show('Harvest plan copied to clipboard', 'success');
    } catch {
      toastStore.show('Copy failed — please try again', 'error');
    }
  }

  function handleDownloadCSV() {
    downloadCSV(`koinx-harvest-plan-${Date.now()}.csv`, toCSV(selectedHoldings, result));
    toastStore.show('CSV downloaded', 'success');
  }

  const totalLoss = selectedHoldings.reduce((s, h) => s + h.stcg.gain + h.ltcg.gain, 0);

  return (
    /* Backdrop */
    <div
      aria-hidden={!isOpen}
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Modal panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="harvest-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full max-w-2xl max-h-[90vh] flex flex-col',
          'bg-card rounded-2xl border border-border shadow-2xl overflow-hidden',
          'transition-all duration-200 ease-out',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.96]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 id="harvest-modal-title" className="text-lg font-bold text-text">
            Your Harvest Plan
          </h2>
          <button
            type="button" onClick={onClose} aria-label="Close modal"
            className="p-1.5 rounded-lg text-text-mute hover:text-text hover:bg-row-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 px-6 pt-5 pb-4 shrink-0">
          {[
            { label: 'Assets to Sell',      value: selectedHoldings.length.toString() },
            { label: 'Total Realised Loss',  value: formatCurrency(totalLoss) },
            { label: 'Estimated Tax Saved',  value: formatCurrency(result.savings) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-bg border border-border p-3 text-center">
              <p className="text-xs text-text-mute mb-1">{label}</p>
              <p className="text-sm font-bold text-text">{value}</p>
            </div>
          ))}
        </div>

        {/* Scrollable table */}
        <div className="overflow-y-auto flex-1 px-6 pb-2">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                {['Asset', 'Quantity', 'Value', 'Loss Realised'].map((h) => (
                  <th key={h} className="text-left pb-2 pt-1 text-xs font-semibold text-text-faint uppercase tracking-wide pr-4 last:text-right last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {selectedHoldings.map((h) => (
                <tr key={h.id} className="hover:bg-row-hover transition-colors">
                  <td className="py-3 pr-4 font-medium text-text">{h.coinName} <span className="text-text-faint font-normal">({h.coin})</span></td>
                  <td className="py-3 pr-4 text-text-mute tabular-nums">{formatCrypto(h.totalHolding, h.coin)}</td>
                  <td className="py-3 pr-4 text-text tabular-nums">{formatCurrency(h.currentPrice)}</td>
                  <td className={cn('py-3 font-semibold tabular-nums text-right', (h.stcg.gain + h.ltcg.gain) < 0 ? 'text-loss' : 'text-gain')}>
                    {formatCurrency(h.stcg.gain + h.ltcg.gain)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-table-head shrink-0">
          <button type="button" onClick={handleCopyJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-row-hover transition-colors">
            <Copy className="w-4 h-4" /> Copy as JSON
          </button>
          <button type="button" onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
