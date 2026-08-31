/** @format */
/**
 * Tab layout with 3 tabs (dashboard, stats, settings) + wizard guard
 * Renders modals at this level so they persist across tab switches.
 *
 * TabList primary triggers declare the routes; the visual bar references
 * them by `name` only (secondary triggers). expo-router `<Tabs>` scans ONLY
 * immediate `TabList` children for triggers, so the TabList must not be
 * wrapped in any View — see Expo custom-tabs docs.
 *
 * All bar orchestration (RTL item order, theme mapping, hide-on-sheet spring,
 * Ionicons glyphs) lives in `useGlassTabBarViewModel` — this file only mounts.
 */
import { Fragment } from "react";
import { Redirect, useRouter } from "expo-router";
import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import Animated from "react-native-reanimated";
import { GlassTabBar, GlassTabButton } from "@features/layout/glass-tabs/glass-tab-bar";
import {
  useGlassTabBarViewModel,
  tabLayoutStyles,
} from "@presentation/features/layout/hooks/useGlassTabBarViewModel";
import { themedFadingTabScreen } from "@presentation/features/layout/ThemedFadingTabScreen";
import { SyncSection } from "@features/settings/components/SyncSection/SyncSection";

export default function TabLayout() {
  const {
    glassItems,
    tabTheme,
    isDark,
    barStyle,
    hideDistance,
    activeOpen,
    direction,
    wizardComplete,
    syncVisible,
    setSyncVisible,
  } = useGlassTabBarViewModel();
  const router = useRouter();

  if (!wizardComplete) return <Redirect href="/wizard" />;

  return (
    <Fragment>
      <Tabs style={{ flex: 1, direction: "ltr" }}>
        <TabSlot
          style={[tabLayoutStyles.tabSlot, { direction }]}
          renderFn={themedFadingTabScreen}
        />
        <TabList style={tabLayoutStyles.primaryTabList}>
          {glassItems.map((item) => (
            <TabTrigger key={item.name} name={item.name} href={item.href} />
          ))}
        </TabList>
        <Animated.View
          style={[tabLayoutStyles.hideRegion, { height: hideDistance }, barStyle]}
          pointerEvents={activeOpen ? "none" : "box-none"}
        >
          <TabList asChild>
            <GlassTabBar
              onIndexSelected={(index) => router.navigate(glassItems[index]?.href ?? "/dashboard")}
              theme={tabTheme}
              mode={isDark ? "dark" : "light"}
              haptics
            >
              {glassItems.map((item, index) => (
                <TabTrigger key={item.name} name={item.name} asChild>
                  <GlassTabButton testID={`tab-${item.name}`} item={item} index={index} />
                </TabTrigger>
              ))}
            </GlassTabBar>
          </TabList>
        </Animated.View>
      </Tabs>

      <SyncSection visible={!!syncVisible} onClose={() => setSyncVisible(false)} />
    </Fragment>
  );
}
