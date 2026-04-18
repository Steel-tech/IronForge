// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
export interface PastProject {
  id: string;
  projectName: string;
  client: string;
  contractValue: string;
  periodOfPerformance: string;
  description: string;
  relevance: string;
}

export interface CapStatementData {
  // Company Information
  companyName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  yearEstablished: string;
  dunsNumber: string;
  cageCode: string;
  logoDataUrl: string; // data URL or empty string

  // Business Classifications
  naicsCodes: string; // comma-separated
  sicCodes: string;
  businessSize: "Small" | "Large" | "Other" | "";
  certifications: {
    SDVOSB: boolean;
    EIGHTA: boolean; // 8(a)
    HUBZone: boolean;
    DBE: boolean;
    MBE: boolean;
    WBE: boolean;
    WOSB: boolean;
    EDWOSB: boolean;
    SBE: boolean;
  };
  samRegistered: boolean;
  samUeiNumber: string;

  // Core Competencies
  coreCompetencies: string;
  differentiators: string;

  // Past Performance
  pastProjects: PastProject[];

  // Bonding & Insurance
  bondingSingle: string;
  bondingAggregate: string;
  insuranceSummary: string;
  insuranceGL: string;
  insuranceWC: string;
  insuranceAuto: string;
}

export const DEFAULT_COMPETENCIES =
  "Structural Steel Erection, Steel Joist & Deck Installation, Miscellaneous Metals, Ornamental Iron, Reinforcing Steel, Rigging & Machinery Moving, Pre-Engineered Metal Buildings, Bridge & Highway Steel";

export const SUGGESTED_NAICS = [
  { code: "238120", desc: "Structural Steel & Precast Concrete Contractors" },
  { code: "238190", desc: "Other Foundation/Structure/Building Exterior" },
  { code: "332312", desc: "Fabricated Structural Metal Manufacturing" },
];

export const CERT_LABELS: Record<keyof CapStatementData["certifications"], string> = {
  SDVOSB: "SDVOSB (Service-Disabled Veteran-Owned Small Business)",
  EIGHTA: "8(a) Business Development",
  HUBZone: "HUBZone",
  DBE: "DBE (Disadvantaged Business Enterprise)",
  MBE: "MBE (Minority Business Enterprise)",
  WBE: "WBE (Women Business Enterprise)",
  WOSB: "WOSB (Women-Owned Small Business)",
  EDWOSB: "EDWOSB (Economically Disadvantaged WOSB)",
  SBE: "SBE (Small Business Enterprise)",
};

export function emptyPastProject(): PastProject {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectName: "",
    client: "",
    contractValue: "",
    periodOfPerformance: "",
    description: "",
    relevance: "",
  };
}

export const DEFAULT_CAP_STATEMENT: CapStatementData = {
  companyName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
  website: "",
  yearEstablished: "",
  dunsNumber: "",
  cageCode: "",
  logoDataUrl: "",
  naicsCodes: "238120, 238190, 332312",
  sicCodes: "",
  businessSize: "Small",
  certifications: {
    SDVOSB: false,
    EIGHTA: false,
    HUBZone: false,
    DBE: false,
    MBE: false,
    WBE: false,
    WOSB: false,
    EDWOSB: false,
    SBE: false,
  },
  samRegistered: false,
  samUeiNumber: "",
  coreCompetencies: DEFAULT_COMPETENCIES,
  differentiators: "",
  pastProjects: [emptyPastProject(), emptyPastProject(), emptyPastProject()],
  bondingSingle: "",
  bondingAggregate: "",
  insuranceSummary: "",
  insuranceGL: "",
  insuranceWC: "",
  insuranceAuto: "",
};
