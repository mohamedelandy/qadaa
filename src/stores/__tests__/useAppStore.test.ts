/** @format */
/**
 * Unit tests for app-level onboarding/wizard/tour flags.
 */
import { useAppStore } from "@stores/useAppStore";
beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState());
});
describe("useAppStore", () => {
  test("onboarding flag", () => {
    expect(useAppStore.getState().onboardingComplete).toBe(false);
    useAppStore.getState().completeOnboarding();
    expect(useAppStore.getState().onboardingComplete).toBe(true);
  });
  test("wizard flag", () => {
    expect(useAppStore.getState().wizardComplete).toBe(false);
    useAppStore.getState().completeWizard();
    expect(useAppStore.getState().wizardComplete).toBe(true);
  });
  test("dashboard tour flag", () => {
    expect(useAppStore.getState().dashboardTourComplete).toBe(false);
    useAppStore.getState().completeDashboardTour();
    expect(useAppStore.getState().dashboardTourComplete).toBe(true);
  });
  test("resetAll clears every flag", () => {
    useAppStore.getState().completeOnboarding();
    useAppStore.getState().completeDashboardTour();
    useAppStore.getState().completeWizard();
    useAppStore.getState().resetAll();
    expect(useAppStore.getState()).toMatchObject({
      onboardingComplete: false,
      dashboardTourComplete: false,
      wizardComplete: false,
    });
  });
});
