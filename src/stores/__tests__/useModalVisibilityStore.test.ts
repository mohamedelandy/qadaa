/** @format */
/**
 * Unit tests for the overlay visibility flag store.
 */
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
describe("useModalVisibilityStore", () => {
  test("defaults to inactive", () => {
    expect(useModalVisibilityStore.getState().activeOpen).toBe(false);
  });
  test("setOverlayOpen toggles activeOpen", () => {
    useModalVisibilityStore.getState().setOverlayOpen(true);
    expect(useModalVisibilityStore.getState().activeOpen).toBe(true);
    useModalVisibilityStore.getState().setOverlayOpen(false);
    expect(useModalVisibilityStore.getState().activeOpen).toBe(false);
  });
});
