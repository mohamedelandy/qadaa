/** @format */
/**
 * Wizard feature screen: 4-step onboarding with step indicator, slide transitions, next/back nav.
 */
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { View } from "@components/View/View";
import { useEffect } from "react";
import { PageLayout } from "@presentation/components/PageLayout/PageLayout";
import { StepIndicator } from "@presentation/components/StepIndicator/StepIndicator";
import { Button } from "@presentation/components/Button/Button";
import { useWizardViewModel } from "@presentation/features/wizard/hooks/useWizardViewModel";
import { WizardFormsProvider } from "./WizardFormsContext";
import { Step1Info } from "./components/Step1Info/Step1Info";
import { Step2Periods } from "./components/Step2Periods/Step2Periods";
import { Step3Pace } from "./components/Step3Pace/Step3Pace";
import { Step4Summary } from "./components/Step4Summary/Step4Summary";
import { spacing } from "@theme/spacing";
import { useUI } from "@hooks/useUI";
export default function Wizard() {
  const vm = useWizardViewModel();
  const { isRTL } = useUI();
  const slideSign = isRTL ? -1 : 1;
  const slide = useSharedValue<number>(30 * slideSign);
  const fade = useSharedValue<number>(0);
  useEffect(() => {
    slide.value = 30 * slideSign;
    fade.value = 0;
    const config = {
      duration: 250,
      easing: Easing.out(Easing.ease),
      reduceMotion: ReduceMotion.System,
    };
    slide.value = withTiming(0, config);
    fade.value = withTiming(1, config);
  }, [vm.currentStep, slide, fade, slideSign]);
  const stepStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateX: slide.value }],
  }));
  return (
    <PageLayout testID={`wizard-step${vm.currentStep + 1}-screen`}>
      <View style={styles.container}>
        <StepIndicator currentStep={vm.currentStep} totalSteps={4} />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <WizardFormsProvider control={vm.control} step2Control={vm.step2Control}>
            <Animated.View style={[styles.contentInner, stepStyle]}>
              {vm.currentStep === 0 && <Step1Info />}
              {vm.currentStep === 1 && <Step2Periods />}
              {vm.currentStep === 2 && <Step3Pace />}
              {vm.currentStep === 3 && <Step4Summary />}
              {(vm.showNext || vm.showBack) && (
                <View style={styles.nav}>
                  <View style={[styles.navButtons, { flexDirection: "row" }]}>
                    {vm.showBack && (
                      <Button
                        testID={`wizard-step${vm.currentStep}-back-btn`}
                        title={vm.t("wizard.back")}
                        variant="secondary"
                        onPress={vm.prevStep}
                        style={styles.navBtn}
                      />
                    )}
                    {vm.showNext && (
                      <Button
                        testID={`wizard-step${vm.currentStep + 1}-next-btn`}
                        title={vm.t("wizard.next")}
                        variant="primary"
                        onPress={vm.nextStep}
                        disabled={vm.isNextDisabled}
                        style={vm.showBack ? styles.navBtn : styles.navBtnFull}
                      />
                    )}
                  </View>
                </View>
              )}
            </Animated.View>
          </WizardFormsProvider>
        </KeyboardAwareScrollView>
      </View>
    </PageLayout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
  },
  contentInner: {
    flex: 1,
    justifyContent: "center",
  },
  nav: {
    gap: spacing[3],
    paddingTop: spacing[3],
    height: spacing[12],
  },
  navButtons: {
    gap: spacing[3],
    flex: 1,
  },
  navBtn: {
    flex: 1,
  },
  navBtnFull: {
    flex: 1,
  },
});
