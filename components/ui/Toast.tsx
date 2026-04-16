'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toastStore, type ToastItem } from '@/lib/toastStore';

// ─── Individual Toast ─────────────────────────────────────────────────────────

const CONFIG = {
  success: { icon: CheckCircle2, bar: 'bg-gain', text: 'text-gain' },
  error:   { icon: AlertCircle,  bar: 'bg-loss', text: 'text-loss' },
  info:    { icon: Info,         bar: 'bg-brand', text: 'text-brand' },
} as const;

function ToastMessage({ toast, visible }: { toast: ToastItem; visible: boolean }) {
  const { icon: Icon, bar, text } = CONFIG[toast.type];
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'relative flex items-start gap-3 bg-card border border-border rounded-xl',
        'shadow-lg px-4 py-3 overflow-hidden w-full',
        'transition-all duration-300 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {/* coloured left accent bar */}
      <div className={cn('absolute left-0 inset-y-0 w-1 rounded-l-xl', bar)} />
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0 ml-1', text)} />
      <span className="text-sm font-medium text-text flex-1 leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={() => toastStore.dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-text-faint hover:text-text transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>(() => toastStore.getAll());
  const [visible, setVisible] = useState<Set<number>>(new Set());

  // Subscribe to store
  useEffect(() => toastStore.subscribe(setToasts), []);

  // Trigger enter animation one tick after mount
  useEffect(() => {
    toasts.forEach(({ id }) => {
      if (!visible.has(id)) {
        requestAnimationFrame(() =>
          setVisible((prev) => new Set([...prev, id]))
        );
      }
    });
    // Prune ids that are no longer in toasts
    setVisible((prev) => {
      const activeIds = new Set(toasts.map((t) => t.id));
      const next = new Set([...prev].filter((id) => activeIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-[100] flex flex-col gap-2',
        // bottom-center on mobile, bottom-right on sm+
        'bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80'
      )}
    >
      {toasts.map((t) => (
        <ToastMessage key={t.id} toast={t} visible={visible.has(t.id)} />
      ))}
    </div>
  );
}
