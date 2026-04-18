// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Steel Erection Estimate Calculator
 *
 * Produces a realistic (ballpark) bid estimate using common ironwork
 * industry rules of thumb:
 *   - Erection rate: ~0.8-1.2 man-hours per piece for structural steel
 *   - Typical crew: 1 foreman + (crewSize - 1) journeymen
 *   - OT estimate: 10% of straight-time hours
 *   - Burden (taxes, insurance, benefits): ~45% non-monopolistic,
 *     ~50% monopolistic WC states (WA, OH, ND, WY)
 *   - Prevailing wage states add ~15% to effective wage burden
 *   - Bolts/connections: ~$80/ton
 *   - Welding consumables: ~$30/ton
 *   - Decking material: ~$4.50/sqft
 *   - Small tools: 2% of labor
 *   - General conditions: 8% of direct costs
 *   - Bonding: ~2.5% of contract value
 *   - Profit: 10%
 *   - Contingency: 5%
 */

import type {
  EstimateInput,
  EstimateResult,
  ProjectType,
} from "@/lib/types/estimator";
import { STATE_REGISTRY } from "@/content/state-registry";

/** Project-type productivity multiplier (applies to hours needed). */
const PROJECT_TYPE_FACTOR: Record<ProjectType, number> = {
  Commercial: 1.0,
  Industrial: 1.15,
  "Bridge/Highway": 1.3,
  Residential: 0.9,
  "Miscellaneous Metals": 1.1,
};

const MONOPOLISTIC_WC_STATES = new Set(["WA", "OH", "ND", "WY"]);

/** Burden rate (%) covering payroll taxes, WC, GL, benefits. */
function calcBurdenRate(stateCode: string, isUnion: boolean): number {
  const monopolistic = MONOPOLISTIC_WC_STATES.has(stateCode);
  let base = isUnion ? 45 : 35;
  if (monopolistic) base += 5;
  return base;
}

/** Insurance rate (% of labor) — GL + WC rough. */
function calcInsuranceRate(stateCode: string): number {
  if (MONOPOLISTIC_WC_STATES.has(stateCode)) return 9;
  return 7;
}

/** Prevailing-wage bump: +15% on effective wage when state requires PW. */
function prevailingWageMultiplier(stateCode: string): number {
  const s = STATE_REGISTRY[stateCode];
  if (s?.hasStatePrevailingWage) return 1.15;
  return 1.0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const {
    state,
    projectType,
    tonnage,
    beamCount,
    includesDecking,
    deckingSqft,
    includesStairs,
    includesMisc,
    isUnion,
    baseWageRate,
    foremanPremium,
    crewSize,
    durationWeeks,
    craneRate,
    needsLift,
    needsWelding,
  } = input;

  // ── LABOR ───────────────────────────────────────────────
  const projectFactor = PROJECT_TYPE_FACTOR[projectType] ?? 1.0;
  const pwMult = prevailingWageMultiplier(state);
  const effectiveWage = baseWageRate * pwMult;

  // Total crew-hours estimate. Use the greater of (crew * weeks * 40)
  // or (beamCount * 1 MH/piece * projectFactor) so both approaches yield
  // a sensible number.
  const crewHours = Math.max(1, crewSize) * Math.max(1, durationWeeks) * 40;
  const pieceHours = beamCount * 1.0 * projectFactor;
  const totalManHours = Math.max(crewHours, pieceHours);

  // 10% overtime estimate.
  const overtimeHours = totalManHours * 0.1;
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
    journeymanST * effectiveWage + journeymanOT * effectiveWage * 1.5;
  const foremanCost =
    foremanST * foremanWage + foremanOT * foremanWage * 1.5;

  const grossWages = journeymanCost + foremanCost;
  const burdenPct = calcBurdenRate(state, isUnion);
  const burdenRate = grossWages * (burdenPct / 100);
  const totalLabor = grossWages + burdenRate;

  // ── MATERIALS ───────────────────────────────────────────
  const boltsConnections = tonnage * 80;
  const weldingConsumables = needsWelding ? tonnage * 30 : 0;
  const deckingMaterial = includesDecking ? deckingSqft * 4.5 : 0;
  const miscBase = 500 + tonnage * 20;
  const miscStairs = includesStairs ? 1500 : 0;
  const miscExtras = includesMisc ? 2000 : 0;
  const miscMaterials = miscBase + miscStairs + miscExtras;
  const totalMaterials =
    boltsConnections + weldingConsumables + deckingMaterial + miscMaterials;

  // ── EQUIPMENT ───────────────────────────────────────────
  // Crane: 5 working days/week.
  const craneCost = craneRate * durationWeeks * 5;
  const liftCost = needsLift ? 800 * durationWeeks : 0;
  const weldingEquipCost = needsWelding ? 200 * durationWeeks : 0;
  const smallToolsAllowance = totalLabor * 0.02;
  const totalEquipment =
    craneCost + liftCost + weldingEquipCost + smallToolsAllowance;

  // ── OVERHEAD ────────────────────────────────────────────
  const directCosts = totalLabor + totalMaterials + totalEquipment;
  const generalConditions = directCosts * 0.08;
  const insurance = totalLabor * (calcInsuranceRate(state) / 100);

  // Bonding is 2.5% of final contract value. Use pre-bond subtotal +
  // profit + contingency to approximate.
  const preBondSubtotal = directCosts + generalConditions + insurance;
  const preBondWithMarkup = preBondSubtotal * 1.15; // 10% profit + 5% contingency
  const bonding = preBondWithMarkup * 0.025;

  const totalOverhead = generalConditions + insurance + bonding;

  // ── SUMMARY ─────────────────────────────────────────────
  const subtotal = directCosts + totalOverhead;
  const profit = subtotal * 0.1;
  const contingency = subtotal * 0.05;
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
