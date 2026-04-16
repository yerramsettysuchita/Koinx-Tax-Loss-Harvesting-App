'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  /** Optional string prepended before the formatted value (e.g. "≈ ") */
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Cubic ease-out: fast start, gentle finish */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({
  value,
  prefix = '',
  duration = 400,
  className,
}: AnimatedNumberProps) {
  const prevRef = useRef(value);
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value; // capture target immediately for next effect

    if (from === value) return;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setDisplay(from + (value - from) * easeOut(t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {formatCurrency(display)}
    </span>
  );
}
