'use client';

import { cn } from '@/lib/utils';
import { formatCurrency, formatSignedGain } from '@/lib/formatters';
import { Checkbox } from '@/components/ui/Checkbox';
import { AssetLogo } from '@/components/ui/AssetLogo';
import type { Holding } from '@/types';

interface HoldingsRowProps {
  holding: Holding;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function HoldingsRow({ holding, selected, onToggle }: HoldingsRowProps) {
  const { id, coin, coinName, logo, currentPrice, totalHolding, averageBuyPrice, stcg, ltcg } = holding;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle(id);
    }
  }

  return (
    <tr
      tabIndex={0}
      role="row"
      aria-selected={selected}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'border-b border-border-soft cursor-pointer transition-colors outline-none',
        'last:border-b-0',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
        selected ? 'bg-row-selected' : 'hover:bg-row-hover'
      )}
    >
      {/* Checkbox */}
      <td className="pl-6 pr-3 py-3.5 w-12">
        <Checkbox checked={selected} onChange={() => onToggle(id)} aria-label={`Select ${coinName}`} />
      </td>

      {/* Asset: logo + coinName + coin symbol */}
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3">
          <AssetLogo logoUrl={logo} symbol={coin} size={30} />
          <div>
            <div className="text-[13.5px] font-medium text-text leading-tight">{coinName}</div>
            <div className="text-[11.5px] text-text-faint leading-tight mt-0.5">{coin}</div>
          </div>
        </div>
      </td>

      {/* Holdings + Avg Buy Price */}
      <td className="px-3 py-3.5 text-right">
        <span className="block text-[13.5px] text-text tabular-nums">
          {totalHolding.toLocaleString('en-US', { maximumFractionDigits: 8 })} {coin}
        </span>
        <span className="block text-[11px] text-text-faint tabular-nums mt-0.5">
          Avg: {formatCurrency(averageBuyPrice)}
        </span>
      </td>

      {/* Current Price */}
      <td className="hidden sm:table-cell px-3 py-3.5 text-right">
        <span className="text-[13.5px] text-text tabular-nums">{formatCurrency(currentPrice)}</span>
      </td>

      {/* Short-Term Gain + balance */}
      <td className="hidden sm:table-cell px-3 py-3.5 text-right">
        <span className={cn(
          'block text-[13.5px] font-medium tabular-nums',
          stcg.gain < 0 ? 'text-loss' : 'text-gain'
        )}>
          {formatSignedGain(stcg.gain)}
        </span>
        <span className="block text-[11px] text-text-faint tabular-nums mt-0.5">
          {stcg.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })} {coin}
        </span>
      </td>

      {/* Long-Term Gain + balance */}
      <td className="hidden sm:table-cell px-3 py-3.5 text-right">
        <span className={cn(
          'block text-[13.5px] font-medium tabular-nums',
          ltcg.gain < 0 ? 'text-loss' : 'text-gain'
        )}>
          {formatSignedGain(ltcg.gain)}
        </span>
        <span className="block text-[11px] text-text-faint tabular-nums mt-0.5">
          {ltcg.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })} {coin}
        </span>
      </td>

      {/* Amount to Sell */}
      <td className="hidden sm:table-cell px-3 pr-6 py-3.5 text-right">
        {selected
          ? <span className="text-[13.5px] text-text tabular-nums">
              {totalHolding.toLocaleString('en-US', { maximumFractionDigits: 8 })} {coin}
            </span>
          : <span className="text-[13.5px] text-text-mute">-</span>
        }
      </td>
    </tr>
  );
}
