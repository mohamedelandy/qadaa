/** @format */
import { useEffect, useRef, useCallback } from "react";

export function useTimeouts() {
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const register = useCallback((id: ReturnType<typeof setTimeout>) => {
    timers.current.push(id);
  }, []);

  const unregister = useCallback((id: ReturnType<typeof setTimeout>) => {
    timers.current = timers.current.filter((timer) => timer !== id);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return { register, unregister };
}
