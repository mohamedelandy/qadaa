# Contributing to Qadaa Fawaet (قضاء الفوائت)

Thank you for your interest in contributing to **Qadaa Fawaet**! This project is built to provide an accurate, private, and high-performance prayer-recovery tracker for Muslims worldwide.

## Code of Conduct

Please review and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all community interactions.

## Prerequisites

- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`
- **Expo CLI**: bundled via local `devDependencies`

## Development Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd qadaa-fawaet/mobile
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm start
   \`\`\`

## Architecture & Principles

We enforce strict domain-driven layering:

- **\`src/domain/\`**: Pure TypeScript business logic and invariants. No React, no stores, no presentation imports allowed.
- **\`src/stores/\`**: Zustand state slices. Actions must be excluded from serialization via \`partialize\`.
- **\`src/presentation/\`**: Screen layouts, ViewModels, hooks, and UI components.
- **RTL Support**: Arabic is the first-class layout direction. All UI components must support bidirectional rendering (\`isRTL\`).

## Verification & Pre-PR Checklist

Before submitting a Pull Request, run the full verification suite:

\`\`\`bash
npm run verify:all
\`\`\`

This runs:

- \`npm run test:architecture\` — Validates dependency direction & boundary constraints.
- \`npm run test:translations\` — Checks i18n translation key parity across languages.
- \`npm run format:check\` — Verifies code formatting with Prettier.
- \`npm run lint\` — Runs ESLint across all TypeScript sources.
- \`npm run build\` — Validates strict TypeScript compilation (\`tsc --noEmit\`).
- \`npm run test:ci\` — Executes the Jest test suite with coverage thresholds.

## Pull Request Guidelines

1. Branch naming: \`feature/short-description\` or \`fix/short-description\`.
2. Ensure commit messages are clear and descriptive.
3. Add unit tests for any new domain calculations or ViewModel state transitions.
