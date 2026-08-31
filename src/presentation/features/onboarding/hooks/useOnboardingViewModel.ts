/** @format */
/**
 * Onboarding view model: slide list/state, next/skip actions, routing to wizard or dashboard after completion.
 */
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useUI } from "@hooks/useUI";
import { useAppStore } from "@stores/useAppStore";
import { useOnboardingStyles } from "./useOnboardingStyles";
import type { AnimationName } from "@components/Lottie";
interface Slide {
  emoji: string;
  title: string;
  body: string;
  animationName?: AnimationName;
}
export function useOnboardingViewModel() {
  const { t, colors } = useUI();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const router = useRouter();
  const { styles } = useOnboardingStyles();
  const onboardingAnimations: AnimationName[] = [
    "onboarding-welcome",
    "onboarding-log",
    "onboarding-streak",
    "onboarding-badges",
  ];
  const rawSlides = t("onboarding.slides", { returnObjects: true }) as Slide[];
  const slides = rawSlides.map((slide, i) => ({
    ...slide,
    animationName: onboardingAnimations[i],
  }));
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;
  const isLastSlide = currentSlide === totalSlides - 1;
  const finish = useCallback(() => {
    completeOnboarding();
    const route = useAppStore.getState().wizardComplete ? "/(tabs)/dashboard" : "/wizard";
    router.replace(route);
  }, [completeOnboarding, router]);
  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      finish();
    }
  }, [currentSlide, slides.length, finish]);
  const skip = useCallback(() => {
    completeOnboarding();
    const route = useAppStore.getState().wizardComplete ? "/(tabs)/dashboard" : "/wizard";
    router.replace(route);
  }, [completeOnboarding, router]);
  return {
    t,
    colors,
    styles,
    currentSlide,
    totalSlides,
    slides,
    nextSlide,
    skip,
    isLastSlide,
  };
}
