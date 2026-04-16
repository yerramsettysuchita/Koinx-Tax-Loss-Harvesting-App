'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NOTES = [
  'Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.',
  'Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.',
  'Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.',
  'Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.',
  'Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.',
];

export function NoticeBanner() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-lg border border-notice-border bg-notice-bg overflow-hidden transition-colors">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          {/* Blue italic "i" circle matching reference */}
          <span
            className="w-4.5 h-4.5 rounded-full shrink-0 inline-flex items-center justify-center text-white font-bold italic text-[11px]"
            style={{ background: '#0F62FE', fontFamily: 'Georgia, serif' }}
            aria-hidden="true"
          >
            i
          </span>
          <span className="text-sm font-semibold text-text">
            Important Notes &amp; Disclaimers
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-text-mute shrink-0 transition-transform duration-300',
            expanded && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-400',
          expanded ? 'max-h-96' : 'max-h-0'
        )}
      >
        <ul className="px-4 pb-3.5 pl-10.5 list-disc space-y-0.5 text-[13px] leading-7 text-text">
          {NOTES.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
