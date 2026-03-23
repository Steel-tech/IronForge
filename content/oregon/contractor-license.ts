import type { Phase } from "@/lib/types/content";

export const orContractorLicense: Phase = {
  id: "contractor-licensing",
  title: "Contractor Licensing",
  description: "Get your Oregon CCB contractor license",
  icon: "ClipboardCheck",
  steps: [
    {
      id: "ccb-license",
      title: "Apply for Oregon CCB Contractor License",
      description:
        "Oregon requires all contractors to be licensed through the Construction Contractors Board (CCB). The CCB license is more involved than Washington's registration - it requires passing an exam, having a surety bond, and carrying liability insurance. The license is valid for 2 years.",
      estimatedTime: "2-4 weeks",
      estimatedCost: { min: 325, max: 325, notes: "CCB license fee $325 for 2-year period" },
      checklist: [
        {
          id: "ccb-exam",
          label: "Study for and pass the CCB exam",
          description: "Oregon requires passing the CCB law exam before licensure",
          required: true,
        },
        {
          id: "obtain-bond",
          label: "Obtain surety bond ($20,000 minimum for commercial)",
          description: "Required before CCB application - higher than WA requirements",
          required: true,
        },
        {
          id: "obtain-insurance",
          label: "Obtain general liability insurance ($500K/$1M minimum)",
          description: "Must file certificate directly with CCB",
          required: true,
        },
        {
          id: "workers-comp",
          label: "Set up workers' compensation insurance",
          description: "Through SAIF Corporation or private carrier - required if you have employees",
          required: true,
        },
        {
          id: "submit-application",
          label: "Submit CCB license application",
          description: "Include all required documentation, bond, and insurance certificates",
          required: true,
          link: "https://www.oregon.gov/ccb/Pages/index.aspx",
        },
      ],
      resources: [
        {
          title: "Oregon CCB - Become a Licensed Contractor",
          url: "https://www.oregon.gov/ccb/Pages/index.aspx",
          description: "Official guide for new contractor licensing",
          type: "guide",
        },
        {
          title: "Oregon CCB - Exam Information",
          url: "https://www.oregon.gov/ccb/Pages/index.aspx",
          description: "CCB exam study materials and scheduling",
          type: "website",
        },
        {
          title: "Oregon CCB - License Lookup",
          url: "https://www.oregon.gov/ccb/Pages/index.aspx",
          description: "Verify contractor licenses",
          type: "website",
        },
      ],
      tips: [
        "Study the Oregon Contractors Reference Manual for the exam - it covers construction law",
        "The CCB exam is open book - but know the material well enough to find answers quickly",
        "Oregon bond minimum ($20K) is higher than WA ($12K) - budget accordingly",
        "Get your bond and insurance lined up before scheduling your exam",
      ],
      warnings: [
        "Working without a CCB license in Oregon can result in fines up to $5,000 per violation",
        "Your CCB license must be renewed every 2 years - don't let it lapse",
        "CCB requires continuing education for renewal - plan ahead",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon CCB licensing. $325 for 2-year license. Requires passing CCB law exam, $20K surety bond (commercial), GL insurance ($500K/$1M min), workers' comp if employees. Exam is open book on OR construction law.",
    },
    {
      id: "endorsement-types",
      title: "CCB Endorsement Types for Ironwork",
      description:
        "Oregon CCB licenses have different endorsement categories. For structural steel and ironwork, you need to understand which endorsement type covers your planned services. Commercial endorsement is most common for ironwork contractors.",
      estimatedTime: "1-2 hours research",
      estimatedCost: { min: 0, max: 0, notes: "Included in license fee" },
      checklist: [
        {
          id: "choose-endorsement",
          label: "Determine correct endorsement type",
          description: "Commercial General (CGC), Commercial Specialty (CSC), or Residential endorsements",
          required: true,
        },
        {
          id: "structural-category",
          label: "Identify structural steel category requirements",
          description: "Most ironwork falls under Commercial Specialty - structural steel/iron",
          required: true,
        },
        {
          id: "scope-review",
          label: "Review scope of work for your endorsement",
          description: "Ensure your endorsement covers all services you plan to offer",
          required: true,
        },
      ],
      resources: [
        {
          title: "Oregon CCB - License Categories",
          url: "https://www.oregon.gov/ccb/Pages/index.aspx",
          description: "Complete list of CCB endorsement categories",
          type: "guide",
        },
      ],
      tips: [
        "Commercial Specialty Contractor (CSC) is the typical endorsement for ironwork",
        "If you want to bid as a general contractor on steel projects, you'll need the Commercial General (CGC) endorsement",
        "CGC endorsement has higher bond requirements ($75K vs $20K for specialty)",
        "You can add endorsements to your license as you grow",
      ],
      warnings: [
        "Performing work outside your endorsement scope can result in license action",
        "CGC endorsement requires significantly more bonding capacity ($75K minimum)",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon CCB endorsements. CSC (Commercial Specialty) typical for ironwork, $20K bond. CGC (Commercial General) for GC work, $75K bond. Can add endorsements to existing license.",
    },
    {
      id: "prevailing-wage-or",
      title: "Oregon Prevailing Wage (BOLI)",
      description:
        "Oregon's Bureau of Labor and Industries (BOLI) administers prevailing wage for public works projects. If you plan to bid on public projects - schools, bridges, government buildings - you must pay prevailing wages. This is separate from federal Davis-Bacon requirements.",
      estimatedTime: "1-2 hours to understand",
      estimatedCost: { min: 0, max: 0, notes: "No registration cost" },
      checklist: [
        {
          id: "understand-boli",
          label: "Understand Oregon BOLI prevailing wage requirements",
          description: "Applies to public works projects over $50,000",
          required: true,
        },
        {
          id: "davis-bacon-or",
          label: "Understand federal Davis-Bacon requirements",
          description: "Federal prevailing wages for federally funded projects over $2,000",
          required: true,
        },
        {
          id: "certified-payroll-or",
          label: "Set up certified payroll capability",
          description: "Required for all prevailing wage projects",
          required: true,
        },
      ],
      resources: [
        {
          title: "Oregon BOLI - Prevailing Wage Rates",
          url: "https://www.oregon.gov/boli/Pages/index.aspx",
          description: "Current prevailing wage rates by trade and region",
          type: "website",
        },
        {
          title: "Oregon BOLI - Public Works",
          url: "https://www.oregon.gov/boli/Pages/index.aspx",
          description: "Employer guide for public works requirements",
          type: "guide",
        },
      ],
      tips: [
        "Oregon prevailing wage threshold is $50K (higher than WA's $2,500)",
        "Prevailing wage jobs pay significantly more - worth the paperwork",
        "Iron/steel work prevailing rates in Portland metro are among the highest trades",
        "Many public owners also require COBID certification (diversity) - a competitive advantage",
      ],
      warnings: [
        "Prevailing wage violations can result in debarment from public projects",
        "Keep detailed payroll records - BOLI audits are thorough",
        "Both state and federal prevailing wages may apply to the same project - pay the higher rate",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon prevailing wage administered by BOLI. Applies to public works >$50K. Federal Davis-Bacon for federally funded >$2K. Ironwork rates among highest trades. Portland metro has highest rates.",
    },
  ],
};
