import { createContext, useContext, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, type Toast } from '@/hooks/useToast';

interface ToastContextValue {
  show: (text: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, show, dismiss } = useToast();

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="bg-bg-2 border rounded-full px-5 py-3 flex items-center gap-2 text-sm pointer-events-auto shadow-lg"
              style={{
                borderColor:
                  t.type === 'success'
                    ? 'rgba(34,197,94,0.4)'
                    : t.type === 'error'
                    ? 'rgba(239,68,68,0.4)'
                    : t.type === 'warning'
                    ? 'rgba(251,146,60,0.4)'
                    : 'rgba(139,92,246,0.4)',
              }}
            >
              {t.type === 'success' && <Check size={16} className="text-green-400" />}
              {t.type === 'error' && <X size={16} className="text-red-400" />}
              {t.type === 'warning' && <AlertTriangle size={16} className="text-orange-400" />}
              {t.type === 'info' && <Info size={16} className="text-purple-400" />}
              <span>{t.text}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 opacity-50 hover:opacity-100"
                aria-label="Cerrar"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used inside ToastProvider');
  return ctx;
}
