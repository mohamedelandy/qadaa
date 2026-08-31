/** @format */
/**
 * Persisted app flags: onboarding, wizard completion, dashboard tour.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "@data/storage/storage";
import { PERSIST_VERSION, migrateToCurrent } from "./persistMigrations";
export interface AppState {
  onboardingComplete: boolean;
  dashboardTourComplete: boolean;
  wizardComplete: boolean;
}
export interface AppActions {
  completeOnboarding: () => void;
  completeDashboardTour: () => void;
  completeWizard: () => void;
  resetAll: () => void;
}
export const useAppStore = create<AppState & AppActions>()(
  persist<AppState & AppActions, [], [], AppState>(
    (set) => ({
      onboardingComplete: false,
      dashboardTourComplete: false,
      wizardComplete: false,
      completeOnboarding: () => set({ onboardingComplete: true }),
      completeDashboardTour: () => set({ dashboardTourComplete: true }),
      completeWizard: () => set({ wizardComplete: true }),
      resetAll: () =>
        set({ onboardingComplete: false, dashboardTourComplete: false, wizardComplete: false }),
    }),
    {
      name: "qadaa-app-store",
      storage: createJSONStorage(() => asyncStorageAdapter),
      version: PERSIST_VERSION,
      migrate: migrateToCurrent as (persistedState: unknown, version: number) => AppState,
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        dashboardTourComplete: state.dashboardTourComplete,
        wizardComplete: state.wizardComplete,
      }),
    }
  )
);
