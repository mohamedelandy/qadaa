/** @format */
/**
 * Unit tests for the theme store's onRehydrateStorage callback syncing the OS color scheme.
 */
import { Appearance } from "react-native";
import { useThemeStore } from "../useThemeStore";

describe("theme rehydrate", () => {
  it("onRehydrateStorage applies persisted mode to OS colorScheme", () => {
    const spy = jest.spyOn(Appearance, "setColorScheme").mockImplementation(() => undefined);
    const handler = useThemeStore.persist.getOptions().onRehydrateStorage?.(undefined as never);
    handler?.({ mode: "dark" } as never, undefined);
    expect(spy).toHaveBeenCalledWith("dark");
    spy.mockRestore();
  });

  it("handler is a no-op when state has no mode", () => {
    const spy = jest.spyOn(Appearance, "setColorScheme").mockImplementation(() => undefined);
    const handler = useThemeStore.persist.getOptions().onRehydrateStorage?.(undefined as never);
    expect(() => handler?.(undefined as never, undefined)).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
