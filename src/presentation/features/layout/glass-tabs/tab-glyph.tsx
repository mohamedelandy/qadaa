/** @format */
/**
 * Icon slot for a glass tab: custom render prop or SF Symbol, sized to the bar's icon box.
 */
import { SymbolView } from "expo-symbols";
import { View } from "react-native";
import { ICON_SIZE } from "./glass-tab-bar.viewmodel";
import type { GlassTabItem } from "./glass-tab-item";

export function TabGlyph({ item, tint }: { item: GlassTabItem; tint: string }) {
  if (item.renderIcon) {
    return (
      <View style={{ height: ICON_SIZE, justifyContent: "center" }}>
        {item.renderIcon({ tint, size: ICON_SIZE })}
      </View>
    );
  }
  if (item.icon) {
    return <SymbolView name={item.icon} tintColor={tint} size={ICON_SIZE} weight="semibold" />;
  }
  return null;
}
