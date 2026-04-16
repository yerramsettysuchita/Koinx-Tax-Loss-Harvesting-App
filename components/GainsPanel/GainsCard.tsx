'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Confetti } from '@/components/ui/Confetti';
import { formatGainCardValue } from '@/lib/formatters';

interface PreCardProps {
  variant: 'pre';
  stcgProfits: number;
  stcgLosses: number;
  ltcgProfits: number;
  ltcgLosses: number;
}

interface AfterCardProps {
  variant: 'after';
  stcgProfits: number;
  stcgLosses: number;
  ltcgProfits: number;
  ltcgLosses: number;
  savings: number;
}

type GainsCardProps = PreCardProps | AfterCardProps;

const SAVINGS_CONFETTI_THRESHOLD = 1000;

export function GainsCard(props: GainsCardProps) {
  const isAfter = props.variant === 'after';
  const savings = isAfter ? (props as AfterCardProps).savings : 0;

  const stcgNet = props.stcgProfits - props.stcgLosses;
  const ltcgNet = props.ltcgProfits - props.ltcgLosses;
  const totalCapitalGains = stcgNet + ltcgNet;

  // Fire confetti once per session when savings first cross $1,000
  const [fireConfetti, setFireConfetti] = useState(false);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!isAfter) return;
    if (!hasFiredRef.current && savings >= SAVINGS_CONFETTI_THRESHOLD) {
      hasFiredRef.current = true;
      setFireConfetti(true);
      const t = setTimeout(() => setFireConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isAfter, savings]);

  /* ── color helpers ─────────────────────────────────────── */
  const titleCls  = isAfter ? 'text-white'   : 'text-text';
  const headCls   = isAfter ? 'text-[#D8E4FB]' : 'text-text-mute';
  const labelCls  = isAfter ? 'text-[#D8E4FB]' : 'text-text-mute';
  const valueCls  = isAfter ? 'text-white'   : 'text-text';
  const dividerCls = isAfter ? 'border-white/20' : 'border-border';

  return (
    <>
      {isAfter && <Confetti trigger={fireConfetti} />}

      <div
        className={cn(
          'rounded-2xl px-6 py-5.5 flex flex-col',
          isAfter
            ? 'text-white'
            : 'bg-card border border-border',
          isAfter && 'harvest-gradient'
        )}
      >
        {/* Card title */}
        <p className={cn('text-base font-semibold mb-4.5', titleCls)}>
          {isAfter ? 'After Harvesting' : 'Pre Harvesting'}
        </p>

        {/* Gains table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={cn('text-left pb-3.5 font-medium', headCls)} />
              <th className={cn('text-right pb-3.5 font-medium', headCls)}>Short-term</th>
              <th className={cn('text-right pb-3.5 font-medium', headCls)}>Long-term</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn('py-2.5', labelCls)}>Profits</td>
              <td className={cn('py-2.5 text-right tabular-nums', valueCls)}>
                {formatGainCardValue(props.stcgProfits)}
              </td>
              <td className={cn('py-2.5 text-right tabular-nums', valueCls)}>
                {formatGainCardValue(props.ltcgProfits)}
              </td>
            </tr>
            <tr>
              <td className={cn('py-2.5', labelCls)}>Losses</td>
              {/* losses stored as positive — display as negative */}
              <td className={cn('py-2.5 text-right tabular-nums', valueCls)}>
                {formatGainCardValue(-props.stcgLosses)}
              </td>
              <td className={cn('py-2.5 text-right tabular-nums', valueCls)}>
                {formatGainCardValue(-props.ltcgLosses)}
              </td>
            </tr>
            <tr>
              <td className={cn('py-2.5', labelCls)}>Net Capital Gains</td>
              <td className={cn(
                'py-2.5 text-right tabular-nums font-semibold',
                isAfter ? 'text-white' : stcgNet >= 0 ? 'text-gain' : 'text-loss'
              )}>
                {formatGainCardValue(stcgNet)}
              </td>
              <td className={cn(
                'py-2.5 text-right tabular-nums font-semibold',
                isAfter ? 'text-white' : ltcgNet >= 0 ? 'text-gain' : 'text-loss'
              )}>
                {formatGainCardValue(ltcgNet)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bottom total row */}
        <div className={cn(
          'flex items-center justify-between flex-wrap gap-2 mt-3.5 pt-4 border-t',
          dividerCls
        )}>
          <span className={cn('text-[15px] font-semibold', titleCls)}>
            {isAfter ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
          </span>
          <AnimatedNumber
            value={totalCapitalGains}
            className={cn('text-2xl font-bold tabular-nums', titleCls)}
          />
        </div>

        {/* Savings banner (after card only, when savings > 0) */}
        {isAfter && savings > 0 && (
          <div className="mt-4 rounded-lg bg-white/15 px-3.5 py-2.5 flex items-center gap-2 text-[13px] text-white">
            🎉{' '}
            <span>
              You are going to save upto
              <span className="font-bold ml-1">
                {formatGainCardValue(savings)}
              </span>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
