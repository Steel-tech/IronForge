import type { Phase } from "@/lib/types/content";

export const orBusinessFormation: Phase = {
  id: "business-formation",
  title: "Business Formation",
  description: "Set up your ironwork contracting business in Oregon",
  icon: "Building2",
  steps: [
    {
      id: "choose-structure",
      title: "Choose Your Business Structure",
      description:
        "Most ironwork contractors choose an LLC because it protects your personal assets from business lawsuits. Oregon makes it easy to form an LLC, and the filing fee is lower than many states. An LLC lets you choose how you're taxed - as a sole proprietor, partnership, or S-Corp.",
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
          description: "Check availability at Oregon Secretary of State website",
          required: true,
          link: "https://sos.oregon.gov/business/Pages/find.aspx",
        },
      ],
      resources: [
        {
          title: "Oregon Secretary of State - Business Name Search",
          url: "https://sos.oregon.gov/business/Pages/find.aspx",
          description: "Search if your desired business name is available in Oregon",
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
        "Oregon LLC filing is only $100 - one of the more affordable states",
        "Consider the tax implications: Oregon has state income tax (unlike WA), so S-Corp election may save on self-employment taxes as you grow",
        "Your business name must include 'LLC' or 'Limited Liability Company'",
      ],
      warnings: [
        "Sole proprietorship means your personal assets are at risk if sued",
        "Oregon has state income tax - factor this into your financial planning from day one",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon LLC formation. Oregon has state income tax (graduated rates up to 9.9%). No sales tax in Oregon. LLC filing is $100. Business must register with Oregon Department of Revenue for state income tax.",
    },
    {
      id: "register-llc",
      title: "Register Your LLC with Oregon",
      description:
        "File your Articles of Organization with the Oregon Secretary of State. Oregon's filing process is straightforward and affordable at $100 online.",
      estimatedTime: "1-5 business days",
      estimatedCost: { min: 100, max: 100, notes: "Oregon LLC filing fee is $100 (online)" },
      checklist: [
        {
          id: "file-llc",
          label: "File Articles of Organization online",
          description: "Submit through Oregon Secretary of State Business Registry",
          required: true,
          link: "https://sos.oregon.gov/business/Pages/register.aspx",
        },
        {
          id: "registered-agent",
          label: "Designate a registered agent",
          description: "Must have an Oregon physical address - can be yourself",
          required: true,
        },
        {
          id: "operating-agreement",
          label: "Draft an LLC Operating Agreement",
          description: "Not required by Oregon but strongly recommended",
          required: false,
        },
      ],
      resources: [
        {
          title: "Oregon SOS - Register a Business",
          url: "https://sos.oregon.gov/business/Pages/register.aspx",
          description: "Official LLC registration portal",
          type: "form",
        },
      ],
      tips: [
        "Online filing is fastest - usually processed within a few business days",
        "Annual report is $100, due on your anniversary date",
        "You can be your own registered agent if you have an Oregon address",
      ],
      warnings: [
        "Annual report ($100) is due every year - late filing leads to administrative dissolution",
        "Your registered agent address becomes public record",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon LLC filing fee $100. Annual report $100 due on anniversary. Registered agent must have OR physical address. Filed through Oregon Secretary of State.",
    },
    {
      id: "get-ein",
      title: "Get Your EIN (Employer Identification Number)",
      description:
        "An EIN is your business's tax ID number. It's free and instant from the IRS. You need it for your bank account, contractor license, and tax filings.",
      estimatedTime: "15 minutes (instant online)",
      estimatedCost: { min: 0, max: 0, notes: "Completely free from IRS" },
      checklist: [
        {
          id: "apply-ein",
          label: "Apply for EIN on IRS website",
          description: "Free, instant online application",
          required: true,
          link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        },
        {
          id: "save-ein",
          label: "Save your EIN confirmation letter (CP 575)",
          description: "You'll need this for bank account and CCB license application",
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
        "Apply during IRS business hours (7am-10pm ET, Mon-Fri) for instant results",
        "Select 'Construction' as your industry",
        "You'll need your EIN for your Oregon CCB contractor license application",
      ],
      warnings: [
        "Never pay for an EIN - it's free directly from the IRS",
        "Online application only available during business hours",
      ],
      stateSpecific: false,
      aiContext: "EIN application is free and instant online. Required for OR CCB license, bank account, and tax filings.",
    },
    {
      id: "business-bank-account",
      title: "Open a Business Bank Account",
      description:
        "Separating your business and personal finances protects your LLC shield and makes tax time much easier. Bonding companies will also review your business financials, so start clean.",
      estimatedTime: "1-2 hours at the bank",
      estimatedCost: { min: 0, max: 100, notes: "Most business checking accounts are free or low-fee" },
      checklist: [
        {
          id: "gather-docs",
          label: "Gather required documents",
          description: "EIN letter, Articles of Organization, operating agreement, government ID",
          required: true,
        },
        {
          id: "compare-banks",
          label: "Compare business checking accounts",
          description: "Look at fees, minimum balances, and features",
          required: true,
        },
        {
          id: "open-account",
          label: "Open the account and deposit initial funds",
          description: "Bring all documents to the bank",
          required: true,
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
        "Credit unions like OnPoint and Unitus in Oregon often have great rates for small businesses",
        "Set up QuickBooks or Wave accounting from day one",
        "Bonding companies will review your bank statements - keep them organized",
      ],
      warnings: [
        "Never mix personal and business funds - it can void your LLC protection",
        "Keep detailed records from day one for bonding applications",
      ],
      stateSpecific: false,
      aiContext: "Business bank account setup in Oregon. Important for LLC protection and future surety bonding.",
    },
    {
      id: "state-taxes",
      title: "Register for Oregon State Taxes",
      description:
        "Oregon has state income tax (no sales tax), so you need to register with the Oregon Department of Revenue. Income tax rates are graduated up to 9.9%. You'll also need to handle federal self-employment taxes.",
      estimatedTime: "30-60 minutes online",
      estimatedCost: { min: 0, max: 0, notes: "Registration is free" },
      checklist: [
        {
          id: "register-dor",
          label: "Register with Oregon Department of Revenue",
          description: "Register for Oregon state income tax withholding",
          required: true,
          link: "https://www.oregon.gov/dor/Pages/index.aspx",
        },
        {
          id: "understand-taxes",
          label: "Understand Oregon income tax obligations",
          description: "Oregon has graduated income tax rates up to 9.9%",
          required: true,
        },
        {
          id: "estimated-taxes",
          label: "Set up quarterly estimated tax payments",
          description: "Both federal and state estimated taxes due quarterly",
          required: true,
        },
        {
          id: "setup-accounting",
          label: "Set up accounting system",
          description: "Track income, expenses, and mileage from day one",
          required: true,
        },
      ],
      resources: [
        {
          title: "Oregon Department of Revenue",
          url: "https://www.oregon.gov/dor/Pages/index.aspx",
          description: "Register for Oregon state taxes",
          type: "form",
        },
        {
          title: "Oregon Tax - New Business Guide",
          url: "https://www.oregon.gov/dor/programs/businesses/Pages/new-business.aspx",
          description: "Guide for new businesses in Oregon",
          type: "guide",
        },
      ],
      tips: [
        "Oregon has no sales tax - that's one less thing to worry about compared to WA",
        "Set aside 25-30% of net income for combined federal and state taxes",
        "Consider hiring a CPA who knows construction - they can save you money",
        "As an LLC, you'll pay self-employment tax (15.3%) on net income - S-Corp election can help reduce this as you grow",
      ],
      warnings: [
        "Oregon income tax rates are high (up to 9.9%) - plan for it",
        "Quarterly estimated tax payments are due April 15, June 15, Sept 15, Jan 15",
        "Underpayment penalties apply if you don't pay enough during the year",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon has no sales tax but has state income tax with graduated rates up to 9.9%. Business must register with Oregon DOR. Quarterly estimated taxes required. Self-employment tax (15.3%) on net income.",
    },
  ],
};
