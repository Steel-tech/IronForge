// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";

export const waCertifications: Phase = {
  id: "certifications",
  title: "Certifications - Washington",
  description: "Washington state-specific certifications",
  icon: "Award",
  steps: [
    {
      id: "wa-omwbe",
      title: "WA OMWBE Certification",
      description:
        "The Washington Office of Minority and Women's Business Enterprises (OMWBE) certifies minority, women, and socially/economically disadvantaged business owners. This certification gives you access to state contract set-asides and participation goals on state-funded projects. Many GCs and agencies actively seek OMWBE-certified subcontractors.",
      estimatedTime: "2-3 months",
      estimatedCost: { min: 0, max: 0, notes: "Free to apply" },
      checklist: [
        {
          id: "omwbe-eligibility",
          label: "Verify OMWBE eligibility",
          description: "Must be 51%+ owned by minority, woman, or socially disadvantaged individual",
          required: true,
        },
        {
          id: "omwbe-application",
          label: "Submit OMWBE application",
          description: "Online application through OMWBE portal",
          required: true,
          link: "https://omwbe.wa.gov/certification",
        },
        {
          id: "omwbe-docs",
          label: "Gather supporting documentation",
          description: "Business formation docs, tax returns, personal net worth statement",
          required: true,
        },
      ],
      resources: [
        {
          title: "WA OMWBE - Certification",
          url: "https://omwbe.wa.gov/certification",
          description: "Apply for OMWBE certification",
          type: "form",
        },
        {
          title: "WA OMWBE - Certification Types",
          url: "https://omwbe.wa.gov/certification",
          description: "MBE, WBE, SEDBE, and combined certifications",
          type: "guide",
        },
      ],
      tips: [
        "OMWBE certification opens doors to WA state agency contracts with diversity goals",
        "Many large GCs on public projects actively seek OMWBE subcontractors to meet goals",
        "OMWBE certifies MBE, WBE, and SEDBE (Socially and Economically Disadvantaged)",
        "Certification is portable - many local governments accept OMWBE certification",
      ],
      warnings: [
        "Certification requires annual renewal - don't let it lapse",
        "The review process includes site visits - be prepared",
      ],
      stateSpecific: true,
      aiContext:
        "WA OMWBE certification. MBE, WBE, SEDBE categories. Free to apply. Required for WA state diversity goals. Many GCs seek OMWBE subs. Annual renewal required.",
    },
  ],
};
