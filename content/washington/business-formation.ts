import type { Phase } from "@/lib/types/content";

export const waBusinessFormation: Phase = {
  id: "business-formation",
  title: "Business Formation",
  description: "Set up your ironwork contracting business in Washington State",
  icon: "Building2",
  steps: [
    {
      id: "choose-structure",
      title: "Choose Your Business Structure",
      description:
        "Most ironwork contractors choose an LLC (Limited Liability Company) because it protects your personal assets—your house, truck, savings—from business lawsuits. If a project goes sideways, creditors can only go after business assets, not your personal ones. An LLC is simpler than a corporation and gives you flexibility on taxes.",
      estimatedTime: "1-2 days to decide",
      estimatedCost: { min: 0, max: 0, notes: "Free to decide; filing costs come in next step" },
      checklist: [
        {
          id: "research-structures",
          label: "Research LLC vs Sole Proprietorship vs S-Corp",
          description: "Understand the liability protection and tax implications of each",
          required: true,
        },
        {
          id: "decide-structure",
          label: "Decide on LLC (recommended for most contractors)",
          description: "LLC provides liability protection without corporate complexity",
          required: true,
        },
        {
          id: "choose-name",
          label: "Choose a business name",
          description: "Check availability at WA Secretary of State website",
          required: true,
          link: "https://ccfs.sos.wa.gov/#/",
        },
      ],
      resources: [
        {
          title: "WA Secretary of State - Business Search",
          url: "https://ccfs.sos.wa.gov/#/",
          description: "Search if your desired business name is available",
          type: "website",
        },
        {
          title: "SBA - Choose a Business Structure",
          url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure",
          description: "Federal guide comparing business structures",
          type: "guide",
        },
      ],
      tips: [
        "An LLC is the sweet spot for most ironwork contractors - liability protection without the paperwork of a corporation",
        "You can always change structure later (e.g., elect S-Corp taxation) as you grow",
        "Your business name doesn't have to match your LLC name - you can file a trade name (DBA) later",
      ],
      warnings: [
        "Sole proprietorship means YOUR personal assets are at risk if someone sues your business",
        "Don't skip the LLC just to save the filing fee - one lawsuit could cost you everything",
      ],
      stateSpecific: true,
      aiContext:
        "Washington State LLC formation. No state income tax in WA. Business & Occupation (B&O) tax applies to gross receipts. Ironwork contractors typically fall under 'retailing' B&O classification.",
    },
    {
      id: "register-llc",
      title: "Register Your LLC with Washington State",
      description:
        "File your LLC formation documents with the Washington Secretary of State. This makes your business a legal entity. You can file online and it's usually processed within a few business days.",
      estimatedTime: "1-3 business days",
      estimatedCost: { min: 200, max: 200, notes: "WA LLC filing fee is $200 (online)" },
      checklist: [
        {
          id: "file-llc",
          label: "File Certificate of Formation online",
          description: "Submit through WA Secretary of State online portal",
          required: true,
          link: "https://ccfs.sos.wa.gov/#/",
        },
        {
          id: "registered-agent",
          label: "Designate a registered agent",
          description: "Person or service to receive legal documents - can be yourself at your business address",
          required: true,
        },
        {
          id: "operating-agreement",
          label: "Draft an LLC Operating Agreement",
          description: "Not required by WA but strongly recommended - defines ownership and management",
          required: false,
        },
      ],
      resources: [
        {
          title: "WA Secretary of State - Form an LLC",
          url: "https://www.sos.wa.gov/corps/limited-liability-companies.aspx",
          description: "Official guide and filing portal",
          type: "form",
        },
        {
          title: "WA LLC Filing Portal",
          url: "https://ccfs.sos.wa.gov/#/",
          description: "Online filing system for business formation",
          type: "form",
        },
      ],
      tips: [
        "File online for fastest processing - usually 1-3 business days",
        "You can be your own registered agent to save money, but you must have a WA physical address",
        "Keep your operating agreement even if it's just you - banks may ask for it",
      ],
      warnings: [
        "Annual renewal is required - $60/year due on your formation anniversary month",
        "If you miss the renewal, your LLC can be administratively dissolved",
      ],
      stateSpecific: true,
      aiContext:
        "WA LLC filing fee $200 online. Annual report $60. Registered agent required with WA physical address. No operating agreement required by state but recommended. Filed through WA Secretary of State CCFS portal.",
    },
    {
      id: "get-ein",
      title: "Get Your EIN (Employer Identification Number)",
      description:
        "An EIN is like a Social Security Number for your business. You need it to open a business bank account, hire employees, and file taxes. It's free and you can get it instantly online from the IRS.",
      estimatedTime: "15 minutes (instant online)",
      estimatedCost: { min: 0, max: 0, notes: "Completely free from IRS" },
      checklist: [
        {
          id: "apply-ein",
          label: "Apply for EIN on IRS website",
          description: "Free, instant online application - have your LLC info ready",
          required: true,
          link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        },
        {
          id: "save-ein",
          label: "Save your EIN confirmation letter (CP 575)",
          description: "Download and save the PDF - you'll need this for bank account and licensing",
          required: true,
        },
      ],
      resources: [
        {
          title: "IRS EIN Online Application",
          url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
          description: "Free, instant EIN application",
          type: "form",
        },
      ],
      tips: [
        "Apply during IRS business hours (7am-10pm ET, Mon-Fri) for instant processing",
        "Select 'Construction' as your industry and 'Structural Steel and Precast Concrete' as the type",
        "You only need one EIN per business entity",
      ],
      warnings: [
        "Never pay a third party for an EIN - it's free from the IRS",
        "The online application is only available Mon-Fri during business hours",
      ],
      stateSpecific: false,
      aiContext:
        "EIN application is free and instant online. Required for business bank account, hiring employees, and most contractor license applications. IRS Form SS-4 equivalent.",
    },
    {
      id: "business-bank-account",
      title: "Open a Business Bank Account",
      description:
        "Separating business and personal finances is crucial. It protects your LLC liability shield (commingling funds can 'pierce the corporate veil'), makes taxes easier, and looks professional to clients and bonding companies.",
      estimatedTime: "1-2 hours at the bank",
      estimatedCost: { min: 0, max: 100, notes: "Most business checking accounts are free or low-fee" },
      checklist: [
        {
          id: "gather-docs",
          label: "Gather required documents",
          description: "EIN confirmation, Articles of Organization, operating agreement, government ID",
          required: true,
        },
        {
          id: "compare-banks",
          label: "Compare business checking accounts",
          description: "Look at fees, minimum balances, and online banking features",
          required: true,
        },
        {
          id: "open-account",
          label: "Open the account and deposit initial funds",
          description: "Bring all documents to the bank",
          required: true,
        },
        {
          id: "order-checks",
          label: "Order business checks (optional but useful)",
          description: "Some vendors and government agencies still prefer checks",
          required: false,
        },
      ],
      resources: [
        {
          title: "NerdWallet - Best Business Checking",
          url: "https://www.nerdwallet.com/best/small-business/free-business-checking-accounts",
          description: "Comparison of business checking accounts",
          type: "guide",
        },
      ],
      tips: [
        "Credit unions often have lower fees than big banks",
        "Having a dedicated business account is critical for bonding - surety companies will review your financials",
        "Set up online banking and accounting software (QuickBooks, Wave) from day one",
        "Keep business and personal expenses completely separate - this protects your LLC",
      ],
      warnings: [
        "Never pay business expenses from a personal account or vice versa - this can void your LLC protection",
        "Bonding companies will review your business bank statements, so keep them clean",
      ],
      stateSpecific: false,
      aiContext:
        "Business bank account setup. Critical for LLC liability protection and surety bonding applications. Surety companies review business financials closely.",
    },
    {
      id: "state-taxes",
      title: "Register for Washington State Taxes",
      description:
        "Washington has no state income tax, but you do need a Business License (UBI number) and will owe Business & Occupation (B&O) tax on gross receipts. The B&O tax rate for most contractors is 0.484% of gross revenue.",
      estimatedTime: "30 minutes online",
      estimatedCost: { min: 0, max: 90, notes: "Business license fee varies by city ($0-$90)" },
      checklist: [
        {
          id: "apply-ubi",
          label: "Apply for WA Business License (UBI number)",
          description: "Through Business Licensing Service - covers state and most city licenses",
          required: true,
          link: "https://dor.wa.gov/open-business/apply-business-license",
        },
        {
          id: "understand-bno",
          label: "Understand B&O tax obligations",
          description: "WA B&O tax is on gross receipts (not profit). Contractors typically pay 0.484%",
          required: true,
        },
        {
          id: "sales-tax",
          label: "Register for retail sales tax collection",
          description: "Contractors performing retail construction must collect and remit sales tax",
          required: true,
        },
        {
          id: "setup-accounting",
          label: "Set up accounting system",
          description: "QuickBooks, FreshBooks, or Wave - track income and expenses from day one",
          required: true,
        },
      ],
      resources: [
        {
          title: "WA Department of Revenue - Business License Application",
          url: "https://dor.wa.gov/open-business/apply-business-license",
          description: "Apply for your WA UBI/Business License",
          type: "form",
        },
        {
          title: "WA DOR - Contractor Tax Guide",
          url: "https://dor.wa.gov/education/industry-guides/construction-industry",
          description: "Tax guidance specific to construction contractors",
          type: "guide",
        },
        {
          title: "WA DOR - B&O Tax",
          url: "https://dor.wa.gov/taxes-rates/business-occupation-tax",
          description: "Business & Occupation tax information",
          type: "website",
        },
      ],
      tips: [
        "WA has no state income tax - that's a significant advantage over Oregon",
        "B&O tax is on gross receipts, not profit - make sure you price this into your bids",
        "Most contractors file B&O tax quarterly - set aside funds each month",
        "Your UBI number is also required for your contractor registration with L&I",
      ],
      warnings: [
        "B&O tax is due even if you don't make a profit - it's based on gross revenue",
        "Late filing penalties can add up fast - set calendar reminders for quarterly filing dates",
        "Sales tax on construction work can be complex - consider consulting a CPA familiar with construction",
      ],
      stateSpecific: true,
      aiContext:
        "Washington state has no income tax. Business & Occupation (B&O) tax at 0.484% on gross receipts for most construction contractors. Sales tax must be collected on retail construction. UBI (Unified Business Identifier) required - serves as state business license.",
    },
  ],
};
