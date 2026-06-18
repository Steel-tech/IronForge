// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
//
// Generates content/state-index.ts — a standalone lightweight {code, name,
// emoji} index — from the full STATE_REGISTRY. Run: npx tsx scripts/gen-state-index.ts
import { writeFileSync } from "node:fs";
import { STATE_REGISTRY } from "../content/state-registry";

const entries = Object.values(STATE_REGISTRY)
  .sort((a, b) => a.code.localeCompare(b.code))
  .map(
    (s) =>
      `  ${s.code}: { code: ${JSON.stringify(s.code)}, name: ${JSON.stringify(
        s.name,
      )}, emoji: ${JSON.stringify(s.emoji)} },`,
  )
  .join("\n");

const out = `// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
//
// GENERATED from content/state-registry.ts — do not edit by hand.
// A lightweight {code, name, emoji} index for dropdowns and name/emoji display.
// Components that don't need full StateData import this instead of the registry,
// keeping the ~26KB registry data out of their client bundles.
// Regenerate: npx tsx scripts/gen-state-index.ts
// content/state-index.test.ts asserts this stays in sync with the registry.

export interface StateSummary {
  code: string;
  name: string;
  emoji: string;
}

export const STATE_INDEX: Record<string, StateSummary> = {
${entries}
};

/** All states, sorted by name — for dropdowns. */
export const STATE_LIST: StateSummary[] = Object.values(STATE_INDEX).sort(
  (a, b) => a.name.localeCompare(b.name),
);
`;

writeFileSync(new URL("../content/state-index.ts", import.meta.url), out);
console.log(
  `Wrote content/state-index.ts with ${Object.keys(STATE_REGISTRY).length} states`,
);
