// SPDX-License-Identifier: AGPL-3.0-or-later
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
  AK: { code: "AK", name: "Alaska", emoji: "🐻" },
  AL: { code: "AL", name: "Alabama", emoji: "🏈" },
  AR: { code: "AR", name: "Arkansas", emoji: "💎" },
  AZ: { code: "AZ", name: "Arizona", emoji: "🌵" },
  CA: { code: "CA", name: "California", emoji: "🌴" },
  CO: { code: "CO", name: "Colorado", emoji: "⛰️" },
  CT: { code: "CT", name: "Connecticut", emoji: "🏛️" },
  DE: { code: "DE", name: "Delaware", emoji: "🦀" },
  FL: { code: "FL", name: "Florida", emoji: "🌞" },
  GA: { code: "GA", name: "Georgia", emoji: "🍑" },
  HI: { code: "HI", name: "Hawaii", emoji: "🌺" },
  IA: { code: "IA", name: "Iowa", emoji: "🌽" },
  ID: { code: "ID", name: "Idaho", emoji: "🥔" },
  IL: { code: "IL", name: "Illinois", emoji: "🏙️" },
  IN: { code: "IN", name: "Indiana", emoji: "🏎️" },
  KS: { code: "KS", name: "Kansas", emoji: "🌻" },
  KY: { code: "KY", name: "Kentucky", emoji: "🐴" },
  LA: { code: "LA", name: "Louisiana", emoji: "⚜️" },
  MA: { code: "MA", name: "Massachusetts", emoji: "🎓" },
  MD: { code: "MD", name: "Maryland", emoji: "🦀" },
  ME: { code: "ME", name: "Maine", emoji: "🦞" },
  MI: { code: "MI", name: "Michigan", emoji: "🏗️" },
  MN: { code: "MN", name: "Minnesota", emoji: "❄️" },
  MO: { code: "MO", name: "Missouri", emoji: "🏛️" },
  MS: { code: "MS", name: "Mississippi", emoji: "🎸" },
  MT: { code: "MT", name: "Montana", emoji: "🦌" },
  NC: { code: "NC", name: "North Carolina", emoji: "🏔️" },
  ND: { code: "ND", name: "North Dakota", emoji: "🦬" },
  NE: { code: "NE", name: "Nebraska", emoji: "🌾" },
  NH: { code: "NH", name: "New Hampshire", emoji: "🏔️" },
  NJ: { code: "NJ", name: "New Jersey", emoji: "🏖️" },
  NM: { code: "NM", name: "New Mexico", emoji: "🌶️" },
  NV: { code: "NV", name: "Nevada", emoji: "🎰" },
  NY: { code: "NY", name: "New York", emoji: "🗽" },
  OH: { code: "OH", name: "Ohio", emoji: "🏈" },
  OK: { code: "OK", name: "Oklahoma", emoji: "🌪️" },
  OR: { code: "OR", name: "Oregon", emoji: "🌲" },
  PA: { code: "PA", name: "Pennsylvania", emoji: "🔔" },
  RI: { code: "RI", name: "Rhode Island", emoji: "⛵" },
  SC: { code: "SC", name: "South Carolina", emoji: "🌴" },
  SD: { code: "SD", name: "South Dakota", emoji: "🏔️" },
  TN: { code: "TN", name: "Tennessee", emoji: "🎸" },
  TX: { code: "TX", name: "Texas", emoji: "🤠" },
  UT: { code: "UT", name: "Utah", emoji: "🏜️" },
  VA: { code: "VA", name: "Virginia", emoji: "🏛️" },
  VT: { code: "VT", name: "Vermont", emoji: "🍁" },
  WA: { code: "WA", name: "Washington", emoji: "🌲" },
  WI: { code: "WI", name: "Wisconsin", emoji: "🧀" },
  WV: { code: "WV", name: "West Virginia", emoji: "⛏️" },
  WY: { code: "WY", name: "Wyoming", emoji: "🤠" },
};

/** All states, sorted by name — for dropdowns. */
export const STATE_LIST: StateSummary[] = Object.values(STATE_INDEX).sort(
  (a, b) => a.name.localeCompare(b.name),
);
