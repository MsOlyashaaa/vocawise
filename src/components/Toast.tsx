import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { onQuotaExceeded } from '@storage/localStore';

interface ToastItem {
  id: number;
  text: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
}
interface ToastContextValue {
  push: (text: string, tone?: ToastItem['tone']) => void;
}

const Ctx = createContext<ToastContextValue | null>(null);

const TONE_BG: Record<ToastItem['tone'], string> = {
  brand: 'bg-brand-500 text-white',
  success: 'bg-success-500 text-white',
  warning: 'bg-warning-500 text-zinc-900',
  danger: 'bg-danger-500 text-white',
};

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((text: string, tone: ToastItem['tone'] = 'brand') => {
    const id = nextId++;
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-fadeIn rounded-full px-4 py-2 text-sm font-medium shadow-elev ${TONE_BG[t.tone]}`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastQuotaBridge({ children }: { children: ReactNode }) {
  const { push } = useToast();
  useEffect(() => {
    return onQuotaExceeded(() => push('Сховище переповнене. Прогрес не збережено.', 'warning'));
  }, [push]);
  return <>{children}</>;
}
