/** @format */
/**
 * Global flag tracking whether any modal overlay is open.
 */
import { create } from "zustand";
export interface ModalVisibilityState {
  activeOpen: boolean;
  setOverlayOpen: (v: boolean) => void;
}
// NOTE: simple boolean, not ref-counted — assumes at most one overlay open
// at a time (single PageSheet drives it today). If multiple overlays ever
// mount simultaneously, switch to a counter.
export const useModalVisibilityStore = create<ModalVisibilityState>((set) => ({
  activeOpen: false,
  setOverlayOpen: (v) => set({ activeOpen: v }),
}));
