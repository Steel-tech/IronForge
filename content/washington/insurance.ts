import type { Phase } from "@/lib/types/content";

export const waInsurance: Phase = {
  id: "insurance",
  title: "Insurance - Washington",
  description: "Washington-specific insurance requirements",
  icon: "ShieldCheck",
  steps: [
    {
      id: "wa-workers-comp",
      title: "Washington Workers' Compensation (L&I State Fund)",
      description:
        "Washington is a monopolistic state fund state for workers' comp - you MUST get your workers' comp through L&I (Department of Labor & Industries). You cannot buy it from a private carrier. This applies if you have any employees. As an LLC member/owner, you may be able to exempt yourself, but you'll still need coverage for employees.",
      estimatedTime: "1-2 weeks to set up",
      estimatedCost: { min: 3000, max: 15000, notes: "Varies significantly by payroll and classification - ironwork rates are high" },
      checklist: [
        {
          id: "wa-li-account",
          label: "Open L&I Industrial Insurance account",
          description: "Required before hiring any employees",
          required: true,
          link: "https://lni.wa.gov/insurance/",
        },
        {
          id: "wa-classification",
          label: "Determine your risk classification",
          description: "Ironwork classifications have some of the highest rates - know your classification code",
          required: true,
        },
        {
          id: "wa-quarterly-reports",
          label: "Set up quarterly reporting and payment",
          description: "Premium is paid quarterly based on hours worked per classification",
          required: true,
        },
        {
          id: "wa-owner-exemption",
          label: "Decide on LLC member/owner exemption",
          description: "LLC members can exempt themselves but lose L&I coverage for own injuries",
          required: false,
        },
      ],
      resources: [
        {
          title: "WA L&I - Workers' Compensation",
          url: "https://lni.wa.gov/insurance/",
          description: "Set up and manage your industrial insurance account",
          type: "form",
        },
        {
          title: "WA L&I - Rate Lookup",
          url: "https://lni.wa.gov/insurance/rates-risk-classes/",
          description: "Look up workers' comp rates by risk class",
          type: "website",
        },
      ],
      tips: [
        "WA is a state-fund only state - no private carrier option for workers' comp",
        "Ironwork classifications have some of the highest rates in construction - budget accordingly",
        "You can reduce rates over time through the Retro program or good experience modification",
        "Consider joining a retrospective rating group (Retro) for potential premium refunds",
      ],
      warnings: [
        "Operating without L&I coverage when required can result in criminal penalties",
        "If you exempt yourself as an LLC member, you have NO workers' comp coverage for your own injuries",
        "L&I audits are common - keep accurate time and payroll records by classification",
      ],
      stateSpecific: true,
      aiContext:
        "WA workers' comp through L&I state fund ONLY (monopolistic). Ironwork rates among highest. Quarterly reporting. LLC members can exempt themselves. Retro program available for premium reduction.",
    },
  ],
};
