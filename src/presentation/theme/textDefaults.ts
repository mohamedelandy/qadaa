/** @format */
/**
 * Installs the global Tajawal default font on raw React Native primitives.
 *
 * Themed `Text` covers in-app UI, but RN primitives rendered outside it
 * (alerts, native pickers) inherit no font. React 19 removed function-level
 * `defaultProps` from component types while RN core components still honor
 * them at runtime; we therefore view the opaque component reference through
 * the runtime shape it actually exposes (unknown + structural narrowing) —
 * the single sanctioned seam in the codebase, do not replicate elsewhere.
 */
import { Text, TextInput } from "react-native";

type WithDefaultProps = {
  defaultProps?: Record<string, unknown>;
};

const DEFAULT_FONT = "Tajawal-Regular";

function applyDefaultStyle(component: unknown): void {
  const mutable = component as WithDefaultProps;
  mutable.defaultProps = {
    ...mutable.defaultProps,
    style: { fontFamily: DEFAULT_FONT },
  };
}

export function installDefaultTextFonts(): void {
  applyDefaultStyle(Text);
  applyDefaultStyle(TextInput);
}
