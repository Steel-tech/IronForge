// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Steel Erection Estimate Calculator
 *
 * Produces a ballpark bid estimate from common ironwork rules of thumb. All
 * tunable figures live in `lib/estimator/constants.ts` (named + golden-tested);
 * this module is the math that combines them. Ballpark planning only — not a
 * substitute for a real takeoff.
 */

import type { EstimateInput, EstimateResult } from "@/lib/types/estimator";
import { STATE_REGISTRY } from "@/content/state-registry";
import {
  ESTIMATE_CONSTANTS as C,
  MAX_FIELD_VALUE,
  MONOPOLISTIC_WC_STATES,
  PROJECT_TYPE_FACTOR,
} from "@/lib/estimator/constants";

/**
 * Coerce a numeric input to a safe value: negatives/NaN become 0, and finite
 * values are capped at MAX_FIELD_VALUE so an absurd input (e.g. a pasted or
 * tampered 1e307) can't overflow a downstream product to Infinity/NaN.
 */
function clampNonNegative(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, MAX_FIELD_VALUE);
}

/** Burden rate (%) covering payroll taxes, WC, GL, benefits. */
function calcBurdenRate(stateCode: string, isUnion: boolean): number {
  const base = isUnion ? C.BURDEN_PCT_UNION : C.BURDEN_PCT_NONUNION;
  return MONOPOLISTIC_WC_STATES.has(stateCode)
    ? base + C.BURDEN_PCT_MONOPOLISTIC_BUMP
    : base;
}

/** Insurance rate (% of labor) — GL + WC rough. */
function calcInsuranceRate(stateCode: string): number {
  return MONOPOLISTIC_WC_STATES.has(stateCode)
    ? C.INSURANCE_PCT_MONOPOLISTIC
    : C.INSURANCE_PCT_STANDARD;
}

/** Prevailing-wage bump on the effective wage when the state requires PW. */
function prevailingWageMultiplier(stateCode: string): number {
  return STATE_REGISTRY[stateCode]?.hasStatePrevailingWage
    ? C.PREVAILING_WAGE_MULTIPLIER
    : 1.0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const {
    state,
    projectType,
    includesDecking,
    includesStairs,
    includesMisc,
    isUnion,
    needsLift,
    needsWelding,
  } = input;

  // Clamp numeric inputs at the calculation boundary — negatives and NaN
  // become 0, so a manually-typed bad value can't poison the estimate. The
  // HTML `min` attribute is only a hint and is bypassable.
  const tonnage = clampNonNegative(input.tonnage);
  const beamCount = clampNonNegative(input.beamCount);
  const deckingSqft = clampNonNegative(input.deckingSqft);
  const baseWageRate = clampNonNegative(input.baseWageRate);
  const foremanPremium = clampNonNegative(input.foremanPremium);
  const crewSize = clampNonNegative(input.crewSize);
  const durationWeeks = clampNonNegative(input.durationWeeks);
  const craneRate = clampNonNegative(input.craneRate);

  // ── LABOR ───────────────────────────────────────────────
  const projectFactor = PROJECT_TYPE_FACTOR[projectType] ?? 1.0;
  const pwMult = prevailingWageMultiplier(state);
  const effectiveWage = baseWageRate * pwMult;

  // Total crew-hours estimate. Use the greater of (crew * weeks * 40) or
  // (beamCount * MH/piece * projectFactor) so both approaches yield a
  // sensible number.
  const crewHours =
    Math.max(1, crewSize) *
    Math.max(1, durationWeeks) *
    C.WORK_HOURS_PER_WEEK;
  const pieceHours = beamCount * C.PIECE_MAN_HOURS * projectFactor;
  const totalManHours = Math.max(crewHours, pieceHours);

  const overtimeHours = totalManHours * C.OVERTIME_FRACTION;
  const straightTimeHours = totalManHours - overtimeHours;

  // Split between foreman (1) and journeymen (crewSize - 1).
  const foremanShare = crewSize > 0 ? 1 / Math.max(1, crewSize) : 0;
  const journeymanShare = 1 - foremanShare;

  const foremanST = straightTimeHours * foremanShare;
  const foremanOT = overtimeHours * foremanShare;
  const journeymanST = straightTimeHours * journeymanShare;
  const journeymanOT = overtimeHours * journeymanShare;

  const foremanWage = effectiveWage * (1 + foremanPremium / 100);

  const journeymanCost =
    journeymanST * effectiveWage +
    journeymanOT * effectiveWage * C.OVERTIME_MULTIPLIER;
  const foremanCost =
    foremanST * foremanWage + foremanOT * foremanWage * C.OVERTIME_MULTIPLIER;

  const grossWages = journeymanCost + foremanCost;
  const burdenPct = calcBurdenRate(state, isUnion);
  const burdenRate = grossWages * (burdenPct / 100);
  const totalLabor = grossWages + burdenRate;

  // ── MATERIALS ───────────────────────────────────────────
  const boltsConnections = tonnage * C.BOLTS_PER_TON;
  const weldingConsumables = needsWelding
    ? tonnage * C.WELDING_CONSUMABLES_PER_TON
    : 0;
  const deckingMaterial = includesDecking ? deckingSqft * C.DECKING_PER_SQFT : 0;
  const miscBase = C.MISC_BASE_FLAT + tonnage * C.MISC_BASE_PER_TON;
  const miscStairs = includesStairs ? C.MISC_STAIRS : 0;
  const miscExtras = includesMisc ? C.MISC_EXTRAS : 0;
  const miscMaterials = miscBase + miscStairs + miscExtras;
  const totalMaterials =
    boltsConnections + weldingConsumables + deckingMaterial + miscMaterials;

  // ── EQUIPMENT ───────────────────────────────────────────
  const craneCost = craneRate * durationWeeks * C.CRANE_DAYS_PER_WEEK;
  const liftCost = needsLift ? C.LIFT_PER_WEEK * durationWeeks : 0;
  const weldingEquipCost = needsWelding
    ? C.WELDING_EQUIP_PER_WEEK * durationWeeks
    : 0;
  const smallToolsAllowance = totalLabor * C.SMALL_TOOLS_PCT;
  const totalEquipment =
    craneCost + liftCost + weldingEquipCost + smallToolsAllowance;

  // ── OVERHEAD ────────────────────────────────────────────
  const directCosts = totalLabor + totalMaterials + totalEquipment;
  const generalConditions = directCosts * C.GENERAL_CONDITIONS_PCT;
  const insurance = totalLabor * (calcInsuranceRate(state) / 100);

  // Bonding ~ % of final contract value. Approximate the contract value as the
  // pre-bond subtotal grossed up by profit + contingency — derived from the
  // same constants so the markup can't drift from PROFIT_PCT/CONTINGENCY_PCT.
  const markupMultiplier = 1 + C.PROFIT_PCT + C.CONTINGENCY_PCT;
  const preBondSubtotal = directCosts + generalConditions + insurance;
  const preBondWithMarkup = preBondSubtotal * markupMultiplier;
  const bonding = preBondWithMarkup * C.BONDING_PCT;

  const totalOverhead = generalConditions + insurance + bonding;

  // ── SUMMARY ─────────────────────────────────────────────
  const subtotal = directCosts + totalOverhead;
  const profit = subtotal * C.PROFIT_PCT;
  const contingency = subtotal * C.CONTINGENCY_PCT;
  const totalBid = subtotal + profit + contingency;

  const costPerTon = tonnage > 0 ? totalBid / tonnage : 0;
  const costPerSqft = deckingSqft > 0 ? totalBid / deckingSqft : 0;

  return {
    labor: {
      straightTimeHours: round2(straightTimeHours),
      overtimeHours: round2(overtimeHours),
      journeymanCost: round2(journeymanCost),
      foremanCost: round2(foremanCost),
      burdenRate: round2(burdenRate),
      totalLabor: round2(totalLabor),
    },
    materials: {
      boltsConnections: round2(boltsConnections),
      weldingConsumables: round2(weldingConsumables),
      deckingMaterial: round2(deckingMaterial),
      miscMaterials: round2(miscMaterials),
      totalMaterials: round2(totalMaterials),
    },
    equipment: {
      craneCost: round2(craneCost),
      liftCost: round2(liftCost),
      weldingEquipCost: round2(weldingEquipCost),
      smallToolsAllowance: round2(smallToolsAllowance),
      totalEquipment: round2(totalEquipment),
    },
    overhead: {
      generalConditions: round2(generalConditions),
      insurance: round2(insurance),
      bonding: round2(bonding),
      totalOverhead: round2(totalOverhead),
    },
    summary: {
      directCosts: round2(directCosts),
      totalOverhead: round2(totalOverhead),
      subtotal: round2(subtotal),
      profit: round2(profit),
      contingency: round2(contingency),
      totalBid: round2(totalBid),
      costPerTon: round2(costPerTon),
      costPerSqft: round2(costPerSqft),
    },
  };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatCurrencyPrecise(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}
