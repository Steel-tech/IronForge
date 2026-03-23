import type { Phase } from "@/lib/types/content";

export const federalCertifications: Phase = {
  id: "certifications",
  title: "Certifications & Set-Asides",
  description: "Federal small business certifications for competitive advantage",
  icon: "Award",
  steps: [
    {
      id: "sam-gov-registration",
      title: "SAM.gov Registration (Required First)",
      description:
        "Before pursuing any federal certification, you must register on SAM.gov (System for Award Management). This is the gateway to all federal contracting. Registration is free and takes about an hour to complete, but it can take 2-4 weeks to be processed and activated. You'll automatically receive a CAGE code during registration.",
      estimatedTime: "1 hour to complete, 2-4 weeks to process",
      estimatedCost: { min: 0, max: 0, notes: "Completely free - never pay for SAM.gov registration" },
      checklist: [
        {
          id: "create-sam-account",
          label: "Create account on SAM.gov",
          description: "Use your EIN and DUNS/UEI number",
          required: true,
          link: "https://sam.gov/",
        },
        {
          id: "get-uei",
          label: "Get your Unique Entity ID (UEI)",
          description: "Assigned automatically during SAM.gov registration (replaced DUNS)",
          required: true,
        },
        {
          id: "complete-registration",
          label: "Complete entity registration",
          description: "Enter business info, NAICS codes, banking info for electronic payments",
          required: true,
        },
        {
          id: "naics-codes",
          label: "Add relevant NAICS codes",
          description: "238120 (Structural Steel/Precast Concrete), 238190 (Other Foundation/Exterior), 332312 (Fabricated Structural Metal)",
          required: true,
        },
        {
          id: "annual-renewal",
          label: "Set annual renewal reminder",
          description: "SAM.gov registration must be renewed annually - set it and don't forget",
          required: true,
        },
      ],
      resources: [
        {
          title: "SAM.gov",
          url: "https://sam.gov/",
          description: "System for Award Management - federal contractor registration",
          type: "form",
        },
        {
          title: "SAM.gov Help Guide",
          url: "https://sam.gov/content/entity-registration",
          description: "Step-by-step registration guide",
          type: "guide",
        },
        {
          title: "Census Bureau - NAICS Search",
          url: "https://data.census.gov/cedsci/",
          description: "Look up NAICS codes for your services",
          type: "website",
        },
      ],
      tips: [
        "Start SAM.gov registration early - processing takes 2-4 weeks and you can't apply for certifications without it",
        "NAICS 238120 is your primary code for structural steel erection",
        "Also add secondary codes: 238190, 332312, 332311 to capture more opportunity searches",
        "Your UEI replaces the old DUNS number - it's assigned during SAM.gov registration",
        "Never pay anyone to register on SAM.gov - it's always free",
      ],
      warnings: [
        "SAM.gov registration expires annually - if it lapses, you can't bid on or receive federal contracts",
        "There are scam websites that look like SAM.gov and charge fees - always go to sam.gov directly",
        "Banking info errors can delay registration - double-check account and routing numbers",
      ],
      stateSpecific: false,
      aiContext:
        "SAM.gov registration. Free. 2-4 week processing. Required for all federal contracting and certifications. UEI assigned automatically. NAICS 238120 primary for structural steel. Annual renewal required.",
    },
    {
      id: "sdvosb",
      title: "SDVOSB Certification (Service-Disabled Veteran)",
      description:
        "If you're a service-disabled veteran, SDVOSB certification is one of the most powerful set-asides available. The federal government has a 3% goal for SDVOSB contracts across all agencies. The certification is now managed by SBA (transferred from VA in January 2023). You must own at least 51% of the business and control day-to-day operations.",
      estimatedTime: "2-4 months for certification",
      estimatedCost: { min: 0, max: 0, notes: "Free to apply through SBA" },
      checklist: [
        {
          id: "verify-eligibility",
          label: "Verify SDVOSB eligibility",
          description: "Must have service-connected disability rating from VA (any percentage)",
          required: true,
        },
        {
          id: "51-percent-ownership",
          label: "Verify 51%+ ownership by service-disabled veteran",
          description: "The veteran must own and control the business",
          required: true,
        },
        {
          id: "apply-sba-veterans",
          label: "Apply through SBA Veteran Small Business Certification",
          description: "Online application through certify.sba.gov",
          required: true,
          link: "https://veterans.certify.sba.gov/",
        },
        {
          id: "gather-va-docs",
          label: "Gather VA documentation",
          description: "VA disability rating letter, DD-214, business formation documents",
          required: true,
        },
      ],
      resources: [
        {
          title: "SBA Veteran Small Business Certification",
          url: "https://veterans.certify.sba.gov/",
          description: "Apply for SDVOSB or VOSB certification",
          type: "form",
        },
        {
          title: "VA - eBenefits",
          url: "https://www.va.gov/records/",
          description: "Access your VA disability rating and documents",
          type: "website",
        },
      ],
      tips: [
        "SDVOSB is one of the strongest certifications for federal construction - 3% government-wide goal",
        "Any VA disability percentage qualifies - even 0% (service-connected) counts",
        "You can stack SDVOSB with 8(a) and HUBZone for maximum set-aside opportunities",
        "VA medical centers specifically seek SDVOSB contractors for their projects",
        "The Vets First program at VA gives SDVOSB firms priority on VA contracts",
      ],
      warnings: [
        "Certification now goes through SBA, not VA - make sure you're applying at the right place",
        "The veteran must actually control day-to-day operations - 'front' companies are investigated",
        "Misrepresenting SDVOSB status is a federal crime with severe penalties",
      ],
      stateSpecific: false,
      aiContext:
        "SDVOSB certification through SBA (formerly VA). Any service-connected disability %. 51% veteran ownership required. 3% federal goal. Free to apply. Stacks with 8(a) and HUBZone. VA Vets First priority for VA contracts.",
    },
    {
      id: "sba-8a",
      title: "SBA 8(a) Business Development Program",
      description:
        "The 8(a) program is a 9-year business development program for socially and economically disadvantaged small businesses. It provides access to sole-source contracts (up to $4.5M for construction), mentoring, training, and federal contract set-asides. This is arguably the most valuable certification for a qualifying contractor.",
      estimatedTime: "3-6 months for certification",
      estimatedCost: { min: 0, max: 5000, notes: "Free to apply; consider consulting help ($2K-$5K) for application assistance" },
      checklist: [
        {
          id: "8a-eligibility",
          label: "Verify 8(a) eligibility",
          description: "Must be socially and economically disadvantaged, small business, good character, in business 2+ years",
          required: true,
        },
        {
          id: "8a-social-disadvantage",
          label: "Document social disadvantage",
          description: "Certain racial/ethnic groups presumed; veterans and others can demonstrate",
          required: true,
        },
        {
          id: "8a-economic-disadvantage",
          label: "Verify economic disadvantage",
          description: "Personal net worth under $850K (excluding primary residence and business equity)",
          required: true,
        },
        {
          id: "8a-application",
          label: "Submit 8(a) application through certify.sba.gov",
          description: "Comprehensive application with business plan, financials, personal info",
          required: true,
          link: "https://certify.sba.gov/",
        },
      ],
      resources: [
        {
          title: "SBA 8(a) Business Development Program",
          url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program",
          description: "Program overview and eligibility",
          type: "guide",
        },
        {
          title: "SBA Certify Portal",
          url: "https://certify.sba.gov/",
          description: "Apply for 8(a) certification",
          type: "form",
        },
      ],
      tips: [
        "8(a) sole-source threshold for construction is $4.5M - you can get contracts without competitive bidding",
        "The program is 9 years total - first 4 years are developmental, last 5 are transitional",
        "8(a) + SDVOSB is an extremely powerful combination for federal construction",
        "SBA assigns each 8(a) firm a Business Opportunity Specialist (BOS) who helps you find contracts",
        "Consider hiring an 8(a) consultant to help with the application - it's complex but worth it",
      ],
      warnings: [
        "The application is intensive - plan on 40+ hours to prepare",
        "You must be in business for at least 2 years before applying (waiver possible in some cases)",
        "Annual reviews are required - you must demonstrate good faith effort to win contracts",
        "Misrepresentation in the application is grounds for termination and potential fraud charges",
      ],
      stateSpecific: false,
      aiContext:
        "SBA 8(a) program. 9-year program. Sole-source up to $4.5M for construction. Socially/economically disadvantaged. Net worth <$850K. 2+ years in business. Free to apply. Most valuable certification for qualifying contractors.",
    },
    {
      id: "hubzone",
      title: "HUBZone Certification",
      description:
        "HUBZone (Historically Underutilized Business Zones) certification provides access to federal set-aside contracts if your business is located in and employs people from designated HUBZone areas. The government has a 3% goal for HUBZone contracts. Check the HUBZone map to see if you qualify based on your business address.",
      estimatedTime: "2-3 months for certification",
      estimatedCost: { min: 0, max: 0, notes: "Free to apply through SBA" },
      checklist: [
        {
          id: "hubzone-map-check",
          label: "Check if your address is in a HUBZone",
          description: "Use the SBA HUBZone map tool to verify eligibility",
          required: true,
          link: "https://maps.certify.sba.gov/hubzone/map",
        },
        {
          id: "hubzone-employee-req",
          label: "Verify employee residency requirements",
          description: "At least 35% of employees must live in a HUBZone area",
          required: true,
        },
        {
          id: "hubzone-application",
          label: "Apply through certify.sba.gov",
          description: "Online application with business location and employee documentation",
          required: true,
          link: "https://certify.sba.gov/",
        },
      ],
      resources: [
        {
          title: "SBA HUBZone Map",
          url: "https://maps.certify.sba.gov/hubzone/map",
          description: "Interactive map to check HUBZone eligibility by address",
          type: "website",
        },
        {
          title: "SBA HUBZone Program",
          url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program",
          description: "Program overview and requirements",
          type: "guide",
        },
      ],
      tips: [
        "Many industrial and rural areas qualify as HUBZones - check even if you don't think you're in one",
        "HUBZone + SDVOSB + 8(a) is the strongest possible combination for federal contracting",
        "You can relocate your business to a HUBZone to qualify",
        "3% federal goal means significant contract opportunities",
      ],
      warnings: [
        "HUBZone designations can change - verify annually that your area still qualifies",
        "35% employee residency requirement is strictly enforced",
        "Recertification is required every 3 years",
      ],
      stateSpecific: false,
      aiContext:
        "HUBZone certification. Business must be in HUBZone area. 35% of employees must reside in HUBZone. 3% federal goal. Free to apply. Designations can change.",
    },
    {
      id: "dbe-mbe",
      title: "DBE/MBE Certification",
      description:
        "Disadvantaged Business Enterprise (DBE) and Minority Business Enterprise (MBE) certifications open doors to state and federal transportation contracts (USDOT), as well as state/local government contracts with diversity requirements. If you're a minority business owner, these certifications can be a significant competitive advantage.",
      estimatedTime: "2-4 months",
      estimatedCost: { min: 0, max: 0, notes: "Free to apply" },
      checklist: [
        {
          id: "dbe-eligibility",
          label: "Verify DBE eligibility",
          description: "51%+ owned by socially/economically disadvantaged individuals, personal net worth <$1.32M",
          required: true,
        },
        {
          id: "dbe-application",
          label: "Apply through your state's Unified Certification Program (UCP)",
          description: "One application covers DOT-assisted contracts statewide",
          required: true,
        },
        {
          id: "annual-affidavit",
          label: "Understand annual affidavit requirements",
          description: "Must submit annual affidavit to maintain certification",
          required: true,
        },
      ],
      resources: [
        {
          title: "USDOT - DBE Program",
          url: "https://www.transportation.gov/civil-rights/disadvantaged-business-enterprise",
          description: "Federal DBE program overview",
          type: "guide",
        },
      ],
      tips: [
        "DBE certification is especially valuable for bridge and transportation infrastructure projects",
        "Many state DOT projects have DBE participation goals of 10-20%+",
        "GCs actively seek DBE-certified subcontractors to meet their goals",
        "One UCP application covers all DOT-assisted contracts in your state",
      ],
      warnings: [
        "DBE certification is separate from 8(a) - you may need both",
        "Annual no-change affidavit is required - don't miss it",
        "Personal net worth limit of $1.32M (excluding primary residence and business equity)",
      ],
      stateSpecific: false,
      aiContext:
        "DBE/MBE certification. 51% ownership by disadvantaged individuals. Net worth <$1.32M. Critical for DOT transportation projects. UCP application covers statewide. Annual affidavit required.",
    },
  ],
};
