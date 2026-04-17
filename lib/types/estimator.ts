/**
 * Estimator Types — Steel Erection Bid Calculator
 */

export type ProjectType =
  | "Commercial"
  | "Industrial"
  | "Bridge/Highway"
  | "Residential"
  | "Miscellaneous Metals";

export type CraneType = "None" | "Hydraulic" | "Crawler" | "Tower";

export const CRANE_DAY_RATES: Record<CraneType, number> = {
  None: 0,
  Hydraulic: 1500,
  Crawler: 3500,
  Tower: 6000,
};

export interface EstimateInput {
  projectName: string;
  state: string;
  projectType: ProjectType;

  // Scope
  tonnage: number;
  floors: number;
  beamCount: number;
  includesDecking: boolean;
  deckingSqft: number;
  includesStairs: boolean;
  includesMisc: boolean;

  // Labor
  isUnion: boolean;
  baseWageRate: number;
  foremanPremium: number; // percent e.g. 15 = 15%
  crewSize: number;
  durationWeeks: number;

  // Equipment
  craneType: CraneType;
  craneRate: number; // per day
  needsLift: boolean;
  needsWelding: boolean;
}

export interface LaborBreakdown {
  straightTimeHours: number;
  overtimeHours: number;
  journeymanCost: number;
  foremanCost: number;
  burdenRate: number; // absolute dollars of burden added
  totalLabor: number;
}

export interface MaterialsBreakdown {
  boltsConnections: number;
  weldingConsumables: number;
  deckingMaterial: number;
  miscMaterials: number;
  totalMaterials: number;
}

export interface EquipmentBreakdown {
  craneCost: number;
  liftCost: number;
  weldingEquipCost: number;
  smallToolsAllowance: number;
  totalEquipment: number;
}

export interface OverheadBreakdown {
  generalConditions: number;
  insurance: number;
  bonding: number;
  totalOverhead: number;
}

export interface EstimateSummary {
  directCosts: number;
  totalOverhead: number;
  subtotal: number;
  profit: number;
  contingency: number;
  totalBid: number;
  costPerTon: number;
  costPerSqft: number;
}

export interface EstimateResult {
  labor: LaborBreakdown;
  materials: MaterialsBreakdown;
  equipment: EquipmentBreakdown;
  overhead: OverheadBreakdown;
  summary: EstimateSummary;
}

export const DEFAULT_ESTIMATE_INPUT: EstimateInput = {
  projectName: "",
  state: "",
  projectType: "Commercial",
  tonnage: 0,
  floors: 1,
  beamCount: 0,
  includesDecking: false,
  deckingSqft: 0,
  includesStairs: false,
  includesMisc: false,
  isUnion: true,
  baseWageRate: 42,
  foremanPremium: 15,
  crewSize: 4,
  durationWeeks: 4,
  craneType: "Hydraulic",
  craneRate: 1500,
  needsLift: false,
  needsWelding: false,
};
