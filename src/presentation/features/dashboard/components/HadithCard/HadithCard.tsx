/** @format */
/**
 * Presentational dashboard card rendering a hadith text with decorative separator glyph.
 */
import { View } from "react-native";
import { useHadithCardViewModel } from "./HadithCard.viewmodel";
import { Text } from "@components/Text/Text";
interface HadithCardProps {
  text: string;
  testID?: string;
}
export function HadithCard({ text, testID }: HadithCardProps) {
  const { styles } = useHadithCardViewModel();
  return (
    <View testID={testID} style={styles.container}>
      <Text style={styles.separator}>✦</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
