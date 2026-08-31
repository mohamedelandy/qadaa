/** @format */
/**
 * Full-screen safe-area page wrapper composing ContentContainer for standard screens.
 */
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { View } from "../View/View";
interface PageLayoutProps {
  children: ReactNode;
  testID?: string;
}
export function PageLayout({ children, testID }: PageLayoutProps) {
  return (
    <View testID={testID} style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ContentContainer>{children}</ContentContainer>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
