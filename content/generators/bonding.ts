import type { Phase } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateBonding(state: StateData): Phase {
  const bondDesc = state.stateBondRequired
    ? `${state.name} requires a contractor surety bond (${state.stateBondAmount}) as part of licensing. ${state.bondNotes}`
    : `${state.name} does not require a state-level contractor surety bond. ${state.bondNotes} However, project-level bonds (bid, performance, payment) are commonly required on public projects.`;

  return {
    id: "surety-bonding",
    title: `Surety Bonding - ${state.name}`,
    description: `${state.name}-specific bonding requirements`,
    icon: "Shield",
    steps: [
      {
        id: `${state.code.toLowerCase()}-bond-requirements`,
        title: `${state.name} Bond Requirements`,
        description: bondDesc,
        estimatedTime: "1-2 weeks to obtain",
        estimatedCost: {
          min: state.stateBondRequired ? 100 : 0,
          max: state.stateBondRequired ? 750 : 0,
          notes: state.stateBondRequired
            ? "Annual premium for license bond, based on credit"
            : "No state license bond required; project bonds priced per project",
        },
        checklist: [
          ...(state.stateBondRequired
            ? [
                { id: "license-bond", label: `Obtain ${state.name} contractor license bond (${state.stateBondAmount})`, description: "Required before license application", required: true },
                { id: "bond-filed", label: "Ensure bond is filed with licensing agency", description: "Your surety company files the bond directly", required: true },
              ]
            : [
                { id: "establish-relationship", label: "Establish bonding relationship with a surety agent", description: "Find a surety agent who specializes in construction", required: true },
              ]),
          { id: "project-bonds", label: "Understand project bond requirements", description: "Public projects typically require bid, performance, and payment bonds", required: true },
          { id: "bond-renewal", label: "Set up bond renewal reminders", description: "Bonds must remain active to maintain licensing and project compliance", required: true },
        ],
        resources: [
          { title: "SBA Surety Bond Guarantee Program", url: "https://www.sba.gov/funding-programs/surety-bonds", description: "SBA guarantees bonds for small contractors", type: "guide" },
          { title: "National Association of Surety Bond Producers", url: "https://www.nasbp.org/home", description: "Find a surety bond agent", type: "website" },
        ],
        tips: [
          state.stateBondRequired
            ? `${state.name} requires a ${state.stateBondAmount} contractor bond`
            : `${state.name} does not require a state license bond — focus on building project bonding capacity`,
          "With good credit (700+), bond premiums can be as low as 1-3% of bond amount",
          "The SBA Surety Bond Guarantee Program helps new contractors who can't get bonded elsewhere",
          "Start building a bonding relationship before you need it",
        ],
        warnings: [
          ...(state.stateBondRequired ? ["If your license bond lapses, your contractor license may be suspended"] : []),
          "A bond claim can seriously damage your ability to get bonded in the future",
          "Project bonds are required on most public projects regardless of state bond requirements",
        ],
        stateSpecific: true,
        aiContext: `${state.name} bonding. ${state.stateBondRequired ? `State bond required: ${state.stateBondAmount}. ${state.bondNotes}` : `No state license bond required. ${state.bondNotes}`} SBA bond guarantee program available.`,
      },
    ],
  };
}
