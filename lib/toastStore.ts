/**
 * Vanilla pub-sub toast store — no React dependency.
 * Components subscribe via useToastList(); anything can publish via toastStore.show().
 */

export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let nextId = 0;
const listeners = new Set<Listener>();

function notify() {
  const snapshot = [...toasts];
  listeners.forEach((l) => l(snapshot));
}

export const toastStore = {
  getAll(): ToastItem[] {
    return [...toasts];
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  show(message: string, type: ToastType = 'success', duration = 3000): void {
    const id = ++nextId;
    toasts = [...toasts, { id, message, type }];
    notify();
    setTimeout(() => toastStore.dismiss(id), duration);
  },

  dismiss(id: number): void {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};
