import type { Phase } from "@/lib/types/content";

export const waBonding: Phase = {
  id: "surety-bonding",
  title: "Surety Bonding - Washington",
  description: "Washington-specific bonding requirements",
  icon: "Shield",
  steps: [
    {
      id: "wa-bond-requirements",
      title: "Washington Bond Requirements",
      description:
        "Washington requires a contractor surety bond as part of L&I registration. General contractors need a minimum $12,000 bond. Specialty contractors need a minimum $6,000 bond. This is separate from bid/performance/payment bonds on individual projects.",
      estimatedTime: "1-2 weeks to obtain",
      estimatedCost: { min: 100, max: 500, notes: "Annual premium for license bond, based on credit" },
      checklist: [
        {
          id: "wa-license-bond",
          label: "Obtain WA contractor license bond",
          description: "General: $12,000 minimum, Specialty: $6,000 minimum",
          required: true,
        },
        {
          id: "wa-bond-filed",
          label: "Ensure bond is filed with L&I",
          description: "Your surety company files the bond directly with L&I",
          required: true,
        },
        {
          id: "wa-bond-renewal",
          label: "Set up bond renewal reminders",
          description: "Bond must remain active for your registration to stay current",
          required: true,
        },
      ],
      resources: [
        {
          title: "WA L&I - Contractor Bond Requirements",
          url: "https://lni.wa.gov/licensing-permits/contractors/register-as-a-contractor/bond-insurance-requirements",
          description: "Official bond requirements for WA contractors",
          type: "guide",
        },
      ],
      tips: [
        "With good credit (700+), your license bond premium can be as low as $100-$200/year",
        "Shop multiple surety companies - rates vary significantly",
        "Your license bond is separate from project bonds - don't confuse them",
      ],
      warnings: [
        "If your bond lapses, your contractor registration is automatically suspended",
        "A bond claim affects your ability to get bonded in the future",
      ],
      stateSpecific: true,
      aiContext:
        "WA license bond: General $12K, Specialty $6K. Premium typically $100-$500/yr based on credit. Filed with L&I by surety company. Bond lapse = registration suspension.",
    },
  ],
};
