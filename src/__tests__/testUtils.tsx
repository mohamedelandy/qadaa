/** @format */
/**
 * Shared RNTL helpers: provider-wrapped render and store reset.
 */
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react-native";
import { ThemeProvider } from "@theme/ThemeProvider";
import { useAppStore } from "@stores/useAppStore";

interface ProviderOptions {
  direction?: "ltr" | "rtl";
}

export async function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions & RenderOptions = {}
) {
  const { direction = "rtl", wrapper, ...rest } = options;
  return render(ui, {
    ...rest,
    wrapper:
      wrapper ??
      (({ children }: { children?: ReactNode }) => (
        <ThemeProvider direction={direction}>{children}</ThemeProvider>
      )),
  });
}

export function resetAppStore() {
  useAppStore.setState(useAppStore.getInitialState());
}
