import type { Phase } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateCertifications(state: StateData): Phase {
  return {
    id: "certifications",
    title: `Certifications - ${state.name}`,
    description: `${state.name} state-specific certifications`,
    icon: "Award",
    steps: [
      {
        id: `${state.code.toLowerCase()}-state-cert`,
        title: `${state.name} State Certification Programs`,
        description: `${state.name} offers the ${state.stateCertProgram} for small, minority, women-owned, and disadvantaged businesses. These certifications give you access to state contract set-asides and participation goals on state-funded projects. Many GCs actively seek certified subcontractors to meet diversity goals. Categories: ${state.stateCertCategories}.`,
        estimatedTime: "2-3 months",
        estimatedCost: { min: 0, max: 0, notes: "Free to apply" },
        checklist: [
          { id: "verify-eligibility", label: "Verify eligibility for state certification programs", description: `Check requirements for ${state.stateCertCategories} categories`, required: true },
          { id: "submit-application", label: "Submit certification application", description: `Apply through ${state.stateCertProgram}`, required: true, ...(state.stateCertUrl ? { link: state.stateCertUrl } : {}) },
          { id: "gather-docs", label: "Gather supporting documentation", description: "Business formation docs, tax returns, personal financial statement", required: true },
          { id: "dbe-ucp", label: "Apply for DBE certification through Unified Certification Program", description: "DBE certification covers DOT-assisted contracts statewide", required: false },
        ],
        resources: [
          ...(state.stateCertUrl ? [{ title: state.stateCertProgram, url: state.stateCertUrl, description: `${state.name} certification program`, type: "form" as const }] : []),
          { title: "USDOT - DBE Program", url: "https://www.transportation.gov/civil-rights/disadvantaged-business-enterprise", description: "Federal DBE program overview", type: "guide" },
        ],
        tips: [
          `${state.name} certification categories: ${state.stateCertCategories}`,
          "Many public projects have participation goals for certified businesses",
          "GCs on public projects actively recruit certified subcontractors to meet their goals",
          "Certification is often free to apply — the ROI is significant",
          "DBE certification is especially valuable for DOT transportation/bridge projects",
        ],
        warnings: [
          "Certification requires renewal — maintain accurate records and set reminders",
          "The review process may include site visits — be prepared",
          "Misrepresenting certification status has serious legal consequences",
        ],
        stateSpecific: true,
        aiContext: `${state.name} state certifications. ${state.stateCertProgram}. Categories: ${state.stateCertCategories}. Free to apply. ${state.uniqueNotes}`,
      },
    ],
  };
}
