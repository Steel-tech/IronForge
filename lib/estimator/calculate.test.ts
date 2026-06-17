// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { calculateEstimate } from "@/lib/estimator/calculate";
import {
  ESTIMATE_CONSTANTS as C,
  MONOPOLISTIC_WC_STATES,
} from "@/lib/estimator/constants";
import { DEFAULT_ESTIMATE_INPUT, type EstimateInput } from "@/lib/types/estimator";
import { STATE_REGISTRY } from "@/content/state-registry";

function inputFor(overrides: Partial<EstimateInput>): EstimateInput {
  return { ...DEFAULT_ESTIMATE_INPUT, ...overrides };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

describe("calculateEstimate", () => {
  describe("happy path", () => {
    const input = inputFor({
      state: "TX",
      projectType: "Commercial",
      tonnage: 50,
      beamCount: 100,
      deckingSqft: 0,
      isUnion: true,
      baseWageRate: 42,
      foremanPremium: 15,
      crewSize: 4,
      durationWeeks: 4,
      craneRate: 1500,
      needsWelding: false,
      needsLift: false,
    });
    const r = calculateEstimate(input);

    it("prices bolts/connections at the per-ton constant", () => {
      expect(r.materials.boltsConnections).toBe(50 * C.BOLTS_PER_TON);
    });

    it("omits welding consumables when welding is not needed", () => {
      expect(r.materials.weldingConsumables).toBe(0);
    });

    it("derives cost-per-ton from the total bid", () => {
      expect(r.summary.costPerTon).toBe(round2(r.summary.totalBid / 50));
    });

    // Golden regression guard. If a constant or formula changes, this is the
    // one assertion that must be updated deliberately.
    it("matches the pinned golden total bid", () => {
      expect(r.summary.totalBid).toBe(104210.68);
    });
  });

  describe("compounding order", () => {
    const r = calculateEstimate(
      inputFor({ state: "TX", tonnage: 30, beamCount: 60 }),
    );

    it("applies profit as PROFIT_PCT of the subtotal", () => {
      expect(r.summary.profit).toBe(round2(r.summary.subtotal * C.PROFIT_PCT));
    });

    it("applies contingency as CONTINGENCY_PCT of the subtotal", () => {
      expect(r.summary.contingency).toBe(
        round2(r.summary.subtotal * C.CONTINGENCY_PCT),
      );
    });

    it("totals subtotal + profit + contingency", () => {
      expect(r.summary.totalBid).toBeCloseTo(
        r.summary.subtotal + r.summary.profit + r.summary.contingency,
        2,
      );
    });
  });

  describe("edge cases", () => {
    it("returns 0 cost-per-ton at zero tonnage (no divide-by-zero)", () => {
      const r = calculateEstimate(
        inputFor({ state: "TX", tonnage: 0, deckingSqft: 0 }),
      );
      expect(r.summary.costPerTon).toBe(0);
      expect(Number.isFinite(r.summary.totalBid)).toBe(true);
      expect(r.summary.totalBid).toBeGreaterThanOrEqual(0);
    });

    it("charges a higher labor burden + insurance in monopolistic-WC states", () => {
      const monoState = "WA";
      const monoPW = !!STATE_REGISTRY[monoState]?.hasStatePrevailingWage;
      // Hold the prevailing-wage flag constant so only the WC effect differs.
      const peer = Object.keys(STATE_REGISTRY).find(
        (s) =>
          !MONOPOLISTIC_WC_STATES.has(s) &&
          !!STATE_REGISTRY[s]?.hasStatePrevailingWage === monoPW,
      );
      expect(peer).toBeDefined();
      const base: Partial<EstimateInput> = {
        tonnage: 40,
        beamCount: 80,
        isUnion: true,
      };
      const mono = calculateEstimate(inputFor({ ...base, state: monoState }));
      const nonMono = calculateEstimate(inputFor({ ...base, state: peer! }));
      expect(mono.labor.burdenRate).toBeGreaterThan(nonMono.labor.burdenRate);
      expect(mono.overhead.insurance).toBeGreaterThan(nonMono.overhead.insurance);
    });

    it("raises labor in prevailing-wage states", () => {
      const states = Object.keys(STATE_REGISTRY);
      const pw = states.find(
        (s) =>
          !MONOPOLISTIC_WC_STATES.has(s) &&
          STATE_REGISTRY[s]?.hasStatePrevailingWage,
      );
      const nonPw = states.find(
        (s) =>
          !MONOPOLISTIC_WC_STATES.has(s) &&
          !STATE_REGISTRY[s]?.hasStatePrevailingWage,
      );
      expect(pw).toBeDefined();
      expect(nonPw).toBeDefined();
      const base: Partial<EstimateInput> = {
        tonnage: 40,
        beamCount: 80,
        baseWageRate: 50,
      };
      const pwR = calculateEstimate(inputFor({ ...base, state: pw! }));
      const nonPwR = calculateEstimate(inputFor({ ...base, state: nonPw! }));
      expect(pwR.labor.totalLabor).toBeGreaterThan(nonPwR.labor.totalLabor);
    });
  });

  describe("input clamping", () => {
    it("clamps negative tonnage to zero", () => {
      const r = calculateEstimate(
        inputFor({ state: "TX", tonnage: -50, beamCount: 0, deckingSqft: 0 }),
      );
      expect(r.materials.boltsConnections).toBe(0);
      expect(Number.isFinite(r.summary.totalBid)).toBe(true);
    });

    it("treats NaN inputs as zero", () => {
      const r = calculateEstimate(
        inputFor({
          state: "TX",
          tonnage: NaN,
          baseWageRate: NaN,
          beamCount: NaN,
        }),
      );
      expect(Number.isFinite(r.summary.totalBid)).toBe(true);
      expect(r.materials.boltsConnections).toBe(0);
    });

    it("clamps a negative wage so labor cannot go negative", () => {
      const r = calculateEstimate(
        inputFor({ state: "TX", baseWageRate: -100, tonnage: 10, beamCount: 20 }),
      );
      expect(r.labor.totalLabor).toBeGreaterThanOrEqual(0);
    });
  });
});
