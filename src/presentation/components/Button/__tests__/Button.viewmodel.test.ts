/** @format */
/**
 * Unit tests for button interaction derivation (disabled, dimmed opacity, spinner).
 */
import { resolveButtonInteraction } from "../Button.viewmodel";
describe("resolveButtonInteraction", () => {
  it("treats undefined props as enabled with full opacity and no spinner", () => {
    expect(resolveButtonInteraction(undefined, undefined)).toEqual({
      isDisabled: false,
      opacity: 1,
      showSpinner: false,
    });
  });
  it("disables and dims when explicitly disabled", () => {
    expect(resolveButtonInteraction(true, false)).toEqual({
      isDisabled: true,
      opacity: 0.4,
      showSpinner: false,
    });
  });
  it("shows a spinner and disables while loading", () => {
    expect(resolveButtonInteraction(false, true)).toEqual({
      isDisabled: true,
      opacity: 0.4,
      showSpinner: true,
    });
  });
  it("keeps loading dominant even when disabled is false", () => {
    const state = resolveButtonInteraction(false, true);
    expect(state.isDisabled).toBe(true);
    expect(state.showSpinner).toBe(true);
  });
  it("stays enabled for explicit false on both props", () => {
    const state = resolveButtonInteraction(false, false);
    expect(state.isDisabled).toBe(false);
    expect(state.opacity).toBe(1);
    expect(state.showSpinner).toBe(false);
  });
});
