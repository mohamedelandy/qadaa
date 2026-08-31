/** @format */
/**
 * withQadaaWidget — Expo config plugin.
 * Adds the App Group entitlement to the main iOS target so the app can write
 * widget data that the iOS widget extension reads.
 */

import { withEntitlementsPlist, type ConfigPlugin } from "expo/config-plugins";

const APP_GROUP = "group.com.melnady.qadaa";
const APP_GROUPS_KEY = "com.apple.security.application-groups";

export const withQadaaWidget: ConfigPlugin = (config) =>
  withEntitlementsPlist(config, (modConfig) => {
    const groups = modConfig.modResults[APP_GROUPS_KEY] as string[] | undefined;
    if (groups?.includes(APP_GROUP)) {
      return modConfig;
    }
    modConfig.modResults[APP_GROUPS_KEY] = [...(groups ?? []), APP_GROUP];
    return modConfig;
  });

export default withQadaaWidget;
