/**
 * Union data utilities — re-organize ironworkers locals from STATE_REGISTRY
 * for the Unions dashboard. The registry stores locals per state (often the
 * same Local 86 ends up listed in multiple states because the local covers
 * a region). Here we deduplicate and re-bucket by region and by local number.
 */

import { STATE_REGISTRY } from "@/content/state-registry";

export type Region =
  | "Northeast"
  | "Mid-Atlantic"
  | "Southeast"
  | "Midwest"
  | "Great Plains"
  | "Southwest"
  | "Mountain West"
  | "West"
  | "Pacific Northwest"
  | "Non-Contiguous";

export interface OrganizedLocal {
  /** Local number, e.g. "86" */
  number: string;
  /** Display name, e.g. "Ironworkers Local 86" */
  name: string;
  /** Primary city/HQ */
  city: string;
  /** Website URL */
  url: string;
  /** Phone */
  phone: string;
  /** Combined jurisdiction blurb */
  jurisdiction: string;
  /** State codes the local has been linked to in the registry */
  states: string[];
  /** District council blurb (best-known affiliation across linked states) */
  districtCouncil: string;
}

export const REGION_BY_STATE: Record<string, Region> = {
  // Pacific Northwest
  WA: "Pacific Northwest",
  OR: "Pacific Northwest",
  ID: "Pacific Northwest",
  AK: "Pacific Northwest",
  // West
  CA: "West",
  NV: "West",
  HI: "Non-Contiguous",
  // Mountain West
  MT: "Mountain West",
  WY: "Mountain West",
  CO: "Mountain West",
  UT: "Mountain West",
  // Southwest
  AZ: "Southwest",
  NM: "Southwest",
  TX: "Southwest",
  OK: "Southwest",
  // Great Plains
  ND: "Great Plains",
  SD: "Great Plains",
  NE: "Great Plains",
  KS: "Great Plains",
  // Midwest
  MN: "Midwest",
  IA: "Midwest",
  MO: "Midwest",
  WI: "Midwest",
  IL: "Midwest",
  IN: "Midwest",
  MI: "Midwest",
  OH: "Midwest",
  // Southeast
  AR: "Southeast",
  LA: "Southeast",
  MS: "Southeast",
  AL: "Southeast",
  TN: "Southeast",
  KY: "Southeast",
  GA: "Southeast",
  FL: "Southeast",
  SC: "Southeast",
  NC: "Southeast",
  // Mid-Atlantic
  VA: "Mid-Atlantic",
  WV: "Mid-Atlantic",
  MD: "Mid-Atlantic",
  DE: "Mid-Atlantic",
  DC: "Mid-Atlantic",
  // Northeast
  PA: "Northeast",
  NJ: "Northeast",
  NY: "Northeast",
  CT: "Northeast",
  RI: "Northeast",
  MA: "Northeast",
  VT: "Northeast",
  NH: "Northeast",
  ME: "Northeast",
};

export const REGION_ORDER: Region[] = [
  "Pacific Northwest",
  "West",
  "Mountain West",
  "Southwest",
  "Great Plains",
  "Midwest",
  "Southeast",
  "Mid-Atlantic",
  "Northeast",
  "Non-Contiguous",
];

export interface StateUnionGroup {
  code: string;
  name: string;
  emoji: string;
  locals: OrganizedLocal[];
}

export interface RegionUnionGroup {
  region: Region;
  states: StateUnionGroup[];
  /** Unique locals appearing across the region */
  locals: OrganizedLocal[];
}

/** Build a master deduplicated list of locals keyed by local number. */
export function getAllLocals(): OrganizedLocal[] {
  const map = new Map<string, OrganizedLocal>();

  for (const state of Object.values(STATE_REGISTRY)) {
    for (const local of state.ironworkersLocals) {
      const key = local.number.trim() || `${local.name}-${local.city}`;
      const existing = map.get(key);
      if (existing) {
        if (!existing.states.includes(state.code)) {
          existing.states.push(state.code);
        }
        // Merge jurisdiction blurbs if they differ meaningfully.
        if (
          local.jurisdiction &&
          !existing.jurisdiction.includes(local.jurisdiction)
        ) {
          existing.jurisdiction = [existing.jurisdiction, local.jurisdiction]
            .filter(Boolean)
            .join("; ");
        }
        // Prefer the longest district council blurb we encounter.
        if (
          state.districtCouncil &&
          state.districtCouncil.length > existing.districtCouncil.length
        ) {
          existing.districtCouncil = state.districtCouncil;
        }
      } else {
        map.set(key, {
          number: local.number,
          name: local.name,
          city: local.city,
          url: local.url,
          phone: local.phone,
          jurisdiction: local.jurisdiction,
          states: [state.code],
          districtCouncil: state.districtCouncil ?? "",
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const an = parseInt(a.number, 10);
    const bn = parseInt(b.number, 10);
    if (Number.isNaN(an) && Number.isNaN(bn)) return a.name.localeCompare(b.name);
    if (Number.isNaN(an)) return 1;
    if (Number.isNaN(bn)) return -1;
    return an - bn;
  });
}

/** Get locals for a specific state code (in original registry order). */
export function getLocalsForState(stateCode: string): OrganizedLocal[] {
  const state = STATE_REGISTRY[stateCode];
  if (!state) return [];
  return state.ironworkersLocals.map((local) => ({
    number: local.number,
    name: local.name,
    city: local.city,
    url: local.url,
    phone: local.phone,
    jurisdiction: local.jurisdiction,
    states: [state.code],
    districtCouncil: state.districtCouncil,
  }));
}

/** Group locals by region, preserving state-level breakdown. */
export function getRegionalGroups(): RegionUnionGroup[] {
  const groups = new Map<Region, RegionUnionGroup>();

  for (const region of REGION_ORDER) {
    groups.set(region, { region, states: [], locals: [] });
  }

  // Track unique locals per region.
  const regionLocalKeys = new Map<Region, Set<string>>();
  for (const region of REGION_ORDER) regionLocalKeys.set(region, new Set());

  for (const state of Object.values(STATE_REGISTRY)) {
    const region = REGION_BY_STATE[state.code] ?? "Non-Contiguous";
    const group = groups.get(region);
    if (!group) continue;

    const stateLocals: OrganizedLocal[] = state.ironworkersLocals.map((local) => ({
      number: local.number,
      name: local.name,
      city: local.city,
      url: local.url,
      phone: local.phone,
      jurisdiction: local.jurisdiction,
      states: [state.code],
      districtCouncil: state.districtCouncil,
    }));

    group.states.push({
      code: state.code,
      name: state.name,
      emoji: state.emoji,
      locals: stateLocals,
    });

    for (const local of stateLocals) {
      const key = local.number.trim() || `${local.name}-${local.city}`;
      const seen = regionLocalKeys.get(region)!;
      if (!seen.has(key)) {
        seen.add(key);
        group.locals.push(local);
      }
    }
  }

  for (const group of groups.values()) {
    group.states.sort((a, b) => a.name.localeCompare(b.name));
    group.locals.sort((a, b) => {
      const an = parseInt(a.number, 10);
      const bn = parseInt(b.number, 10);
      if (Number.isNaN(an) && Number.isNaN(bn)) return a.name.localeCompare(b.name);
      if (Number.isNaN(an)) return 1;
      if (Number.isNaN(bn)) return -1;
      return an - bn;
    });
  }

  return REGION_ORDER.map((region) => groups.get(region)!).filter(
    (g) => g.states.length > 0,
  );
}

/** Default trust-fund estimate values by region (rough industry midpoints). */
export interface TrustFundDefaults {
  baseWage: number;
  healthWelfare: number;
  pension: number;
  annuity: number;
  training: number;
  other: number;
}

export const TRUST_FUND_DEFAULTS: TrustFundDefaults = {
  baseWage: 42,
  healthWelfare: 14,
  pension: 11,
  annuity: 7,
  training: 1,
  other: 1.5,
};
