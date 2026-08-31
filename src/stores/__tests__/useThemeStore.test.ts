/** @format */
/**
 * Unit tests for theme mode/direction persistence and OS scheme sync.
 */
import { useThemeStore } from "@stores/useThemeStore";
describe("useThemeStore", () => {
  test("initial mode is light or dark", () => {
    expect(["light", "dark"]).toContain(useThemeStore.getState().mode);
  });
  test("setMode updates mode", () => {
    useThemeStore.getState().setMode("dark");
    expect(useThemeStore.getState().mode).toBe("dark");
  });
  test("toggleTheme flips mode", () => {
    useThemeStore.getState().setMode("dark");
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe("light");
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe("dark");
  });
  test("mode changes sync the OS color scheme (system chrome follows)", () => {
    const { Appearance } = require("react-native");
    const setColorSchemeSpy = jest.spyOn(Appearance, "setColorScheme");
    useThemeStore.getState().setMode("light");
    expect(setColorSchemeSpy).toHaveBeenLastCalledWith("light");
    useThemeStore.getState().toggleTheme();
    expect(setColorSchemeSpy).toHaveBeenLastCalledWith("dark");
    setColorSchemeSpy.mockRestore();
  });
  test("setDirection updates direction", () => {
    useThemeStore.getState().setDirection("rtl");
    expect(useThemeStore.getState().direction).toBe("rtl");
  });
  test("derives initial mode from device color scheme", () => {
    jest.isolateModules(() => {
      const { Appearance } = require("react-native");
      jest.spyOn(Appearance, "getColorScheme").mockReturnValue("dark");
      const { useThemeStore: darkStore } = require("@stores/useThemeStore");
      expect(darkStore.getState().mode).toBe("dark");
    });
    jest.isolateModules(() => {
      const { Appearance } = require("react-native");
      jest.spyOn(Appearance, "getColorScheme").mockReturnValue("light");
      const { useThemeStore: lightStore } = require("@stores/useThemeStore");
      expect(lightStore.getState().mode).toBe("light");
    });
  });
});
