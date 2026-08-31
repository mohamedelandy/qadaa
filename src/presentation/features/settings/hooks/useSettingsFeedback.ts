/** @format */
/**
 * Opens the feedback form; openURL rejection is non-actionable.
 */
import { useCallback } from "react";
import { Linking } from "react-native";

const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf0NYAuWgC3RpcaCfTZi1Cgn0T1v3pd6ApjI660N19wPNry7w/viewform";

export function useSettingsFeedback() {
  const handleFeedback = useCallback(() => {
    void Linking.openURL(FEEDBACK_URL).catch(() => {});
  }, []);
  return { handleFeedback };
}
