// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";

export const bondingEducation: Phase = {
  id: "surety-bonding",
  title: "Surety Bonding",
  description: "Understanding surety bonds for construction contractors",
  icon: "Shield",
  steps: [
    {
      id: "what-are-bonds",
      title: "What Are Surety Bonds? (Plain English)",
      description:
        "A surety bond is a three-party agreement that guarantees you'll do what you promised. Think of it like a financial guarantee backed by a surety company. If you fail to perform, the surety pays the project owner - then comes after you to get their money back. It's NOT insurance for you - it protects the project owner and subcontractors/suppliers.",
      estimatedTime: "30 minutes to read and understand",
      estimatedCost: { min: 0, max: 0, notes: "Education - no cost" },
      checklist: [
        {
          id: "understand-three-parties",
          label: "Understand the 3 parties: Principal, Obligee, Surety",
          description: "You (principal) promise the project owner (obligee) via the surety company (guarantor)",
          required: true,
        },
        {
          id: "understand-not-insurance",
          label: "Understand: bonds are NOT insurance for you",
          description: "The surety pays the owner, then YOU owe the surety back - it's a line of credit, not a safety net",
          required: true,
        },
        {
          id: "understand-bond-types",
          label: "Learn the 3 main bond types: bid, performance, payment",
          description: "Each serves a different purpose in the construction process",
          required: true,
        },
      ],
      resources: [
        {
          title: "SBA - Surety Bonds Overview",
          url: "https://www.sba.gov/funding-programs/surety-bonds",
          description: "Federal government guide to surety bonds",
          type: "guide",
        },
        {
          title: "Surety & Fidelity Association of America",
          url: "https://www.surety.org/page/ContractSurety",
          description: "Industry association resources on contract surety",
          type: "website",
        },
      ],
      tips: [
        "Think of a surety bond as a financial guarantee, not insurance - if the surety pays a claim, they'll come after you for the money",
        "Your personal credit and finances matter enormously for bonding - start cleaning up credit now",
        "Building bond capacity takes time - start small and grow with each successfully completed project",
        "A good surety bond agent who specializes in construction is worth their weight in gold",
      ],
      warnings: [
        "A bond claim is serious - it can destroy your ability to get bonded in the future",
        "Never agree to a project you can't complete - bond claims follow you for years",
        "The surety will require personal indemnity - you are personally on the hook",
      ],
      stateSpecific: false,
      aiContext:
        "Surety bond education. Three parties: principal (contractor), obligee (project owner), surety (guarantor). NOT insurance for the contractor. Surety has right of indemnity against principal. Three types: bid, performance, payment.",
    },
    {
      id: "bond-types",
      title: "Types of Construction Bonds",
      description:
        "There are three main types of construction bonds. Bid bonds guarantee you'll honor your bid price. Performance bonds guarantee you'll complete the work per contract. Payment bonds guarantee you'll pay your subcontractors and suppliers. On federal projects over $150K, all three are required by the Miller Act.",
      estimatedTime: "30 minutes",
      estimatedCost: { min: 0, max: 0, notes: "Education - no cost" },
      checklist: [
        {
          id: "understand-bid-bond",
          label: "Understand bid bonds",
          description: "Guarantees you'll enter the contract at your bid price if selected. Usually 5-10% of bid amount",
          required: true,
        },
        {
          id: "understand-performance-bond",
          label: "Understand performance bonds",
          description: "Guarantees you'll complete the work per contract terms. Usually 100% of contract value",
          required: true,
        },
        {
          id: "understand-payment-bond",
          label: "Understand payment bonds",
          description: "Guarantees you'll pay subcontractors, laborers, and material suppliers. Usually 100% of contract value",
          required: true,
        },
        {
          id: "understand-miller-act",
          label: "Understand the Miller Act",
          description: "Federal projects over $150K require performance and payment bonds",
          required: true,
        },
      ],
      resources: [
        {
          title: "SBA - Types of Surety Bonds",
          url: "https://www.sba.gov/funding-programs/surety-bonds",
          description: "Explanation of different bond types",
          type: "guide",
        },
      ],
      tips: [
        "Bid bonds are usually free if you have a bonding relationship - they cost the surety nothing if you win and perform",
        "Performance and payment bonds typically cost 1-3% of the contract amount for small contractors",
        "As you build a track record, bond premium rates decrease",
        "Most public projects (state and federal) require all three bond types",
      ],
      warnings: [
        "If you withdraw your bid after submitting a bid bond, you may forfeit the bid bond amount",
        "Bond premiums are a real cost - include them in your bid pricing",
        "A performance bond claim can effectively end your bonding ability for years",
      ],
      stateSpecific: false,
      aiContext:
        "Three bond types: bid (5-10% of bid), performance (100% of contract), payment (100% of contract). Miller Act requires P&P bonds on federal >$150K. Premium typically 1-3% for small contractors.",
    },
    {
      id: "getting-bonded",
      title: "How to Get Bonded",
      description:
        "Getting bonded is like getting a loan - the surety company evaluates your character, capacity, and capital (the 3 C's). They'll look at your personal credit, business financials, construction experience, and available working capital. New contractors typically start with $250K-$500K capacity.",
      estimatedTime: "2-4 weeks to prepare and apply",
      estimatedCost: { min: 100, max: 500, notes: "License bond premium $100-$500/yr; project bonds 1-3% of contract" },
      checklist: [
        {
          id: "find-surety-agent",
          label: "Find a surety bond agent who specializes in construction",
          description: "Ask for referrals from other contractors or your local AGC/ABC chapter",
          required: true,
        },
        {
          id: "check-credit",
          label: "Check your personal credit score (aim for 680+)",
          description: "Pull your report and dispute any errors - credit is the #1 factor",
          required: true,
        },
        {
          id: "prepare-pfs",
          label: "Prepare Personal Financial Statement",
          description: "SBA Form 413 format - list all assets, liabilities, net worth",
          required: true,
        },
        {
          id: "prepare-business-financials",
          label: "Prepare business financial statements",
          description: "Balance sheet, P&L, work in progress schedule",
          required: true,
        },
        {
          id: "document-experience",
          label: "Document your construction experience",
          description: "Resume showing years of ironwork experience, project types, and sizes",
          required: true,
        },
        {
          id: "sba-bond-guarantee",
          label: "Research SBA Surety Bond Guarantee Program",
          description: "SBA guarantees bonds up to $10M for qualifying small businesses",
          required: false,
          link: "https://www.sba.gov/funding-programs/surety-bonds",
        },
      ],
      resources: [
        {
          title: "SBA Surety Bond Guarantee Program",
          url: "https://www.sba.gov/funding-programs/surety-bonds",
          description: "SBA guarantees bonds for small contractors who can't get them otherwise",
          type: "guide",
        },
        {
          title: "National Association of Surety Bond Producers",
          url: "https://www.nasbp.org/home",
          description: "Find a surety bond producer/agent",
          type: "website",
        },
        {
          title: "SBA Form 413 - Personal Financial Statement",
          url: "https://www.sba.gov/document/sba-form-413-personal-financial-statement",
          description: "Standard form for presenting personal finances to surety",
          type: "form",
        },
      ],
      tips: [
        "Credit score is king - even 20 points improvement can change your bonding rate",
        "The SBA Surety Bond Guarantee Program is a game-changer for new contractors - they back up to $10M",
        "Start building a relationship with your surety agent BEFORE you need a bond",
        "Maintain clean personal and business finances - sureties look at both",
        "Each successfully completed bonded project increases your capacity",
      ],
      warnings: [
        "Personal indemnity is required - you and your spouse may need to sign",
        "Don't apply for bonds you don't need yet - too many inquiries can raise flags",
        "Tax liens are a deal-breaker for most sureties - get current on all taxes first",
        "Bankruptcy on your record makes bonding very difficult for 7-10 years",
      ],
      stateSpecific: false,
      aiContext:
        "Getting bonded: 3 C's - character (credit/reputation), capacity (experience/resources), capital (financial strength). Target 680+ credit score. SBA Bond Guarantee Program covers up to $10M. New contractors typically start at $250K-$500K capacity. Personal indemnity required.",
    },
    {
      id: "growing-capacity",
      title: "Growing Your Bond Capacity",
      description:
        "Your bonding capacity determines the size of projects you can bid on. Growing it is a deliberate process: complete bonded projects successfully, strengthen your financials, and build a track record. Most new contractors start at $250K-$500K and can grow to $1M-$5M within 3-5 years.",
      estimatedTime: "Ongoing - years to build",
      estimatedCost: { min: 0, max: 0, notes: "Part of business growth strategy" },
      checklist: [
        {
          id: "track-record",
          label: "Build a track record of completed bonded projects",
          description: "Start small and complete projects successfully - each one grows your capacity",
          required: true,
        },
        {
          id: "retain-earnings",
          label: "Retain earnings in the business",
          description: "Working capital is critical - don't pull all profits out as owner draws",
          required: true,
        },
        {
          id: "cpa-relationship",
          label: "Maintain relationship with a construction-focused CPA",
          description: "Your CPA-prepared financials are key to surety underwriting",
          required: true,
        },
        {
          id: "annual-surety-review",
          label: "Schedule annual meeting with your surety agent",
          description: "Review capacity, discuss growth plans, update financials",
          required: true,
        },
      ],
      resources: [
        {
          title: "AGC of America - Surety Bonding Guide",
          url: "https://www.agc.org/",
          description: "Industry guide to construction bonding",
          type: "guide",
        },
      ],
      tips: [
        "Rule of thumb: you need 10% working capital for your bonding program (i.e., $50K working capital for $500K bonding)",
        "CPA-prepared (reviewed or audited) financial statements get you better bonding than self-prepared",
        "Diversify project types and clients to show breadth",
        "Your personal financial strength matters as much as the business - keep personal finances clean",
        "A line of credit shows the surety you have backup liquidity",
      ],
      warnings: [
        "Don't overextend - taking a project that's too large can sink your whole company",
        "A single bond claim can wipe out years of capacity building",
        "Underbidding to win work hurts your financials and thus your bonding capacity",
      ],
      stateSpecific: false,
      aiContext:
        "Growing bond capacity. 10% working capital rule. CPA-prepared financials preferred. Start $250K-$500K, grow to $1M-$5M in 3-5 years. Each successful completion builds capacity. Annual surety review critical.",
    },
  ],
};
