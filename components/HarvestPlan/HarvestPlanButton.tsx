'use client';

import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HarvestPlanButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function HarvestPlanButton({ disabled, onClick }: HarvestPlanButtonProps) {
  return (
    <div className="flex justify-end">
      <div className="relative group">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label="Generate harvest plan"
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm',
            'transition-all duration-150 select-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            disabled
              ? 'bg-border text-text-faint cursor-not-allowed'
              : [
                  'bg-brand text-white cursor-pointer',
                  'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30',
                  'active:translate-y-0 active:shadow-none',
                ]
          )}
        >
          <Sprout className="w-4 h-4" />
          Generate Harvest Plan
        </button>

        {/* disabled tooltip */}
        {disabled && (
          <div
            role="tooltip"
            className={cn(
              'absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap',
              'bg-tooltip-bg text-tooltip-text shadow-md pointer-events-none',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-150'
            )}
          >
            Select assets to harvest first
            <div
              className="absolute top-full right-4 w-2 h-2 rotate-45 -translate-y-1"
              style={{ background: 'var(--tooltip-bg)' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
