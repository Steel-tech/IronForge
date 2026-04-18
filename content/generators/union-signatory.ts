// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateUnionSignatory(state: StateData): Phase {
  const locals = state.ironworkersLocals;
  const primaryLocal = locals[0];

  const localsList = locals
    .map((l) => `${l.name} (${l.city}) — jurisdiction: ${l.jurisdiction}`)
    .join("; ");

  const resourceList = locals.map((l) => ({
    title: l.name,
    url: l.url,
    description: `${l.city} — covers ${l.jurisdiction}. Phone: ${l.phone}`,
    type: "website" as const,
  }));

  return {
    id: "union-signatory",
    title: `Union Signatory - ${state.name}`,
    description: `Ironworkers union locals and signatory process in ${state.name}`,
    icon: "Handshake",
    steps: [
      {
        id: `${state.code.toLowerCase()}-union-locals`,
        title: `Ironworkers Local Union${locals.length > 1 ? "s" : ""} in ${state.name}`,
        description: `${state.name} is covered by ${locals.length > 1 ? `${locals.length} ironworkers locals` : primaryLocal.name}. ${state.districtCouncil} oversees the area. ${state.unionNotes}`,
        estimatedTime: "1-2 weeks to make contact and start the process",
        estimatedCost: { min: 0, max: 500, notes: "Some locals may have nominal association fees" },
        checklist: [
          {
            id: "identify-local",
            label: `Identify your local: ${locals.map((l) => `${l.name} (${l.city})`).join(", ")}`,
            description: `${state.name} is covered by ${localsList}`,
            required: true,
          },
          {
            id: "call-business-agent",
            label: `Call the Business Agent at ${primaryLocal.name}`,
            description: `Phone: ${primaryLocal.phone}. Introduce yourself, explain you want to become a signatory contractor`,
            required: true,
          },
          {
            id: "visit-union-hall",
            label: "Visit the union hall in person",
            description: "Meet the Business Agent face-to-face — bring your contractor license, insurance, and business info",
            required: true,
          },
          {
            id: "request-cba-copy",
            label: "Request a copy of the current CBA",
            description: "Get the Collective Bargaining Agreement for your local's jurisdiction — review wages, fringes, and work rules",
            required: true,
          },
          {
            id: "understand-local-package",
            label: "Understand your local's total wage/fringe package",
            description: "Get the breakdown: base wage, pension, health & welfare, annuity, training fund, and any other contributions",
            required: true,
          },
          {
            id: "understand-dispatch",
            label: "Understand your local's dispatch/referral procedures",
            description: "Learn how to request workers, apprentice-to-journeyman ratios, and call-back rules",
            required: true,
          },
          ...(locals.length > 1
            ? [
                {
                  id: "multi-local",
                  label: `Determine which local covers your primary work area`,
                  description: `${state.name} has ${locals.length} locals with different jurisdictions — sign with the one covering where you'll do most work`,
                  required: true,
                },
              ]
            : []),
        ],
        resources: [
          ...resourceList,
          {
            title: "Ironworkers International — Find a Local",
            url: "https://www.ironworkers.org/",
            description: "Official directory of all ironworkers locals nationwide",
            type: "website" as const,
          },
          {
            title: "IMPACT — Ironworker Management Progressive Action Trust",
            url: "https://www.impact-net.org/",
            description: "Joint labor-management trust with free resources for signatory contractors",
            type: "website" as const,
          },
        ],
        tips: [
          `Your local: ${locals.map((l) => `${l.name} in ${l.city} (${l.phone})`).join("; ")}`,
          `${state.districtCouncil} oversees the locals in your area`,
          `${state.unionNotes}`,
          "Call the Business Agent directly — they're the decision-maker for signing new contractors",
          "Bring your contractor license, proof of insurance, and bonding info when you visit the hall",
          "Ask about upcoming projects that need ironwork subs — the BA knows who's bidding what",
          "IMPACT provides free resources: safety training, drug testing, estimating courses, and business development",
        ],
        warnings: [
          "Make sure you understand the full CBA before signing — it's legally binding for the full term (typically 3-5 years)",
          "Trust fund contributions are mandatory from your first hour — budget accordingly",
          "If your jurisdiction spans multiple locals, confirm which local covers each project location",
        ],
        stateSpecific: true,
        aiContext: `${state.name} ironworkers locals: ${localsList}. District Council: ${state.districtCouncil}. ${state.unionNotes}`,
      },
    ],
  };
}
