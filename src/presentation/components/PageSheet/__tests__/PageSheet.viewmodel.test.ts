/** @format */
/**
 * Unit tests for PageSheet viewmodel: dismiss thresholds, overlay visibility sync, mount lifecycle.
 */
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { renderHook, act, waitFor } from "@testing-library/react-native";
import {
  shouldDismissSheet,
  useSheetMounted,
  useSheetOverlayVisibility,
} from "../PageSheet.viewmodel";
import { useModalVisibilityStore } from "@stores/useModalVisibilityStore";
describe("shouldDismissSheet", () => {
  it("returns true when translation exceeds the distance threshold", () => {
    expect(shouldDismissSheet(100, 0)).toBe(true);
  });
  it("returns true when velocity exceeds the velocity threshold", () => {
    expect(shouldDismissSheet(0, 1000)).toBe(true);
  });
  it("returns true when either threshold is crossed (OR)", () => {
    expect(shouldDismissSheet(100, 1000)).toBe(true);
  });
  it("returns false when neither threshold is crossed", () => {
    expect(shouldDismissSheet(10, 100)).toBe(false);
  });
});
describe("useSheetOverlayVisibility", () => {
  it("syncs the modal visibility store with the visible flag", async () => {
    useModalVisibilityStore.setState({ activeOpen: false });
    const { rerender } = await renderHook(
      (visible: boolean) => useSheetOverlayVisibility(visible),
      {
        initialProps: true,
      }
    );
    await waitFor(() => {
      expect(useModalVisibilityStore.getState().activeOpen).toBe(true);
    });
    await act(async () => {
      rerender(false);
    });
    await waitFor(() => {
      expect(useModalVisibilityStore.getState().activeOpen).toBe(false);
    });
  });
  it("stays open when a later-mounted hidden sheet reports visible=false (effect-order race)", async () => {
    useModalVisibilityStore.setState({ activeOpen: false });
    // Mirrors the dashboard: IntentionSheet mounts before DuaModal. When both
    // mount together (one visible, one not), the hidden sheet must not clobber
    // the visible sheet's registration regardless of effect order.
    const first = await renderHook((visible: boolean) => useSheetOverlayVisibility(visible), {
      initialProps: true,
    });
    const second = await renderHook((visible: boolean) => useSheetOverlayVisibility(visible), {
      initialProps: false,
    });
    await waitFor(() => {
      expect(useModalVisibilityStore.getState().activeOpen).toBe(true);
    });
    await act(async () => {
      second.rerender(true);
    });
    expect(useModalVisibilityStore.getState().activeOpen).toBe(true);
    await act(async () => {
      first.rerender(false);
    });
    await waitFor(() => {
      expect(useModalVisibilityStore.getState().activeOpen).toBe(true);
    });
    await act(async () => {
      second.rerender(false);
    });
    await waitFor(() => {
      expect(useModalVisibilityStore.getState().activeOpen).toBe(false);
    });
  });
});
describe("useSheetMounted", () => {
  it("keeps the sheet mounted while visible and hides it after", async () => {
    const { result, rerender } = await renderHook((visible: boolean) => useSheetMounted(visible), {
      initialProps: true,
    });
    expect(result.current.mounted).toBe(true);
    await act(async () => {
      result.current.hide();
    });
    expect(result.current.mounted).toBe(false);
    await act(async () => {
      result.current.show();
    });
    expect(result.current.mounted).toBe(true);
    await act(async () => {
      rerender(false);
    });
    expect(result.current.mounted).toBe(true);
  });
});
