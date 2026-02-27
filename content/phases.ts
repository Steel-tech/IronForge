import type { Phase } from "@/lib/types/content";
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
import { federalCertifications } from "./shared/federal-certifications";
import { bondingEducation } from "./shared/bonding-education";
import { insuranceEducation } from "./shared/insurance-education";
import { legalResources } from "./shared/legal-resources";

export type StateCode = "WA" | "OR";

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
    id: "legal-federal",
    title: "Legal & Federal Contracting",
    description: "Construction attorney, SAM.gov, NAICS codes, capability statements",
    icon: "Scale",
  },
];

export function getPhaseContent(phaseId: string, state: StateCode): Phase {
  switch (phaseId) {
    case "business-formation":
      return state === "WA" ? waBusinessFormation : orBusinessFormation;
    case "contractor-licensing":
      return state === "WA" ? waContractorLicense : orContractorLicense;
    case "surety-bonding": {
      const stateBonding = state === "WA" ? waBonding : orBonding;
      return mergePhases(bondingEducation, stateBonding);
    }
    case "insurance": {
      const stateInsurance = state === "WA" ? waInsurance : orInsurance;
      return mergePhases(insuranceEducation, stateInsurance);
    }
    case "certifications": {
      const stateCerts = state === "WA" ? waCertifications : orCertifications;
      return mergePhases(federalCertifications, stateCerts);
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
