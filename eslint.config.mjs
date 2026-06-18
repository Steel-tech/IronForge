// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import next from "eslint-config-next/core-web-vitals";

// eslint-config-next 16 ships a native ESLint 9 flat config, so we spread it
// directly (no FlatCompat). Type safety is covered by the `tsc --noEmit`
// typecheck gate, so the typescript-eslint ruleset is intentionally omitted.
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...next,
  {
    // Pre-existing violations surfaced when the Next lint config was first
    // enabled (U2 — this codebase was previously unlinted). Downgraded to
    // warnings so the new CI gate is green from day one; burn them down in the
    // depth/polish pass (plan U11/U12), then restore these to "error".
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react/jsx-no-comment-textnodes": "warn",
    },
  },
];

export default eslintConfig;
