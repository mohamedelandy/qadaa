/** @format */
/**
 * Derives disabled, dimmed-opacity, and spinner flags from the button's disabled/loading props.
 */
export interface ButtonInteraction {
  isDisabled: boolean;
  opacity: number;
  showSpinner: boolean;
}
export function resolveButtonInteraction(
  disabled: boolean | undefined,
  loading: boolean | undefined
): ButtonInteraction {
  const isDisabled = disabled === true || loading === true;
  return {
    isDisabled,
    opacity: isDisabled ? 0.4 : 1,
    showSpinner: loading === true,
  };
}
