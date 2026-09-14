/** @format */
/**
 * Onboarding route — slide carousel screen with step indicator, skip control, and next/begin button.
 */
import { View } from "react-native";
import { Text } from "@components/Text/Text";
import { PageLayout } from "@presentation/components/PageLayout/PageLayout";
import { Button } from "@presentation/components/Button/Button";
import { PressableScale } from "@components/PressableScale/PressableScale";
import { StepIndicator } from "@presentation/components/StepIndicator/StepIndicator";
import { useOnboardingViewModel } from "@presentation/features/onboarding/hooks/useOnboardingViewModel";
import { OnboardingSlide } from "./components/OnboardingSlide/OnboardingSlide";
export default function OnboardingScreen() {
  const { t, colors, styles, currentSlide, totalSlides, slides, nextSlide, skip, isLastSlide } =
    useOnboardingViewModel();
  const slide = slides[currentSlide];
  return (
    <PageLayout>
      <View style={styles.topBar}>
        <StepIndicator currentStep={currentSlide} totalSteps={totalSlides} />
        {!isLastSlide ? (
          <PressableScale testID="onboarding-skip-btn" style={styles.skipButton} onPress={skip}>
            <Text variant="xs" weight="medium" color={colors.textMuted}>
              {t("onboarding.skip")}
            </Text>
          </PressableScale>
        ) : (
          <View />
        )}
      </View>

      <View testID={`onboarding-slide-${currentSlide + 1}`} style={styles.slideArea}>
        {slide && (
          <OnboardingSlide
            key={currentSlide}
            emoji={slide.emoji}
            title={slide.title}
            body={slide.body}
            animationName={slide.animationName}
          />
        )}
      </View>

      <View style={styles.bottomBar}>
        <Button
          testID="onboarding-next-btn"
          title={isLastSlide ? t("onboarding.begin") : t("onboarding.next")}
          onPress={nextSlide}
        />
      </View>
    </PageLayout>
  );
}
