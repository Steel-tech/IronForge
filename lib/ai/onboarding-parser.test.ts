// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { parseState } from "@/lib/ai/onboarding-parser";

describe("parseState", () => {
  it("resolves a full state name", () => {
    expect(parseState("Texas")).toMatchObject({ ok: true, value: "TX" });
  });

  it("resolves a two-letter code", () => {
    expect(parseState("wa")).toMatchObject({ ok: true, value: "WA" });
  });

  it("resolves a common slang variant in a sentence", () => {
    expect(parseState("I'm in cali")).toMatchObject({ ok: true, value: "CA" });
  });

  it("rejects DC — not one of the 50 supported states", () => {
    expect(parseState("d.c.").ok).toBe(false);
  });

  it("rejects gibberish", () => {
    expect(parseState("asdfqwer").ok).toBe(false);
  });
});
