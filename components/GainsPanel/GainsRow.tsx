import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

interface GainsRowProps {
  label: string;
  value: number;
  variant: 'pre' | 'after';
  highlight?: boolean;
  showSign?: boolean;
}

export function GainsRow({
  label,
  value,
  variant,
  highlight = false,
  showSign = false,
}: GainsRowProps) {
  const isAfter = variant === 'after';
  const isPositive = value >= 0;
  const isNegative = value < 0;

  const valueColor = isAfter
    ? 'text-white'
    : isNegative
    ? 'text-loss'
    : isPositive
    ? 'text-gain'
    : 'text-text';

  const labelColor = isAfter ? 'text-blue-200' : 'text-text-mute';

  const formatted = `${showSign && isPositive ? '+' : ''}${formatCurrency(value)}`;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2.5 px-0',
        highlight && 'border-t',
        highlight && isAfter ? 'border-blue-400/40 mt-1 pt-3' : 'border-border-soft'
      )}
    >
      <span className={cn('text-sm', labelColor)}>{label}</span>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          valueColor,
          highlight && 'text-base'
        )}
      >
        {formatted}
      </span>
    </div>
  );
}
