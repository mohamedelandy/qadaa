/** @format */
/**
 * Expo config plugin for the iOS home-screen Qadaa widget target.
 */

/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",
  name: "QadaaWidget",
  bundleIdentifier: ".qadaawidget",
  deploymentTarget: "17.0",
  frameworks: ["SwiftUI", "WidgetKit"],
  entitlements: {
    "com.apple.security.application-groups": ["group.com.melnady.qadaa"],
  },
};
