/** @format */
/**
 * Jest test configuration with path aliases.
 *
 * Current verification baseline (updated 2026-08-30):
 *   143 suites / 865 tests pass; architecture + translations + lint green.
 *   UI tests follow RNTL v14 idioms: renderWithProviders, screen queries,
 *   getByRole/getByText, toBeOnTheScreen matchers, userEvent (fireEvent
 *   only for unsupported events), no act() around render/fireEvent.
 *   Store suite is the parity contract — domain extraction (Phase 3) is
 *   behavior-preserving iff these same tests pass unchanged against the
 *   slimmed stores; never edit these tests to fit an extraction.
 *
 * Coverage policy:
 *  - Thresholds: branches 85, functions 95, lines 95, statements 95.
 *  - `istanbul ignore next` directives are ONLY permitted on documented
 *    __DEV__ branches: the Debug FABs (DebugThemeFAB, DebugLanguageFAB).
 *    Do NOT add istanbul-ignore anywhere else.
 */
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!" +
      "(jest-)?react-native" +
      "|@react-native(-community)?" +
      "|expo(nent)?" +
      "|@expo(nent)?/.*" +
      "|@expo-google-fonts/.*" +
      "|@unimodules/.*" +
      "|unimodules" +
      "|react-native-svg" +
      "|react-native-reanimated" +
      "|react-native-gesture-handler" +
      "|zustand" +
      "|i18next" +
      "|lottie-react-native" +
      "|@react-native-async-storage" +
      ")",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.test.{ts,tsx}",
    "!**/index.ts",
    "!**/__mocks__/**",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@mocks/(.*)$": "<rootDir>/src/__mocks__/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "^@stores/(.*)$": "<rootDir>/src/stores/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@theme$": "<rootDir>/src/presentation/theme",
    "^@theme/(.*)$": "<rootDir>/src/presentation/theme/$1",
    "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
    "^@components/(.*)$": "<rootDir>/src/presentation/components/$1",
    "^@features/(.*)$": "<rootDir>/src/presentation/features/$1",
    "^@hooks/(.*)$": "<rootDir>/src/presentation/hooks/$1",
    "^@shared/(.*)$": "<rootDir>/src/types/$1",
    "^@lottie-assets/(.*)$": "<rootDir>/assets/$1",
    "^expo/src/winter$": "<rootDir>/src/__mocks__/expo-winter.ts",
    "^expo/src/winter/runtime\\.native$": "<rootDir>/src/__mocks__/expo-winter.ts",
  },
};
