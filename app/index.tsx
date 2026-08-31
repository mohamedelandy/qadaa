/** @format */
/**
 * Entry redirect screen (onboarding/wizard/dashboard based on state)
 */
import { Redirect } from "expo-router";
import { useAppStore } from "@stores/useAppStore";
import { useEffect, useState } from "react";

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const wizardComplete = useAppStore((s) => s.wizardComplete);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  if (!hydrated) return null;

  if (!onboardingComplete) return <Redirect href="/onboarding" />;
  if (!wizardComplete) return <Redirect href="/wizard" />;
  return <Redirect href="/(tabs)/dashboard" />;
}
