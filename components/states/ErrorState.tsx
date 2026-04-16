import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  /** 'panel' keeps it compact (inside a card); 'page' is full-width */
  variant?: 'panel' | 'page';
}

export function ErrorState({ message, onRetry, variant = 'panel' }: ErrorStateProps) {
  return (
    <div
      className={
        variant === 'page'
          ? 'rounded-2xl border border-border bg-card px-6 py-10 flex flex-col items-center gap-4 text-center'
          : 'rounded-xl border border-loss/20 bg-loss/5 px-4 py-4 flex items-start gap-3'
      }
    >
      <AlertCircle
        className={variant === 'page' ? 'w-8 h-8 text-loss' : 'w-4 h-4 text-loss mt-0.5 shrink-0'}
      />
      <div className={variant === 'page' ? 'space-y-3' : 'flex-1 min-w-0'}>
        <p className="text-sm font-medium text-text">
          {variant === 'page' ? 'Something went wrong' : 'Failed to load data'}
        </p>
        <p className="text-xs text-text-mute break-words">{message}</p>
        {variant === 'page' && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
      {variant === 'panel' && (
        <button
          type="button"
          onClick={onRetry}
          aria-label="Retry"
          className="shrink-0 p-1.5 rounded-lg text-text-mute hover:text-brand hover:bg-row-hover transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
