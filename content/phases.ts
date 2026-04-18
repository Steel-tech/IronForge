// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";

// Hand-crafted state content (highest quality)
import { waBusinessFormation } from "./washington/business-formation";
import { waContractorLicense } from "./washington/contractor-license";
import { waBonding } from "./washington/bonding";
import { waInsurance } from "./washington/insurance";
import { waCertifications } from "./washington/certifications";
import { orBusinessFormation } from "./oregon/business-formation";
import { orContractorLicense } from "./oregon/contractor-license";
import { orBonding } from "./oregon/bonding";
import { orInsurance } from "./oregon/insurance";
import { orCertifications } from "./oregon/certifications";

// Shared content
import { federalCertifications } from "./shared/federal-certifications";
import { bondingEducation } from "./shared/bonding-education";
import { insuranceEducation } from "./shared/insurance-education";
import { legalResources } from "./shared/legal-resources";
import { unionSignatoryEducation } from "./shared/union-signatory";

// Generated content (data-driven for all 50 states)
import { STATE_REGISTRY } from "./state-registry";
import { generateBusinessFormation } from "./generators/business-formation";
import { generateContractorLicense } from "./generators/contractor-license";
import { generateBonding } from "./generators/bonding";
import { generateInsurance } from "./generators/insurance";
import { generateCertifications } from "./generators/certifications";
import { generateUnionSignatory } from "./generators/union-signatory";

export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY";

export interface PhaseDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    id: "business-formation",
    title: "Business Formation",
    description: "LLC setup, EIN, bank account, state tax registration",
    icon: "Building2",
  },
  {
    id: "contractor-licensing",
    title: "Contractor Licensing",
    description: "State contractor registration and licensing requirements",
    icon: "ClipboardCheck",
  },
  {
    id: "surety-bonding",
    title: "Surety Bonding",
    description: "Bid, performance, and payment bonds explained in plain English",
    icon: "Shield",
  },
  {
    id: "insurance",
    title: "Insurance Coverage",
    description: "GL, workers' comp, commercial auto, and tools coverage",
    icon: "ShieldCheck",
  },
  {
    id: "certifications",
    title: "Certifications & Set-Asides",
    description: "SDVOSB, MBE/DBE, 8(a), HUBZone, and state programs",
    icon: "Award",
  },
  {
    id: "union-signatory",
    title: "Union Signatory Contractor",
    description: "Becoming a signatory contractor with your local Ironworkers union",
    icon: "Handshake",
  },
  {
    id: "legal-federal",
    title: "Legal & Federal Contracting",
    description: "Construction attorney, SAM.gov, NAICS codes, capability statements",
    icon: "Scale",
  },
];

function getStateData(state: StateCode) {
  return STATE_REGISTRY[state];
}

function getBusinessFormation(state: StateCode): Phase {
  if (state === "WA") return waBusinessFormation;
  if (state === "OR") return orBusinessFormation;
  const data = getStateData(state);
  if (!data) return waBusinessFormation; // fallback
  return generateBusinessFormation(data);
}

function getContractorLicense(state: StateCode): Phase {
  if (state === "WA") return waContractorLicense;
  if (state === "OR") return orContractorLicense;
  const data = getStateData(state);
  if (!data) return waContractorLicense;
  return generateContractorLicense(data);
}

function getBonding(state: StateCode): Phase {
  if (state === "WA") return waBonding;
  if (state === "OR") return orBonding;
  const data = getStateData(state);
  if (!data) return waBonding;
  return generateBonding(data);
}

function getInsurance(state: StateCode): Phase {
  if (state === "WA") return waInsurance;
  if (state === "OR") return orInsurance;
  const data = getStateData(state);
  if (!data) return waInsurance;
  return generateInsurance(data);
}

function getCertifications(state: StateCode): Phase {
  if (state === "WA") return waCertifications;
  if (state === "OR") return orCertifications;
  const data = getStateData(state);
  if (!data) return waCertifications;
  return generateCertifications(data);
}

function getUnionSignatory(state: StateCode): Phase {
  const data = getStateData(state);
  if (!data) return generateUnionSignatory(STATE_REGISTRY["WA"]);
  return generateUnionSignatory(data);
}

export function getPhaseContent(phaseId: string, state: StateCode): Phase {
  switch (phaseId) {
    case "business-formation":
      return getBusinessFormation(state);
    case "contractor-licensing":
      return getContractorLicense(state);
    case "surety-bonding": {
      const stateBonding = getBonding(state);
      return mergePhases(bondingEducation, stateBonding);
    }
    case "insurance": {
      const stateInsurance = getInsurance(state);
      return mergePhases(insuranceEducation, stateInsurance);
    }
    case "certifications": {
      const stateCerts = getCertifications(state);
      return mergePhases(federalCertifications, stateCerts);
    }
    case "union-signatory": {
      const stateUnion = getUnionSignatory(state);
      return mergePhases(unionSignatoryEducation, stateUnion);
    }
    case "legal-federal":
      return legalResources;
    default:
      return {
        id: phaseId,
        title: "Unknown Phase",
        description: "",
        icon: "HelpCircle",
        steps: [],
      };
  }
}

function mergePhases(base: Phase, stateSpecific: Phase): Phase {
  return {
    ...base,
    steps: [...base.steps, ...stateSpecific.steps],
  };
}

export function getStepByIds(phaseId: string, stepId: string, state: StateCode) {
  const phase = getPhaseContent(phaseId, state);
  return phase.steps.find((s) => s.id === stepId) ?? null;
}

export function getNextStep(
  phaseId: string,
  stepId: string,
  state: StateCode
): { phaseId: string; stepId: string } | null {
  const phase = getPhaseContent(phaseId, state);
  const stepIndex = phase.steps.findIndex((s) => s.id === stepId);

  if (stepIndex < phase.steps.length - 1) {
    return { phaseId, stepId: phase.steps[stepIndex + 1].id };
  }

  const phaseIndex = PHASE_DEFINITIONS.findIndex((p) => p.id === phaseId);
  if (phaseIndex < PHASE_DEFINITIONS.length - 1) {
    const nextPhaseId = PHASE_DEFINITIONS[phaseIndex + 1].id;
    const nextPhase = getPhaseContent(nextPhaseId, state);
    if (nextPhase.steps.length > 0) {
      return { phaseId: nextPhaseId, stepId: nextPhase.steps[0].id };
    }
  }

  return null;
}

export function getPrevStep(
  phaseId: string,
  stepId: string,
  state: StateCode
): { phaseId: string; stepId: string } | null {
  const phase = getPhaseContent(phaseId, state);
  const stepIndex = phase.steps.findIndex((s) => s.id === stepId);

  if (stepIndex > 0) {
    return { phaseId, stepId: phase.steps[stepIndex - 1].id };
  }

  const phaseIndex = PHASE_DEFINITIONS.findIndex((p) => p.id === phaseId);
  if (phaseIndex > 0) {
    const prevPhaseId = PHASE_DEFINITIONS[phaseIndex - 1].id;
    const prevPhase = getPhaseContent(prevPhaseId, state);
    if (prevPhase.steps.length > 0) {
      return { phaseId: prevPhaseId, stepId: prevPhase.steps[prevPhase.steps.length - 1].id };
    }
  }

  return null;
}
