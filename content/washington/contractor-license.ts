import type { Phase } from "@/lib/types/content";

export const waContractorLicense: Phase = {
  id: "contractor-licensing",
  title: "Contractor Licensing",
  description: "Register as a contractor with Washington L&I",
  icon: "ClipboardCheck",
  steps: [
    {
      id: "li-registration",
      title: "Register with WA Department of Labor & Industries",
      description:
        "In Washington, all contractors must register with the Department of Labor & Industries (L&I). This is your state contractor registration - without it, you cannot legally perform construction work. The registration must be renewed annually.",
      estimatedTime: "1-2 weeks",
      estimatedCost: { min: 171, max: 172, notes: "WA contractor registration fee ~$171.70/year" },
      checklist: [
        {
          id: "wa-ubi-active",
          label: "Ensure your WA UBI/Business License is active",
          description: "Required before applying for contractor registration",
          required: true,
        },
        {
          id: "obtain-bond",
          label: "Obtain a surety bond ($12,000 minimum for general)",
          description: "Required before L&I registration - get this from a surety company first",
          required: true,
        },
        {
          id: "obtain-insurance",
          label: "Obtain liability insurance",
          description: "Must have current GL insurance before registration",
          required: true,
        },
        {
          id: "apply-registration",
          label: "Submit contractor registration application to L&I",
          description: "Apply online through L&I Contractor Registration portal",
          required: true,
          link: "https://lni.wa.gov/licensing-permits/contractors/register-as-a-contractor/",
        },
        {
          id: "industrial-insurance",
          label: "Open an Industrial Insurance (workers' comp) account with L&I",
          description: "Required if you will have any employees (including yourself in some cases)",
          required: true,
        },
      ],
      resources: [
        {
          title: "WA L&I - Register as a Contractor",
          url: "https://lni.wa.gov/licensing-permits/contractors/register-as-a-contractor/",
          description: "Official registration page and requirements",
          type: "form",
        },
        {
          title: "WA L&I - Contractor Registration Requirements",
          url: "https://lni.wa.gov/licensing-permits/contractors/",
          description: "Overview of all contractor requirements",
          type: "guide",
        },
        {
          title: "WA L&I - Verify a Contractor",
          url: "https://secure.lni.wa.gov/verify/",
          description: "Look up registered contractors",
          type: "website",
        },
      ],
      tips: [
        "Get your bond and insurance FIRST - you need proof of both to register",
        "Registration must be renewed annually - set a calendar reminder",
        "Your L&I contractor registration number will be required on all bids and contracts",
        "WA is strict about unlicensed contracting - fines can be $10,000+ per violation",
      ],
      warnings: [
        "Working without registration is illegal in WA and carries heavy penalties",
        "Your registration is tied to your surety bond - if the bond lapses, your registration is suspended",
        "Advertising construction services without registration can result in fines even if you haven't done any work",
      ],
      stateSpecific: true,
      aiContext:
        "WA contractor registration through L&I. Fee ~$171.70/yr. Requires active UBI, surety bond ($12K min for general), and liability insurance. Registration number required on all bids/contracts. Strict enforcement.",
    },
    {
      id: "specialty-classifications",
      title: "Understand Specialty Classifications for Ironwork",
      description:
        "Washington uses specialty trade codes to classify contractors. For structural steel and ironwork, you need to understand which classifications apply to your planned services. This affects your bond requirements and what work you can legally perform.",
      estimatedTime: "1-2 hours research",
      estimatedCost: { min: 0, max: 0, notes: "No additional cost - included in registration" },
      checklist: [
        {
          id: "identify-specialty",
          label: "Identify your specialty trade classification",
          description: "Structural Steel Erection, Ornamental Iron, Reinforcing Steel, etc.",
          required: true,
        },
        {
          id: "general-vs-specialty",
          label: "Decide: General Contractor vs Specialty Contractor registration",
          description: "General allows broader work scope but requires more bonding",
          required: true,
        },
        {
          id: "review-scope",
          label: "Review scope of work limitations for your classification",
          description: "Ensure your classification covers all the ironwork services you plan to offer",
          required: true,
        },
      ],
      resources: [
        {
          title: "WA L&I - Contractor Specialty Descriptions",
          url: "https://lni.wa.gov/licensing-permits/contractors/register-as-a-contractor/contractor-specialty-descriptions",
          description: "Complete list of specialty trade classifications",
          type: "guide",
        },
      ],
      tips: [
        "Most ironwork contractors start as specialty contractors - lower bond requirement ($6,000 vs $12,000 for general)",
        "You can add specialties to your registration as you expand services",
        "Common ironwork specialties: Structural Steel Erection, Reinforcing Steel, Ornamental/Misc Iron",
        "If you plan to bid as a general contractor on steel projects, you'll need the general classification",
      ],
      warnings: [
        "Performing work outside your registered specialty is a violation",
        "Make sure your classification covers ALL the work types you plan to bid on",
      ],
      stateSpecific: true,
      aiContext:
        "WA contractor specialties for ironwork. Specialty bond is $6K, general is $12K. Common codes: Structural Steel Erection, Reinforcing Steel, Ornamental Iron, Misc Metals.",
    },
    {
      id: "prevailing-wage",
      title: "Prevailing Wage Registration",
      description:
        "If you plan to work on public projects (government buildings, bridges, schools), you must comply with prevailing wage laws. Washington has its own prevailing wage requirements in addition to federal Davis-Bacon. This is where the good money is for ironworkers.",
      estimatedTime: "1-2 hours to understand",
      estimatedCost: { min: 0, max: 0, notes: "No registration cost - compliance requirements" },
      checklist: [
        {
          id: "understand-prevailing",
          label: "Understand WA prevailing wage requirements",
          description: "State prevailing wages apply to public works projects over $2,500",
          required: true,
        },
        {
          id: "davis-bacon",
          label: "Understand federal Davis-Bacon requirements",
          description: "Federal prevailing wages apply to federally funded projects over $2,000",
          required: true,
        },
        {
          id: "certified-payroll",
          label: "Set up certified payroll reporting capability",
          description: "You'll need to submit certified payroll for prevailing wage projects",
          required: true,
        },
        {
          id: "intent-affidavit",
          label: "Understand Intent and Affidavit filing requirements",
          description: "Must file Statement of Intent before starting and Affidavit of Wages Paid after completion",
          required: true,
          link: "https://lni.wa.gov/licensing-permits/public-works-projects/",
        },
      ],
      resources: [
        {
          title: "WA L&I - Public Works / Prevailing Wage",
          url: "https://lni.wa.gov/licensing-permits/public-works-projects/",
          description: "Prevailing wage requirements and rates",
          type: "website",
        },
        {
          title: "WA Prevailing Wage Rate Lookup",
          url: "https://lni.wa.gov/licensing-permits/public-works-projects/prevailing-wage-rates/",
          description: "Look up current prevailing wage rates by trade and county",
          type: "website",
        },
        {
          title: "US DOL - Davis-Bacon Wage Determinations",
          url: "https://sam.gov/content/wage-determinations",
          description: "Federal prevailing wage rates",
          type: "website",
        },
      ],
      tips: [
        "Prevailing wage ironwork jobs pay significantly more than private work",
        "Learn certified payroll early - it's required and audited on public projects",
        "Ironwork prevailing wage rates in WA are among the highest in construction trades",
        "Many public projects also require apprentice utilization - plan for this",
      ],
      warnings: [
        "Prevailing wage violations can result in debarment from public works",
        "Intent and Affidavit forms must be filed or you can be penalized",
        "Keep meticulous time and payroll records for all public projects",
      ],
      stateSpecific: true,
      aiContext:
        "WA prevailing wage for ironwork. State prevailing wage applies to public works >$2,500. Federal Davis-Bacon for federally funded >$2,000. Intent/Affidavit filing required. Ironwork rates among highest in construction trades.",
    },
  ],
};
