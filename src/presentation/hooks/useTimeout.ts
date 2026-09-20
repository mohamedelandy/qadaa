/** @format */
import { useCallback, useEffect, useRef, useMemo } from "react";

export function useTimeout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const set = useCallback(
    (callback: () => void, ms: number) => {
      clear();
      timerRef.current = setTimeout(callback, ms);
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return useMemo(() => ({ set, clear }), [set, clear]);
}
