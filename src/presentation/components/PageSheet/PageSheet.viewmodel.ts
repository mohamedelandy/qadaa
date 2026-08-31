/** @format */
/**
 * Sheet helpers: dismiss gesture thresholds, modal-overlay store sync, and delayed unmount lifecycle.
 */
import { useCallback, useEffect, useId, useState } from "react";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 900;
export function shouldDismissSheet(translationY: number, velocityY: number): boolean {
  "worklet";
  return translationY > DISMISS_DISTANCE || velocityY > DISMISS_VELOCITY;
}
/**
 * Ref-counted overlay registry. Several Sheets stay mounted at once (e.g.
 * IntentionSheet + DuaModal on the dashboard), so a single boolean overwrite
 * races: whichever sheet's effect runs last would win even when it reports
 * `visible=false`. Tracking open sheets by id keeps the bar hidden while ANY
 * mounted sheet is visible, independent of effect order.
 */
const openSheets = new Set<string>();
export function useSheetOverlayVisibility(visible: boolean) {
  const setOverlayOpen = useModalVisibilityStore((s) => s.setOverlayOpen);
  const id = useId();
  useEffect(() => {
    if (visible) {
      openSheets.add(id);
    } else {
      openSheets.delete(id);
    }
    setOverlayOpen(openSheets.size > 0);
    return () => {
      openSheets.delete(id);
      setOverlayOpen(openSheets.size > 0);
    };
  }, [visible, id, setOverlayOpen]);
}
export function useSheetMounted(visible: boolean) {
  const [mounted, setMounted] = useState(visible);
  const show = useCallback(() => setMounted(true), []);
  const hide = useCallback(() => setMounted(false), []);
  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible, show]);
  return { mounted, show, hide };
}
