/** @format */
/**
 * Shared helpers to render, seed, and reset wizard state in tests.
 */
import { type ReactNode } from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import {
  useWizardStore,
  initialWizardState,
  deriveWizard,
  type WizardState,
} from "@stores/useWizardStore";
export function resetWizard() {
  useWizardStore.getState().resetAll();
}
export function seedWizard(raw: Partial<WizardState> = {}) {
  const next = { ...initialWizardState, ...raw };
  useWizardStore.setState({ ...next, ...deriveWizard(next) });
}
export function renderWizard(ui: ReactNode, direction?: "ltr" | "rtl") {
  return render(<ThemeProvider direction={direction}>{ui}</ThemeProvider>);
}
export function setWizardAge(age: string, pubertyAge: string) {
  const s = useWizardStore.getState();
  s.setAge(age);
  s.setPubertyAge(pubertyAge);
}
