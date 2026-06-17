// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { getStateVerification, STATE_REGISTRY } from "@/content/state-registry";

describe("getStateVerification", () => {
  it("reports a verified state with its last-verified date and source", () => {
    const wa = getStateVerification("WA");
    expect(wa.verified).toBe(true);
    expect(wa.lastVerified).toBe("2026-06-17");
    expect(wa.stateName).toBe("Washington");
    expect(wa.sourceUrl).toBeTruthy();
  });

  it("reports a machine-generated state as unverified with no fake date", () => {
    const al = getStateVerification("AL");
    expect(al.verified).toBe(false);
    expect(al.lastVerified).toBeUndefined();
    expect(al.stateName).toBe("Alabama");
  });

  it("returns a well-formed view for an unknown code", () => {
    const x = getStateVerification("ZZ");
    expect(x.verified).toBe(false);
    expect(x.stateName).toBe("ZZ");
  });

  it("returns a well-formed view for every registered state", () => {
    for (const code of Object.keys(STATE_REGISTRY)) {
      const v = getStateVerification(code);
      expect(typeof v.stateName).toBe("string");
      expect(v.stateName.length).toBeGreaterThan(0);
      expect(typeof v.verified).toBe("boolean");
      // A "verified" claim must be backed by an actual date — never asserted blank.
      if (v.verified) expect(v.lastVerified).toBeTruthy();
    }
  });
});
