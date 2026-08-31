/** @format */
/**
 * Metro bundler config with SVG transformer
 */
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
// Deterministic cache location: system tmp is not cacheable in CI and gets
// wiped between builds locally; under node_modules it survives and can be
// restored by actions/cache on the macOS runner.
config.cacheDirectory = "./node_modules/.cache/metro";

module.exports = config;
