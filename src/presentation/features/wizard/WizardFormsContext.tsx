/** @format */
/**
 * Provides react-hook-form control objects to step components without
 * storing non-serializable framework internals in global state.
 */
import { createContext, useContext, type ReactNode } from "react";
import type { Control } from "react-hook-form";

interface WizardFormsContextValue {
  control?: Control<{ age: string; pubertyAge: string }>;
  step2Control?: Control<{ quickYears: string }>;
}

const WizardFormsContext = createContext<WizardFormsContextValue>({});

export function WizardFormsProvider({
  control,
  step2Control,
  children,
}: WizardFormsContextValue & { children: ReactNode }) {
  return (
    <WizardFormsContext.Provider value={{ control, step2Control }}>
      {children}
    </WizardFormsContext.Provider>
  );
}

export function useWizardForms(): WizardFormsContextValue {
  return useContext(WizardFormsContext);
}
