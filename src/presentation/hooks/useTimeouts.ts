/** @format */

import { useRef, useEffect, useCallback } from "react";

/**
 * A hook that manages an array of timeouts, automatically clears them on unmount,
 * and provides an addTimeout function to safely set timeouts.
 */
export function useTimeouts() {
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const addTimeout = useCallback((callback: () => void, delay?: number) => {
    const timerId = setTimeout(() => {
      // Remove this timer from the array after it executes
      timers.current = timers.current.filter((t) => t !== timerId);
      callback();
    }, delay);
    timers.current.push(timerId);
    return timerId;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    return () => {
      // ESLint may complain if we don't copy the ref, but this pattern is safe here
      // since the ref mutation happens before unmount, not during.
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return { addTimeout, clearAllTimeouts };
}
