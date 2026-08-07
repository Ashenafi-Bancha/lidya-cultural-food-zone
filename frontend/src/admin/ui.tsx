import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Trash2, PencilLine } from 'lucide-react';

/**
 * Shared branded UI for the admin panel — replaces every window.confirm/alert
 * with a Lidya-styled card so destructive and duplicate flows read like part of
 * the product, and the wording can warn properly (e.g. that deletion is
 * permanent) instead of a bare browser prompt.
 */

export type ConfirmVariant = 'danger' | 'warning';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

const VARIANT = {
  danger: {
    Icon: Trash2,
    ring: 'bg-red-50 text-red-600',
    confirm: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    Icon: AlertTriangle,
    ring: 'bg-[#d4a843]/15 text-[#b7852e]',
    confirm: 'bg-[#c25e2a] hover:bg-[#a54c20] text-white',
  },
} as const;

/**
 * useConfirm — imperative confirmation over a branded card.
 *
 *   const { confirm, dialog } = useConfirm();
 *   ...
 *   if (await confirm({ title, message, variant: 'danger' })) { ... }
 *   ...
 *   return <>{...page...}{dialog}</>;
 */
export function useConfirm() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(ok: boolean) => void>();

  const confirm = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    return new Promise<boolean>(resolve => { resolver.current = resolve; });
  }, []);

  const close = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = undefined;
    setOpts(null);
  };

  const v = VARIANT[opts?.variant ?? 'warning'];
  const Icon = opts?.variant === 'danger' ? v.Icon : PencilLine;

  const dialog = (
    <AnimatePresence>
      {opts && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* backdrop — click cancels */}
          <div className="absolute inset-0 bg-[#1e1008]/60 backdrop-blur-[2px]" onClick={() => close(false)} />

          <motion.div
            role="alertdialog" aria-modal="true" aria-label={opts.title}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* brand top rule */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4a843] to-transparent" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <span className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${v.ring}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#1e1008]" style={{ fontFamily: 'var(--font-lidya-serif)' }}>
                    {opts.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{opts.message}</p>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-6">
                <button
                  onClick={() => close(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {opts.cancelLabel ?? 'Cancel'}
                </button>
                <button
                  autoFocus
                  onClick={() => close(true)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${v.confirm}`}
                >
                  {opts.confirmLabel ?? 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { confirm, dialog };
}

/**
 * Smoothly bring the (top-of-page) edit form into view and focus its first
 * field — fixes the "edit opened but nothing visible happened" trap when the
 * list is scrolled down.
 */
export function scrollToForm(ref: React.RefObject<HTMLElement | null>) {
  requestAnimationFrame(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const first = ref.current?.querySelector<HTMLElement>('input, select, textarea');
    setTimeout(() => first?.focus({ preventScroll: true }), 450);
  });
}
