import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'info';
interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface ToastCtx {
  toast: (t: { kind?: ToastKind; title: string; message?: string }) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('ToastProvider missing');
  return c;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback<ToastCtx['toast']>((t) => {
    const id = Math.random().toString(36).slice(2);
    const next: Toast = { id, kind: t.kind ?? 'success', title: t.title, message: t.message };
    setToasts((cur) => [...cur, next]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: string) => setToasts((cur) => cur.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none sm:bottom-6 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 max-w-sm rounded-2xl bg-white/95 backdrop-blur px-4 py-3.5 shadow-lift ring-1 ring-brand-100 animate-toast-in"
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                t.kind === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-600'
              }`}
            >
              {t.kind === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-semibold text-ink-900">{t.title}</p>
              {t.message && <p className="text-sm text-ink-600 mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="mt-0.5 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
