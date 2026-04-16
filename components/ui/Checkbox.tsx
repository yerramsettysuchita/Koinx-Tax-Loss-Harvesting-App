'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  'aria-label'?: string;
  className?: string;
}

/**
 * Custom checkbox with indeterminate support.
 * The forwardRef exposes the underlying <input> so callers can set
 * the native `indeterminate` DOM property via ref + useEffect.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { checked, indeterminate = false, onChange, 'aria-label': ariaLabel, className },
    ref
  ) {
    const innerRef = useRef<HTMLInputElement>(null);

    // Set native indeterminate property (not an HTML attribute — must be via JS)
    useEffect(() => {
      const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? innerRef.current;
      if (el) el.indeterminate = indeterminate;
    }, [indeterminate, ref]);

    return (
      <label
        className={cn('relative cursor-pointer shrink-0 inline-flex', className)}
        style={{ width: 18, height: 18 }}
      >
        <input
          ref={ref ?? innerRef}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onChange();
          }}
          aria-label={ariaLabel}
          aria-checked={indeterminate ? 'mixed' : checked}
        />
        <div
          className={cn(
            'w-4.5 h-4.5 rounded flex items-center justify-center border transition-all duration-150',
            checked || indeterminate
              ? 'bg-brand border-brand'
              : 'bg-transparent border-check-border hover:border-brand'
          )}
        >
          {indeterminate ? (
            <Minus className="w-3 h-3 text-white" strokeWidth={3} />
          ) : checked ? (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          ) : null}
        </div>
      </label>
    );
  }
);
