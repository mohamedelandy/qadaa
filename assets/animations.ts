/** @format */
import { type AnimationObject } from "lottie-react-native";

// Import all animation JSONs
import confetti from "./animations/confetti.json";
import sparklePop from "./animations/sparkle-pop.json";
import animatedFlame from "./animations/animated-flame.json";
import onboardingWelcome from "./animations/onboarding-welcome.json";
import onboardingLog from "./animations/onboarding-log.json";
import onboardingStreak from "./animations/onboarding-streak.json";
import onboardingBadges from "./animations/onboarding-badges.json";
import journeyBegins from "./animations/journey-begins.json";
import lantern from "./animations/lantern.json";
import gentleGlow from "./animations/gentle-glow.json";
import sparkles from "./animations/sparkles.json";
import emptyChart from "./animations/empty-chart.json";
import orbitingDots from "./animations/orbiting-dots.json";
import starBurst from "./animations/star-burst.json";
import shimmer from "./animations/shimmer.json";
import cellPop from "./animations/cell-pop.json";
import progressFill from "./animations/progress-fill.json";
import brokenRobot from "./animations/broken-robot.json";
import warningPulse from "./animations/warning-pulse.json";
import checkmarkDraw from "./animations/checkmark-draw.json";
import glintSweep from "./animations/glint-sweep.json";

export const ANIMATIONS = {
  confetti,
  "sparkle-pop": sparklePop,
  "animated-flame": animatedFlame,
  "onboarding-welcome": onboardingWelcome,
  "onboarding-log": onboardingLog,
  "onboarding-streak": onboardingStreak,
  "onboarding-badges": onboardingBadges,
  "journey-begins": journeyBegins,
  lantern,
  "gentle-glow": gentleGlow,
  sparkles,
  "empty-chart": emptyChart,
  "orbiting-dots": orbitingDots,
  "star-burst": starBurst,
  shimmer,
  "cell-pop": cellPop,
  "progress-fill": progressFill,
  "broken-robot": brokenRobot,
  "warning-pulse": warningPulse,
  "checkmark-draw": checkmarkDraw,
  "glint-sweep": glintSweep,
} as const;

export type AnimationName = keyof typeof ANIMATIONS;

export type { AnimationObject as LottieAnimationData };
