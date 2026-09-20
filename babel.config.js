/** @format */
/**
 * Babel config with module-resolver aliases and reanimated plugin
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@presentation": "./src/presentation",
            "@domain": "./src/domain",
            "@data": "./src/data",
            "@lottie-assets": "./assets",
            "@stores": "./src/stores",
            "@theme": "./src/presentation/theme",
            "@components": "./src/presentation/components",
            "@features": "./src/presentation/features",
            "@mocks": "./src/__mocks__",
            "@hooks": "./src/presentation/hooks",
            "@shared": "./src/types",
            "@services": "./src/services",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: [["transform-remove-console", { exclude: ["error", "warn"] }]],
      },
    },
  };
};
