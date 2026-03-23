import type { Phase } from "@/lib/types/content";

export const orCertifications: Phase = {
  id: "certifications",
  title: "Certifications - Oregon",
  description: "Oregon state-specific certifications",
  icon: "Award",
  steps: [
    {
      id: "or-cobid",
      title: "Oregon COBID Certification",
      description:
        "The Certification Office for Business Inclusion and Diversity (COBID) is Oregon's program for certifying minority, women, disadvantaged, and emerging small businesses. COBID certification is used by Oregon state agencies and many local governments for contract diversity goals. It's similar to Washington's OMWBE.",
      estimatedTime: "2-3 months",
      estimatedCost: { min: 0, max: 0, notes: "Free to apply" },
      checklist: [
        {
          id: "cobid-eligibility",
          label: "Verify COBID eligibility",
          description: "MBE, WBE, ESB (Emerging Small Business), or DBE categories",
          required: true,
        },
        {
          id: "cobid-application",
          label: "Submit COBID application",
          description: "Online application through Oregon COBID portal",
          required: true,
          link: "https://www.oregon.gov/biz/programs/cobid/Pages/default.aspx",
        },
        {
          id: "cobid-docs",
          label: "Gather supporting documentation",
          description: "Business docs, tax returns, personal financial statement",
          required: true,
        },
      ],
      resources: [
        {
          title: "Oregon COBID",
          url: "https://www.oregon.gov/biz/programs/cobid/Pages/default.aspx",
          description: "Oregon certification program for diverse businesses",
          type: "form",
        },
        {
          title: "Oregon COBID - Certification Types",
          url: "https://www.oregon.gov/biz/programs/cobid/Pages/default.aspx",
          description: "Overview of COBID certification categories",
          type: "guide",
        },
      ],
      tips: [
        "COBID ESB (Emerging Small Business) is available to any small business - not just minority/women-owned",
        "Many Oregon public projects have COBID participation goals",
        "COBID certification is recognized by most Oregon local governments",
        "GCs on public projects actively recruit COBID-certified subcontractors",
      ],
      warnings: [
        "Certification requires renewal - maintain accurate records",
        "ESB has revenue limits that vary by NAICS code - verify you qualify",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon COBID certification. MBE, WBE, ESB, DBE categories. ESB available to any small business (revenue limits). Free to apply. Used for Oregon public project diversity goals.",
    },
  ],
};
