// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Steel-erection estimate constants — the ironwork rules-of-thumb the bid
 * calculator is built on. Extracted from calculate.ts so the assumptions are
 * named, reviewable in one place, and locked by golden tests (calculate.test.ts).
 *
 * Sources: common structural-steel erection estimating rules of thumb. These
 * are ballpark planning figures, not a substitute for a real takeoff.
 */
import type { ProjectType } from "@/lib/types/estimator";

/** Productivity multiplier applied to man-hours by project type. */
export const PROJECT_TYPE_FACTOR: Record<ProjectType, number> = {
  Commercial: 1.0,
  Industrial: 1.15,
  "Bridge/Highway": 1.3,
  Residential: 0.9,
  "Miscellaneous Metals": 1.1,
};

/** Monopolistic workers'-comp states (state-run fund, higher WC burden). */
export const MONOPOLISTIC_WC_STATES = new Set(["WA", "OH", "ND", "WY"]);

/**
 * Upper bound for any single numeric input. No real estimate uses a billion of
 * any unit (tons, beams, dollars/hr), and clamping here keeps downstream
 * products well inside the float range — a pasted/tampered 1e307 can't overflow
 * the bid to Infinity/NaN.
 */
export const MAX_FIELD_VALUE = 1e9;

export const ESTIMATE_CONSTANTS = {
  // Labor
  PIECE_MAN_HOURS: 1.0, // MH per piece, baseline
  WORK_HOURS_PER_WEEK: 40,
  OVERTIME_FRACTION: 0.1, // 10% of hours estimated as OT
  OVERTIME_MULTIPLIER: 1.5,

  // Burden (payroll taxes, WC, GL, benefits) as % of gross wages
  BURDEN_PCT_UNION: 45,
  BURDEN_PCT_NONUNION: 35,
  BURDEN_PCT_MONOPOLISTIC_BUMP: 5,

  // Insurance (GL + WC) as % of labor
  INSURANCE_PCT_MONOPOLISTIC: 9,
  INSURANCE_PCT_STANDARD: 7,

  // Wage
  PREVAILING_WAGE_MULTIPLIER: 1.15, // +15% effective wage in PW states

  // Materials
  BOLTS_PER_TON: 80,
  WELDING_CONSUMABLES_PER_TON: 30,
  DECKING_PER_SQFT: 4.5,
  MISC_BASE_FLAT: 500,
  MISC_BASE_PER_TON: 20,
  MISC_STAIRS: 1500,
  MISC_EXTRAS: 2000,

  // Equipment
  CRANE_DAYS_PER_WEEK: 5,
  LIFT_PER_WEEK: 800,
  WELDING_EQUIP_PER_WEEK: 200,
  SMALL_TOOLS_PCT: 0.02, // % of labor

  // Overhead & markup
  GENERAL_CONDITIONS_PCT: 0.08, // % of direct costs
  BONDING_PCT: 0.025, // % of marked-up contract value
  PROFIT_PCT: 0.1,
  CONTINGENCY_PCT: 0.05,
} as const;
