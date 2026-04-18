// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateBusinessFormation(state: StateData): Phase {
  const taxNote = state.hasIncomeTax
    ? `${state.name} has ${state.incomeTaxRate} state income tax.`
    : `${state.name} has no state income tax — a significant advantage.`;

  const salesNote = state.hasSalesTax
    ? `${state.salesTaxDetails}`
    : `${state.name} has no sales tax.`;

  return {
    id: "business-formation",
    title: "Business Formation",
    description: `Set up your ironwork contracting business in ${state.name}`,
    icon: "Building2",
    steps: [
      {
        id: "choose-structure",
        title: "Choose Your Business Structure",
        description: `Most ironwork contractors choose an LLC because it protects your personal assets from business lawsuits. ${state.name} LLC filing costs $${state.llcFilingFee}. An LLC lets you choose how you're taxed and provides personal liability protection without the complexity of a corporation.`,
        estimatedTime: "1-2 days to decide",
        estimatedCost: { min: 0, max: 0, notes: "Free to decide; filing costs in next step" },
        checklist: [
          { id: "research-structures", label: "Research LLC vs Sole Proprietorship vs S-Corp", description: "Understand liability protection and tax implications of each", required: true },
          { id: "decide-structure", label: "Decide on LLC (recommended for most contractors)", description: "LLC provides liability protection without corporate complexity", required: true },
          { id: "choose-name", label: "Choose a business name", description: `Check availability at ${state.name} Secretary of State`, required: true, link: state.sosSearchUrl },
        ],
        resources: [
          { title: `${state.name} - Business Name Search`, url: state.sosSearchUrl, description: "Search if your desired business name is available", type: "website" },
          { title: "SBA - Choose a Business Structure", url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure", description: "Federal guide comparing business structures", type: "guide" },
        ],
        tips: [
          `${state.name} LLC filing fee is $${state.llcFilingFee}`,
          "An LLC is the sweet spot for most ironwork contractors — liability protection without corporate paperwork",
          "You can always change structure later (e.g., elect S-Corp taxation) as you grow",
        ],
        warnings: [
          "Sole proprietorship means your personal assets are at risk if sued",
          "Don't skip the LLC just to save the filing fee — one lawsuit could cost you everything",
        ],
        stateSpecific: true,
        aiContext: `${state.name} LLC formation. Filing fee $${state.llcFilingFee}. ${taxNote} ${salesNote}`,
      },
      {
        id: "register-llc",
        title: `Register Your LLC with ${state.name}`,
        description: `File your LLC formation documents with the ${state.name} Secretary of State. This makes your business a legal entity. ${state.annualReportName} costs $${state.annualReportFee}${state.annualReportFee === 0 ? " (free)" : " annually"}.`,
        estimatedTime: "1-5 business days",
        estimatedCost: { min: state.llcFilingFee, max: state.llcFilingFee, notes: `${state.name} LLC filing fee` },
        checklist: [
          { id: "file-llc", label: "File Articles of Organization / Certificate of Formation", description: `Submit through ${state.name} Secretary of State`, required: true, link: state.llcFilingUrl },
          { id: "registered-agent", label: "Designate a registered agent", description: `Must have a ${state.name} physical address — can be yourself`, required: true },
          { id: "operating-agreement", label: "Draft an LLC Operating Agreement", description: "Not always required by state but strongly recommended", required: false },
        ],
        resources: [
          { title: `${state.name} - File LLC`, url: state.llcFilingUrl, description: "Official LLC formation portal", type: "form" },
        ],
        tips: [
          `${state.name} ${state.annualReportName} fee is $${state.annualReportFee}`,
          "File online for fastest processing",
          "Keep your operating agreement even if it's just you — banks may ask for it",
        ],
        warnings: [
          `${state.annualReportName} is required — failure to file can lead to administrative dissolution`,
          "Your registered agent address becomes public record",
        ],
        stateSpecific: true,
        aiContext: `${state.name} LLC filing fee $${state.llcFilingFee}. ${state.annualReportName} $${state.annualReportFee}. Registered agent required with ${state.code} physical address.`,
      },
      {
        id: "get-ein",
        title: "Get Your EIN (Employer Identification Number)",
        description: "An EIN is your business's tax ID number. It's free and instant from the IRS. You need it for your bank account, tax filings, and hiring employees.",
        estimatedTime: "15 minutes (instant online)",
        estimatedCost: { min: 0, max: 0, notes: "Completely free from IRS" },
        checklist: [
          { id: "apply-ein", label: "Apply for EIN on IRS website", description: "Free, instant online application", required: true, link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
          { id: "save-ein", label: "Save your EIN confirmation letter (CP 575)", description: "You'll need this for bank account and state registrations", required: true },
        ],
        resources: [
          { title: "IRS EIN Online Application", url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", description: "Free, instant EIN application", type: "form" },
        ],
        tips: [
          "Apply during IRS business hours (7am-10pm ET, Mon-Fri) for instant results",
          "Select 'Construction' as your industry",
          "You only need one EIN per business entity",
        ],
        warnings: [
          "Never pay for an EIN — it's free directly from the IRS",
          "Online application only available during IRS business hours",
        ],
        stateSpecific: false,
        aiContext: "EIN application is free and instant online. Required for bank account, tax registration, and hiring.",
      },
      {
        id: "business-bank-account",
        title: "Open a Business Bank Account",
        description: "Separating business and personal finances protects your LLC shield, simplifies taxes, and looks professional to bonding companies.",
        estimatedTime: "1-2 hours at the bank",
        estimatedCost: { min: 0, max: 100, notes: "Most business checking accounts are free or low-fee" },
        checklist: [
          { id: "gather-docs", label: "Gather required documents", description: "EIN letter, Articles of Organization, operating agreement, government ID", required: true },
          { id: "compare-banks", label: "Compare business checking accounts", description: "Look at fees, minimum balances, and features", required: true },
          { id: "open-account", label: "Open the account and deposit initial funds", description: "Bring all documents to the bank", required: true },
        ],
        resources: [
          { title: "NerdWallet - Best Business Checking", url: "https://www.nerdwallet.com/best/small-business/business-checking-accounts", description: "Comparison of business checking accounts", type: "guide" },
        ],
        tips: [
          "Credit unions often have lower fees than big banks",
          "Set up QuickBooks or Wave accounting from day one",
          "Bonding companies will review your bank statements — keep them organized",
        ],
        warnings: [
          "Never mix personal and business funds — it can void your LLC protection",
          "Keep detailed records from day one for bonding applications",
        ],
        stateSpecific: false,
        aiContext: `Business bank account setup in ${state.name}. Important for LLC protection and future surety bonding.`,
      },
      {
        id: "state-taxes",
        title: `Register for ${state.name} State Taxes`,
        description: `${state.incomeTaxDetails} ${salesNote} Register with the ${state.taxAgency} to meet all tax obligations.`,
        estimatedTime: "30-60 minutes online",
        estimatedCost: { min: 0, max: 0, notes: "Registration is free" },
        checklist: [
          { id: "register-tax", label: `Register with ${state.taxAgency}`, description: "Get your state tax accounts set up", required: true, link: state.taxRegistrationUrl },
          { id: "understand-taxes", label: `Understand ${state.name} tax obligations`, description: `${taxNote}`, required: true },
          ...(state.hasSalesTax ? [{ id: "sales-tax", label: "Register for sales tax collection if required", description: state.salesTaxDetails, required: true }] : []),
          { id: "setup-accounting", label: "Set up accounting system", description: "Track income, expenses, and taxes from day one", required: true },
        ],
        resources: [
          { title: `${state.taxAgency}`, url: state.taxAgencyUrl, description: `${state.name} tax information`, type: "website" },
          { title: `${state.name} Tax Registration`, url: state.taxRegistrationUrl, description: "Register for state taxes", type: "form" },
        ],
        tips: [
          taxNote,
          state.hasSalesTax ? `Sales tax: ${state.salesTaxDetails}` : `${state.name} has no sales tax`,
          "Consider hiring a CPA who knows construction — they can save you money",
          "Set aside 25-30% of net income for combined federal and state taxes",
        ],
        warnings: [
          "Quarterly estimated tax payments may be required",
          "Late filing penalties can add up fast — set calendar reminders",
        ],
        stateSpecific: true,
        aiContext: `${state.name} taxes. ${state.incomeTaxDetails} ${salesNote} ${state.taxAgency}.`,
      },
    ],
  };
}
