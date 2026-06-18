// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { STATE_REGISTRY } from "@/content/state-registry";
import { STATE_INDEX, STATE_LIST } from "@/content/state-index";

// state-index.ts is GENERATED from the registry (scripts/gen-state-index.ts).
// These tests fail if it drifts — e.g. a state added to the registry without
// regenerating the index — so the lightweight client copy can't go stale.
describe("state-index sync with state-registry", () => {
  it("covers exactly the same state codes", () => {
    expect(Object.keys(STATE_INDEX).sort()).toEqual(
      Object.keys(STATE_REGISTRY).sort(),
    );
  });

  it("matches code/name/emoji for every state", () => {
    for (const [code, data] of Object.entries(STATE_REGISTRY)) {
      expect(STATE_INDEX[code]).toEqual({
        code: data.code,
        name: data.name,
        emoji: data.emoji,
      });
    }
  });

  it("STATE_LIST holds every state, sorted by name", () => {
    expect(STATE_LIST).toHaveLength(Object.keys(STATE_REGISTRY).length);
    const names = STATE_LIST.map((s) => s.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
