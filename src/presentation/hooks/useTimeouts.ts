/** @format */
import { useEffect, useRef, useCallback } from "react";

export function useTimeouts() {
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const register = useCallback((id: ReturnType<typeof setTimeout>) => {
    timers.current.push(id);
  }, []);

  const unregister = useCallback((id: ReturnType<typeof setTimeout>) => {
    const index = timers.current.indexOf(id);
    if (index > -1) {
      timers.current.splice(index, 1);
    }
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return { register, unregister };
}
