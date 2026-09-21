/** @format */
/**
 * Hook to safely manage multiple timeouts and ensure they are cleared on unmount.
 */
import { useEffect, useRef, useCallback } from "react";

export function useSafeTimeouts() {
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const setSafeTimeout = useCallback((callback: () => void, ms?: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, ms);
    timers.current.add(timer);
    return timer;
  }, []);

  const clearSafeTimeout = useCallback((timer: ReturnType<typeof setTimeout>) => {
    clearTimeout(timer);
    timers.current.delete(timer);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  return { setSafeTimeout, clearSafeTimeout };
}
