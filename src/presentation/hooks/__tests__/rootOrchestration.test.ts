/** @format */
/**
 * Unit tests for direction resolve, i18n language sync and notification permission reconcile.
 */
import {
  resolveInitialDirection,
  syncLanguage,
  syncLanguageAsync,
  reconcileNotificationPermission,
} from "../rootOrchestration";
describe("resolveInitialDirection", () => {
  it("returns true (RTL) when the device language is Arabic", () => {
    expect(resolveInitialDirection([{ languageCode: "ar" }])).toBe(true);
  });
  it("returns false (LTR) when the device language is English", () => {
    expect(resolveInitialDirection([{ languageCode: "en" }])).toBe(false);
  });
  it("returns true for unknown languages (Arabic fallback)", () => {
    expect(resolveInitialDirection([{ languageCode: "fr" }])).toBe(true);
  });
  it("returns true when no locale resolves", () => {
    expect(resolveInitialDirection([])).toBe(true);
  });
  it("uses the first locale when multiple are present", () => {
    expect(resolveInitialDirection([{ languageCode: "en" }, { languageCode: "ar" }])).toBe(false);
  });
});
describe("syncLanguage", () => {
  it("forces RTL and changes i18n when the stored language differs", () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockResolvedValue(undefined);
    const result = syncLanguage("ar", { language: "en", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: true, alreadyMatched: false });
    expect(forceRTL).toHaveBeenCalledWith(true);
    expect(changeLanguage).toHaveBeenCalledWith("ar");
  });
  it("forces LTR and changes i18n when stored is English", () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockResolvedValue(undefined);
    const result = syncLanguage("en", { language: "ar", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: false, alreadyMatched: false });
    expect(forceRTL).toHaveBeenCalledWith(false);
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });
  it("does not change i18n when it already matches", () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn();
    const result = syncLanguage("ar", { language: "ar", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: true, alreadyMatched: true });
    expect(changeLanguage).not.toHaveBeenCalled();
  });
  it("swallows changeLanguage rejection — best-effort boot", async () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockRejectedValue(new Error("i18n boom"));
    const result = syncLanguage("ar", { language: "en", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: true, alreadyMatched: false });
    expect(forceRTL).toHaveBeenCalledWith(true);
    expect(changeLanguage).toHaveBeenCalledWith("ar");
    // Ensure that the rejected promise is fully flushed so it's reported as caught.
    await new Promise(process.nextTick);
  });
});
describe("syncLanguageAsync", () => {
  it("forces RTL and awaits the i18n switch when the stored language differs", async () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockResolvedValue(undefined);
    const result = await syncLanguageAsync("ar", { language: "en", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: true, alreadyMatched: false });
    expect(forceRTL).toHaveBeenCalledWith(true);
    expect(changeLanguage).toHaveBeenCalledWith("ar");
  });

  it("forces LTR and awaits the i18n switch when the stored language is English", async () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockResolvedValue(undefined);
    const result = await syncLanguageAsync("en", { language: "ar", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: false, alreadyMatched: false });
    expect(forceRTL).toHaveBeenCalledWith(false);
    expect(changeLanguage).toHaveBeenCalledWith("en");
  });

  it("does not change i18n when it already matches (stable launch, no remount)", async () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn();
    const result = await syncLanguageAsync("en", { language: "en", changeLanguage }, forceRTL);
    expect(result).toEqual({ isRtl: false, alreadyMatched: true });
    expect(changeLanguage).not.toHaveBeenCalled();
  });

  it("resolves (does not throw) when changeLanguage rejects — best-effort boot", async () => {
    const forceRTL = jest.fn();
    const changeLanguage = jest.fn().mockRejectedValue(new Error("i18n boom"));
    await expect(
      syncLanguageAsync("en", { language: "ar", changeLanguage }, forceRTL)
    ).resolves.toEqual({ isRtl: false, alreadyMatched: false });
  });
});

describe("reconcileNotificationPermission", () => {
  it("updates the stored permission when it differs", async () => {
    const setPermission = jest.fn();
    const getPermissions = jest.fn().mockResolvedValue({ status: "granted" });
    await reconcileNotificationPermission(getPermissions, "denied", setPermission);
    expect(setPermission).toHaveBeenCalledWith("granted");
  });
  it("does not update when the stored value already matches", async () => {
    const setPermission = jest.fn();
    const getPermissions = jest.fn().mockResolvedValue({ status: "granted" });
    await reconcileNotificationPermission(getPermissions, "granted", setPermission);
    expect(setPermission).not.toHaveBeenCalled();
  });
  it("swallows read failures (best-effort boot)", async () => {
    const setPermission = jest.fn();
    const getPermissions = jest.fn().mockRejectedValue(new Error("no perms api"));
    await expect(
      reconcileNotificationPermission(getPermissions, "default", setPermission)
    ).resolves.toBeUndefined();
    expect(setPermission).not.toHaveBeenCalled();
  });
});
