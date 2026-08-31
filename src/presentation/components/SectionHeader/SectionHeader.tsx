/** @format */
/**
 * Small uppercase faint text label used as a section heading marker.
 */
import { Text } from "@components/Text/Text";
import { useUI } from "@hooks/useUI";
interface SectionHeaderProps {
  label: string;
  style?: Record<string, unknown>;
}
export function SectionHeader({ label, style }: SectionHeaderProps) {
  const { colors } = useUI();
  return (
    <Text
      variant="xs"
      weight="medium"
      accessibilityRole="header"
      style={[
        {
          textTransform: "uppercase",
          letterSpacing: 0.64,
          color: colors.textMuted,
        },
        style,
      ]}
    >
      {label}
    </Text>
  );
}
