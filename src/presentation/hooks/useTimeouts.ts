/** @format */

import { useRef, useEffect, useCallback } from "react";

/**
 * A custom hook to manage multiple timeouts and automatically clear them on unmount.
 */
export function useTimeouts() {
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      callback();
      timers.current = timers.current.filter((t) => t !== timer);
    }, delay);
    timers.current.push(timer);
    return timer;
  }, []);

  const clearTimeoutId = useCallback((timerId: ReturnType<typeof setTimeout>) => {
    clearTimeout(timerId);
    timers.current = timers.current.filter((t) => t !== timerId);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return { addTimeout, clearTimeout: clearTimeoutId };
}
