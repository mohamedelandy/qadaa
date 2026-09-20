/** @format */

import { Platform, KeyboardAvoidingViewProps } from "react-native";
import { KeyboardAvoidingView as BaseKeyboardAvoidingView } from "react-native-keyboard-controller";

export function KeyboardAvoidingView(props: KeyboardAvoidingViewProps) {
  return (
    <BaseKeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} {...props} />
  );
}
