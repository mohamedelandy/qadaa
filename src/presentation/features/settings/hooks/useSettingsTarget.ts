/** @format */
/**
 * Daily recovery target selection: preset chips or validated custom value with haptic save feedback.
 */
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import * as Haptics from "expo-haptics";
import { useSafeTimeouts } from "@hooks/useSafeTimeouts";
import { useSettingsStore } from "@stores/useSettingsStore";
const PRESETS = [1, 5, 10] as const;
type PresetValue = (typeof PRESETS)[number];
function isPreset(n: number): n is PresetValue {
  return PRESETS.includes(n as PresetValue);
}
export function useSettingsTarget() {
  const dailyTarget = useSettingsStore((s) => s.dailyTarget);
  const setDailyTarget = useSettingsStore((s) => s.setDailyTarget);
  const initialPreset = useMemo(() => (isPreset(dailyTarget) ? dailyTarget : -1), [dailyTarget]);
  const [preset, setPreset] = useState<number>(initialPreset);
  const [customTarget, setCustomTarget] = useState<string>(
    initialPreset === -1 ? String(dailyTarget) : ""
  );
  const [targetSaved, setTargetSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimeouts();

  useEffect(() => {
    if (isPreset(dailyTarget)) {
      setPreset(dailyTarget);
      setCustomTarget("");
    } else {
      setPreset(-1);
      setCustomTarget(String(dailyTarget));
    }
  }, [dailyTarget]);
  const isCustom = preset === -1;
  const customTargetNum = parseInt(customTarget, 10);
  const isCustomValid = /^\d+$/.test(customTarget) && customTargetNum > 0 && customTargetNum <= 50;
  const isValid = isCustom ? isCustomValid : preset > 0;
  const selectPreset = useCallback((n: number) => {
    setPreset(n);
    setCustomTarget("");
  }, []);
  const handleTargetSave = useCallback(() => {
    if (!isValid) return;
    const target = isCustom ? customTargetNum : preset;
    setDailyTarget(target);
    void Haptics.selectionAsync();
    setTargetSaved(true);
    if (savedTimer.current) clearSafeTimeout(savedTimer.current);
    savedTimer.current = setSafeTimeout(() => {
      setTargetSaved(false);
      savedTimer.current = null;
    }, 2000);
  }, [
    isCustom,
    customTargetNum,
    preset,
    isValid,
    setDailyTarget,
    setSafeTimeout,
    clearSafeTimeout,
  ]);
  return {
    preset,
    selectPreset,
    setCustomTarget,
    customTarget,
    isCustom,
    isValid,
    targetSaved,
    handleTargetSave,
  };
}
