/** @format */
/**
 * Unit tests for the reset button view model (confirm/cancel state machine and themed styles).
 */
import { renderHook, act } from "@testing-library/react-native";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "ar" } }),
}));
import { useResetButtonViewModel } from "../ResetButton.viewmodel";
import { useUI } from "@hooks/useUI";

async function renderColors() {
  const ui = await renderHook(() => useUI());
  return ui.result.current.colors;
}
describe("useResetButtonViewModel", () => {
  it("starts idle with confirming false", async () => {
    const { result } = await renderHook(() => useResetButtonViewModel({ onReset: jest.fn() }));
    expect(result.current.confirming).toBe(false);
  });
  it("setConfirming moves between the idle and confirm/cancel phases", async () => {
    const { result } = await renderHook(() => useResetButtonViewModel({ onReset: jest.fn() }));
    await act(async () => {
      result.current.setConfirming(true);
    });
    expect(result.current.confirming).toBe(true);
    await act(async () => {
      result.current.setConfirming(false);
    });
    expect(result.current.confirming).toBe(false);
  });
  it("hands the caller's reset handler through unchanged", async () => {
    const onReset = jest.fn();
    const { result } = await renderHook(() => useResetButtonViewModel({ onReset }));
    expect(result.current.onReset).toBe(onReset);
    result.current.onReset();
    expect(onReset).toHaveBeenCalledTimes(1);
  });
  it("styles the destructive and cancel actions from theme tokens", async () => {
    const { result } = await renderHook(() => useResetButtonViewModel({ onReset: jest.fn() }));
    const colors = await renderColors();
    expect(result.current.styles.resetButton.backgroundColor).toBe(colors.red);
    expect(result.current.styles.resetText.color).toBe(colors.white);
    expect(result.current.styles.cancelButton.borderColor).toBe(colors.borderStrong);
    expect(result.current.styles.warning.color).toBe(colors.red);
  });
});
