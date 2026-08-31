/** @format */
/**
 * Unit tests ensuring theme store rehydration does not clobber a runtime-set RTL direction.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORE_KEY = "qadaa-theme";
beforeEach(async () => {
  await AsyncStorage.clear();
});
it("rehydrate does not clobber direction set by the app", async () => {
  await AsyncStorage.setItem(
    STORE_KEY,
    JSON.stringify({ state: { mode: "light", direction: "ltr" }, version: 0 })
  );
  let store:
    | {
        getState: () => {
          direction: "ltr" | "rtl";
        };
      }
    | undefined;
  jest.isolateModules(() => {
    const { useThemeStore } = require("@stores/useThemeStore");
    store = useThemeStore;
    useThemeStore.getState().setDirection("rtl");
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(store?.getState().direction).toBe("rtl");
});
