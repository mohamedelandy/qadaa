/** @format */
/**
 * Card showing qadaa completion estimate (years left, finish date, daily pace) or no-data message.
 */
import { View } from "react-native";
import { useEstimateCardViewModel } from "./EstimateCard.viewmodel";
import type { EstimateInfo } from "@features/stats/hooks/useStatsViewModel";
import { Text } from "@components/Text/Text";
interface EstimateCardProps {
  estimate: EstimateInfo;
  testID?: string;
}
export function EstimateCard({ estimate, testID }: EstimateCardProps) {
  const { t, colors, styles, estimate: est } = useEstimateCardViewModel(estimate);
  return (
    <View testID={testID} style={styles.card}>
      <Text variant="xs" weight="medium" style={[styles.header, { color: colors.textMuted }]}>
        {t("stats.estimateTitle")}
      </Text>
      {!est.show ? (
        <Text variant="xs" weight="medium" style={[styles.noData, { color: colors.textDim }]}>
          {t("stats.estimateNoData")}
        </Text>
      ) : (
        <>
          <Text
            testID="stats-estimate-years"
            variant="xs"
            weight="medium"
            style={[styles.line1, { color: colors.textSub }]}
          >
            {t("stats.estimateYears", { years: est.years })}
          </Text>
          <Text
            testID="stats-estimate-date"
            variant="xs"
            weight="medium"
            style={[styles.line2, { color: colors.textDim }]}
          >
            {t("stats.estimateDate", { date: est.date })}
          </Text>
          <Text
            testID="stats-estimate-pace"
            variant="xs"
            weight="medium"
            style={[styles.line3, { color: colors.textDim }]}
          >
            {t("stats.estimatePace", { count: est.pace })}
          </Text>
        </>
      )}
    </View>
  );
}
