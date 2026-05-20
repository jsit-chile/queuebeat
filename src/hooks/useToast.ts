import { useState, useCallback, useRef, useEffect } from 'react';

export interface Toast {
  id: number;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

let counter = 0;

/**
 * Hook simple para mostrar toasts.
 * Para un caso real podría reemplazarse con react-hot-toast o sonner.
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (text: string, type: Toast['type'] = 'success') => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, text, type }]);
      const handle = window.setTimeout(() => dismiss(id), 2800);
      timers.current.set(id, handle);
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((h) => window.clearTimeout(h));
      timers.current.clear();
    };
  }, []);

  return { toasts, show, dismiss };
}
