'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOLTIP_CONTENT =
  'Tax loss harvesting is a strategy where you sell crypto assets at a loss to offset your capital gains, reducing the amount of tax you owe. The harvested losses can offset both short-term and long-term gains.';

export function HowItWorksTooltip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
        <span>How it works?</span>
      </button>

      {open && (
        <div
          role="tooltip"
          className={cn(
            'absolute left-0 top-full mt-2 w-72 z-50',
            'rounded-xl px-4 py-3 shadow-xl text-xs leading-relaxed',
            'bg-tooltip-bg text-tooltip-text'
          )}
        >
          <div
            className="absolute -top-1.5 left-4 w-3 h-3 rotate-45"
            style={{ backgroundColor: 'var(--tooltip-bg)' }}
          />
          {TOOLTIP_CONTENT}
        </div>
      )}
    </div>
  );
}
