// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateInsurance(state: StateData): Phase {
  const wcTypeLabel =
    state.wcType === "monopolistic"
      ? "MONOPOLISTIC state fund"
      : state.wcType === "competitive"
        ? "competitive state fund or private carriers"
        : "private carriers only";

  const wcDesc =
    state.wcType === "monopolistic"
      ? `${state.name} is a monopolistic state fund state for workers' comp — you MUST get your workers' comp through ${state.wcAgency}. You cannot buy it from a private carrier. ${state.wcNotes}`
      : state.wcType === "competitive"
        ? `${state.name} offers both a competitive state fund and private carriers for workers' comp. ${state.wcNotes} Shop both options for the best rate.`
        : `${state.name} uses private carriers only for workers' comp. ${state.wcNotes} Shop multiple carriers for the best rate.`;

  return {
    id: "insurance",
    title: `Insurance - ${state.name}`,
    description: `${state.name}-specific insurance requirements`,
    icon: "ShieldCheck",
    steps: [
      {
        id: `${state.code.toLowerCase()}-workers-comp`,
        title: `${state.name} Workers' Compensation`,
        description: wcDesc,
        estimatedTime: "1-2 weeks",
        estimatedCost: { min: 3000, max: 15000, notes: "Varies significantly by payroll and classification — ironwork rates are high" },
        checklist: [
          ...(state.wcType === "monopolistic"
            ? [
                { id: "state-fund-account", label: `Open account with ${state.wcAgency}`, description: "This is the only option — no private carriers", required: true, ...(state.wcAgencyUrl ? { link: state.wcAgencyUrl } : {}) },
              ]
            : state.wcType === "competitive"
              ? [
                  { id: "compare-carriers", label: "Get quotes from state fund and private carriers", description: `${state.wcAgency} or private carriers — compare rates`, required: true },
                  { id: "choose-carrier", label: "Choose your workers' comp carrier", description: "Select the best combination of rate and service", required: true },
                ]
              : [
                  { id: "shop-carriers", label: "Get quotes from multiple private carriers", description: "Rates vary significantly between carriers — shop around", required: true },
                  { id: "choose-carrier", label: "Select your workers' comp carrier", description: "Consider rate, claims handling, and financial stability", required: true },
                ]),
          { id: "obtain-policy", label: "Obtain workers' compensation policy", description: "Required before hiring any employees", required: true },
          { id: "classification", label: "Verify your risk classification", description: "Ironwork classifications have some of the highest rates in construction", required: true },
          { id: "reporting", label: "Set up premium reporting and payment", description: "Premium is typically paid quarterly based on payroll", required: true },
        ],
        resources: [
          ...(state.wcAgencyUrl ? [{ title: state.wcAgency, url: state.wcAgencyUrl, description: `${state.name} workers' compensation information`, type: "website" as const }] : []),
        ],
        tips: [
          `${state.name} workers' comp type: ${wcTypeLabel}`,
          "Ironwork classifications have some of the highest rates in construction — budget accordingly",
          "Safety programs can reduce your experience modification rate and premiums over time",
          ...(state.wcType !== "monopolistic" ? ["Shop multiple carriers — rates can vary significantly"] : []),
          "Consider joining a group program or retrospective rating plan for potential savings",
        ],
        warnings: [
          "Operating without workers' comp when required can result in severe penalties",
          "If you exempt yourself as an LLC member, you have NO workers' comp coverage for your own injuries",
          ...(state.wcType === "monopolistic" ? [`${state.name} is a monopolistic state — you cannot use private carriers for workers' comp`] : []),
          "Keep accurate payroll records by classification — audits are common",
        ],
        stateSpecific: true,
        aiContext: `${state.name} workers' comp: ${wcTypeLabel}. ${state.wcNotes} Ironwork rates among highest in construction.`,
      },
    ],
  };
}
