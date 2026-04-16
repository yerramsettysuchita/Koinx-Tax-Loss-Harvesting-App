import type React from 'react';
import { cn } from '@/lib/utils';

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('rounded-lg bg-border animate-pulse', className)} style={style} />
  );
}

/** Skeleton matching the two-column GainsPanel layout */
export function GainsPanelSkeleton() {
  return (
    <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <Bone className="h-3 w-28" />
          {[0, 1, 2, 3, 4].map((j) => (
            <div key={j} className="flex justify-between items-center py-1">
              <Bone className="h-3 w-32" />
              <Bone className="h-3 w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Single shimmer row used inside the holdings table body */
function TableRowSkeleton() {
  return (
    <tr>
      <td className="pl-4 pr-2 py-3.5">
        <Bone className="w-4.5 h-4.5 rounded" />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Bone className="w-8 h-8 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Bone className="h-3 w-24" />
            <Bone className="h-2.5 w-12" />
          </div>
        </div>
      </td>
      {[120, 110, 110, 100, 90, 90].map((w, k) => (
        <td key={k} className="px-4 py-3.5">
          <div className="flex justify-end">
            <Bone style={{ width: w * 0.6, height: 12 }} className="rounded" />
          </div>
        </td>
      ))}
    </tr>
  );
}

/** Skeleton matching the HoldingsTable layout */
export function HoldingsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* header bar */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <Bone className="h-4 w-24" />
        <Bone className="h-4 w-32" />
      </div>
      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 900 }}>
          <tbody className="divide-y divide-border-soft">
            {Array.from({ length: rows }, (_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Minimal notice-bar skeleton */
export function NoticeSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <Bone className="h-4 w-56" />
    </div>
  );
}
