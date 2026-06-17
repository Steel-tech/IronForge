// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { MODELS } from "@/lib/ai/models";

describe("MODELS", () => {
  it("defines a non-empty model ID for every tier", () => {
    for (const id of Object.values(MODELS)) {
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    }
  });

  // Guard against regressing to the model that retired 2026-06-15 and 404s.
  it("never references the retired sonnet-4 snapshot", () => {
    for (const id of Object.values(MODELS)) {
      expect(id).not.toBe("claude-sonnet-4-20250514");
    }
  });
});
