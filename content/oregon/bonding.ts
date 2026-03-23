import type { Phase } from "@/lib/types/content";

export const orBonding: Phase = {
  id: "surety-bonding",
  title: "Surety Bonding - Oregon",
  description: "Oregon-specific bonding requirements",
  icon: "Shield",
  steps: [
    {
      id: "or-bond-requirements",
      title: "Oregon CCB Bond Requirements",
      description:
        "Oregon CCB requires a surety bond as part of licensing. Commercial contractors need a minimum $20,000 bond. Commercial General contractors need $75,000. Residential contractors need $20,000. These minimums are higher than Washington's.",
      estimatedTime: "1-2 weeks to obtain",
      estimatedCost: { min: 200, max: 750, notes: "Annual premium based on credit and bond amount" },
      checklist: [
        {
          id: "or-license-bond",
          label: "Obtain OR CCB contractor license bond",
          description: "Commercial Specialty: $20K, Commercial General: $75K minimum",
          required: true,
        },
        {
          id: "or-bond-filed",
          label: "Ensure bond is filed with CCB",
          description: "Your surety company files the bond directly with CCB",
          required: true,
        },
        {
          id: "or-bond-renewal",
          label: "Set up bond renewal reminders",
          description: "Bond must remain active for your CCB license to stay current",
          required: true,
        },
      ],
      resources: [
        {
          title: "Oregon CCB - Bond Requirements",
          url: "https://www.oregon.gov/ccb/Pages/index.aspx",
          description: "Official bond requirements for OR contractors",
          type: "guide",
        },
      ],
      tips: [
        "Oregon's $20K minimum is higher than WA's $12K - budget accordingly",
        "If pursuing CGC endorsement, you'll need $75K bond - significantly more expensive",
        "Good credit makes a huge difference in premium - aim for 700+",
      ],
      warnings: [
        "Bond lapse = automatic CCB license suspension",
        "CCB bond requirements may increase - check current amounts before applying",
      ],
      stateSpecific: true,
      aiContext:
        "OR CCB bond: Commercial Specialty $20K, Commercial General $75K. Premium typically $200-$750/yr. Filed with CCB. Higher minimums than WA.",
    },
  ],
};
