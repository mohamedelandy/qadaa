# قضاء (Qadaa)

> **Turn an overwhelming prayer backlog into one meaningful step at a time.**

Qadaa is an Arabic-first, offline-first React Native app that helps Muslims organize and make up missed prayers through a calm, measurable daily routine.

It answers a difficult question — **“Where do I begin?”** — with a guided estimate, a sustainable recovery pace, clear daily actions, and encouraging progress feedback.

**No account. No backend. No cloud profile.** Progress remains on the device unless the user explicitly exports or shares a backup.

[![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-865%20passing-success)](#quality-and-verification)

## Why Qadaa exists

Missed prayers can accumulate into a backlog that feels too large to understand or start. Qadaa turns that backlog into a private recovery journey:

- Estimate missed prayer days from age, puberty age, and missed periods.
- Choose a daily target that fits the user’s life.
- Log one prayer, several prayers, or a complete day.
- Track recovery per prayer and across the full journey.
- Build consistency with streaks and a monthly grace-day rule.
- See momentum through progress rings, a consistency grid, points, ranks, and badges.

> **Product principle:** motivate progress without turning worship into pressure.

## The user journey

1. **Onboarding** — understand the purpose in four focused slides.
2. **Setup wizard** — enter age and puberty age, estimate missed periods, and select a daily pace.
3. **Dashboard** — see today’s target and log progress with one tap.
4. **Motivation loop** — streaks, points, badges, progress, hadith, dua, and the weekly grid make consistency visible.
5. **Stats** — review recovery estimates, level, rank, streak, and achievements.
6. **Settings** — switch Arabic/English, change theme and target, manage reminders, and control backups/sync.

## Product highlights

| Area         | Experience                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Onboarding   | Four slides explaining the problem, logging, consistency, and achievements.                                                        |
| Setup wizard | Validated four-step setup with quick or advanced missed-period configuration.                                                      |
| Dashboard    | Five prayer rows, individual logging, batch logging, full-day logging, undo, streak, hadith, dua, and a 28-day consistency grid.   |
| Stats        | Level, points, rank, badges, recovery percentage, completion pace, and estimated finish date.                                      |
| Settings     | Arabic/English, RTL/LTR direction, dark/light theme, daily target, notifications, feedback, reset, QR, clipboard, and file backup. |
| Widgets      | iOS WidgetKit and Android widget bridge with graceful no-op behavior when native widgets are unavailable.                          |

## Privacy and security

Qadaa is designed to work offline and does not require an account or server.

- User progress is persisted locally with Zustand and AsyncStorage.
- Backup data is explicitly user-controlled and may contain sensitive personal progress information.
- Imported backups are schema- and version-validated before state changes.
- Backup input and export payloads are capped at **250 KB**.
- Clipboard and file sharing are opt-in user actions; users should share backups only through trusted channels.
- No credentials, API keys, signing artifacts, or environment files belong in this repository.
- AsyncStorage is not a secure vault. Do not store authentication credentials or secrets in app state.

## Tech stack

- Expo SDK `~57.0.16`
- React Native `0.86.2`
- React `19.2.3`
- TypeScript `~6.0.3` with strict compiler settings
- Expo Router `~57.0.16`
- Zustand `^5.0.14` with AsyncStorage persistence
- i18next and react-i18next
- React Hook Form and Zod
- Reanimated, Worklets, Gesture Handler, SVG, Lottie
- Expo Notifications, File System, Document Picker, Sharing, Clipboard, and Haptics
- Local Expo widget bridge plus iOS/Android widget implementations
- Jest, React Native Testing Library, ESLint, and Prettier

## Quick start

### Requirements

- Node.js `>=20`
- npm `>=10`
- Xcode and an iOS simulator, or Android Studio and an Android emulator

### Install and run

```bash
npm install --legacy-peer-deps
npm start
```

Press `i` for iOS or `a` for Android. Native widgets and other native capabilities require a development build rather than Expo Go.

## Useful commands

| Command                | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm start`            | Start the Expo development server.                                     |
| `npm run ios`          | Build and run the iOS app.                                             |
| `npm run android`      | Build and run the Android app.                                         |
| `npm run build`        | Run the strict TypeScript check without emitting files.                |
| `npm run lint`         | Run ESLint.                                                            |
| `npm run format:check` | Check Prettier formatting.                                             |
| `npm test`             | Run the Jest suite serially.                                           |
| `npm run test:ci`      | Run Jest with coverage thresholds.                                     |
| `npm run verify:all`   | Run architecture, translation, formatting, lint, build, and CI checks. |

## Architecture

```text
app/                         Expo Router entry points and navigation guards
src/domain/                  Pure business rules and typed models
src/data/                    i18n, AsyncStorage, backup, notifications
src/stores/                  Zustand state, persistence, and migrations
src/presentation/            Themes, hooks, view models, components, features
src/services/                Dependency-injected platform orchestration
modules/widget-bridge/       Local Expo native module
 targets/qadaa-widget/       iOS WidgetKit extension
plugins/                     Expo config plugins
```

The UI follows a practical MVVM boundary:

```text
Store/model → ViewModel hook → presentational component
```

Architecture rules are enforced by ESLint and shell checks:

- Domain logic does not import React Native, stores, data, presentation, or services.
- Data adapters do not depend on stores or presentation.
- Stores do not depend on presentation.
- Presentation does not directly import data or services.
- Route-level platform wiring goes through `src/appBootstrap.ts`.
- Persisted stores use `partialize` so actions are not serialized.
- Local product dates use local `YYYY-MM-DD` helpers rather than UTC conversion.
- Stable testIDs are used for automated test coverage.

## Quality and verification

Current local verification baseline:

- **143 Jest suites / 865 tests passing**
- **99.39% statements**
- **94.24% branches**
- **98.28% functions**
- **99.66% lines**
- TypeScript build passing
- ESLint passing
- Architecture checks passing
- Translation parity passing

Run the complete gate before a release:

```bash
npm run verify:all
```

## Dependency audit status

The current Expo 57 dependency tree reports transitive audit findings through `npm audit --omit=dev`. They are concentrated in Expo/Metro/prebuild/widget build tooling and are not directly used by the app’s business logic.

Do not use `npm audit fix --force` without a planned Expo/RN compatibility migration. Review and explicitly accept or remediate audit findings before a public production release.

## Documentation

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture verification](scripts/verify-architecture.sh)
- [Translation verification](scripts/verify-translations.sh)

## License

Private — all rights reserved.
