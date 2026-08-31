/** @format */
/**
 * Unit tests for daily target preset/custom selection, store sync, save flow, and haptics.
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
jest.mock("expo-haptics", () => ({
  __esModule: true,
  selectionAsync: jest.fn(),
}));
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@stores/useSettingsStore";
import { useSettingsTarget } from "../useSettingsTarget";
describe("useSettingsTarget", () => {
  beforeEach(() => {
    useSettingsStore.setState(useSettingsStore.getInitialState());
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("initializes preset from the store dailyTarget", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    expect(result.current.preset).toBe(5);
    expect(result.current.isCustom).toBe(false);
  });
  it("initializes custom when store dailyTarget is not a preset", async () => {
    useSettingsStore.getState().setDailyTarget(7);
    const { result } = await renderHook(() => useSettingsTarget());
    expect(result.current.preset).toBe(-1);
    expect(result.current.isCustom).toBe(true);
    expect(result.current.customTarget).toBe("7");
  });
  it("updates preset when store dailyTarget changes to a preset", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      useSettingsStore.getState().setDailyTarget(10);
    });
    expect(result.current.preset).toBe(10);
    expect(result.current.isCustom).toBe(false);
  });
  it("updates custom when store dailyTarget changes to non-preset", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      useSettingsStore.getState().setDailyTarget(8);
    });
    expect(result.current.preset).toBe(-1);
    expect(result.current.isCustom).toBe(true);
    expect(result.current.customTarget).toBe("8");
  });
  it("handleTargetSave sets the preset target and fires haptics", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      result.current.selectPreset(1);
    });
    await act(async () => {
      result.current.handleTargetSave();
    });
    expect(useSettingsStore.getState().dailyTarget).toBe(1);
    expect(Haptics.selectionAsync).toHaveBeenCalled();
    expect(result.current.targetSaved).toBe(true);
  });
  it("handleTargetSave sets the custom target and fires haptics", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      result.current.selectPreset(-1);
      result.current.setCustomTarget("7");
    });
    await act(async () => {
      result.current.handleTargetSave();
    });
    expect(useSettingsStore.getState().dailyTarget).toBe(7);
    expect(Haptics.selectionAsync).toHaveBeenCalled();
    expect(result.current.targetSaved).toBe(true);
  });
  it("handleTargetSave rejects invalid custom values", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      result.current.selectPreset(-1);
      result.current.setCustomTarget("0");
    });
    await act(async () => {
      result.current.handleTargetSave();
    });
    expect(useSettingsStore.getState().dailyTarget).toBe(5);
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });
  it("handleTargetSave rejects custom values > 50", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      result.current.selectPreset(-1);
      result.current.setCustomTarget("51");
    });
    await act(async () => {
      result.current.handleTargetSave();
    });
    expect(useSettingsStore.getState().dailyTarget).toBe(5);
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });
  it("targetSaved clears after timeout", async () => {
    const { result } = await renderHook(() => useSettingsTarget());
    await act(async () => {
      result.current.selectPreset(1);
      result.current.handleTargetSave();
    });
    expect(result.current.targetSaved).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.targetSaved).toBe(false);
  });
});
