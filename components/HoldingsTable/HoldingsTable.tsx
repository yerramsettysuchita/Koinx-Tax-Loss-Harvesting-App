'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { HoldingsRow } from './HoldingsRow';
import { HoldingsTableSkeleton } from '@/components/states/LoadingSkeleton';
import { ErrorState } from '@/components/states/ErrorState';
import { EmptyState } from '@/components/states/EmptyState';
import type { Holding } from '@/types';

type SortKey = 'coinName' | 'stcgGain' | 'ltcgGain';
type SortDir = 'asc' | 'desc';

interface SortState { key: SortKey | null; dir: SortDir }

interface HoldingsTableProps {
  holdings: Holding[] | null;
  isLoading: boolean;
  error: string | null;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], allSelected: boolean) => void;
  onRetry: () => void;
}

const PAGE_SIZE = 4;

function getSortValue(h: Holding, key: SortKey): string | number {
  if (key === 'coinName') return h.coinName;
  if (key === 'stcgGain') return h.stcg.gain;
  if (key === 'ltcgGain') return h.ltcg.gain;
  return 0;
}

const COLS: { label: string; sub?: string; key: SortKey | null; cls: string; mobileHide?: boolean }[] = [
  { label: 'Asset',           key: 'coinName',  cls: 'px-3 text-left' },
  { label: 'Holdings',        sub: 'Avg Buy Price', key: null, cls: 'px-3 text-right' },
  { label: 'Current Price',   key: null,        cls: 'px-3 text-right',       mobileHide: true },
  { label: 'Short-Term',      key: 'stcgGain',  cls: 'px-3 text-right',       mobileHide: true },
  { label: 'Long-Term',       key: 'ltcgGain',  cls: 'px-3 text-right',       mobileHide: true },
  { label: 'Amount to Sell',  key: null,        cls: 'px-3 pr-6 text-right',  mobileHide: true },
];

function SortIcon({ colKey, sort }: { colKey: SortKey | null; sort: SortState }) {
  if (!colKey) return null;
  if (sort.key !== colKey) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
  return sort.dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-brand" />
    : <ChevronDown className="w-3 h-3 text-brand" />;
}

export function HoldingsTable({
  holdings, isLoading, error, selectedIds, onToggle, onToggleAll, onRetry,
}: HoldingsTableProps) {
  const [sort, setSort] = useState<SortState>({ key: null, dir: 'asc' });
  const [showAll, setShowAll] = useState(false);
  const masterRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(() => {
    if (!holdings) return [];
    if (!sort.key) return holdings;
    const key = sort.key;
    return [...holdings].sort((a, b) => {
      const av = getSortValue(a, key);
      const bv = getSortValue(b, key);
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [holdings, sort]);

  const displayed = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const displayedIds = displayed.map((h) => h.id);
  const selectedDisplayed = displayedIds.filter((id) => selectedIds.includes(id));
  const allSelected = displayedIds.length > 0 && selectedDisplayed.length === displayedIds.length;
  const someSelected = selectedDisplayed.length > 0 && !allSelected;

  useEffect(() => {
    if (masterRef.current) masterRef.current.indeterminate = someSelected;
  }, [someSelected]);

  function cycleSort(key: SortKey) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
  }

  if (isLoading) return <HoldingsTableSkeleton rows={PAGE_SIZE} />;
  if (error) return (
    <div className="rounded-xl border border-border bg-card p-5">
      <ErrorState message={error} onRetry={onRetry} variant="page" />
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-base font-semibold text-text">Holdings</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse sm:min-w-205" role="grid" aria-label="Holdings table">
          <thead>
            <tr className="bg-table-head border-t border-b border-border-soft">
              <th className="pl-6 pr-3 py-3 w-12 text-left">
                <Checkbox
                  ref={masterRef}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => onToggleAll(displayedIds, allSelected)}
                  aria-label="Select all visible holdings"
                />
              </th>
              {COLS.map(({ label, sub, key, cls, mobileHide }) => (
                <th
                  key={label}
                  className={cn(
                    cls,
                    'py-3 text-xs font-medium text-text-mute whitespace-nowrap',
                    mobileHide && 'hidden sm:table-cell',
                    key && 'cursor-pointer select-none hover:text-text transition-colors outline-none',
                    key && 'focus-visible:ring-2 focus-visible:ring-brand'
                  )}
                  tabIndex={key ? 0 : undefined}
                  aria-sort={key && sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => key && cycleSort(key)}
                  onKeyDown={(e) => { if (key && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); cycleSort(key); } }}
                >
                  <span className={cn('inline-flex flex-col', cls.includes('text-left') ? 'items-start' : 'items-end')}>
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon colKey={key} sort={sort} />
                    </span>
                    {sub && <span className="text-[10.5px] font-normal text-text-faint">{sub}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={7}><EmptyState /></td></tr>
            ) : (
              displayed.map((h) => (
                <HoldingsRow key={h.id} holding={h} selected={selectedIds.includes(h.id)} onToggle={onToggle} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {sorted.length > PAGE_SIZE && (
        <div
          className="px-6 py-3.5 border-t border-border-soft text-[13px] text-brand cursor-pointer underline underline-offset-2 hover:text-brand-hover transition-colors"
          onClick={() => setShowAll((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAll((v) => !v); } }}
        >
          {showAll ? 'View less' : 'View all'}
        </div>
      )}
    </div>
  );
}
