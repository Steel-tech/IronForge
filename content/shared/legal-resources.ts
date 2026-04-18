// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Phase } from "@/lib/types/content";

export const legalResources: Phase = {
  id: "legal-federal",
  title: "Legal & Federal Contracting",
  description: "Legal foundations and federal contracting preparation",
  icon: "Scale",
  steps: [
    {
      id: "construction-attorney",
      title: "Find a Construction Attorney",
      description:
        "A construction attorney is one of the most important relationships you'll build. They'll review your contracts, advise on lien rights, handle disputes, and protect you from costly legal mistakes. Don't wait until you have a problem - establish this relationship early.",
      estimatedTime: "1-2 weeks to find and consult",
      estimatedCost: { min: 200, max: 500, notes: "Initial consultation typically $200-$500/hour" },
      checklist: [
        {
          id: "find-attorney",
          label: "Find a construction attorney through referrals or bar association",
          description: "Ask other contractors, your bonding agent, or check state bar referral services",
          required: true,
        },
        {
          id: "initial-consultation",
          label: "Schedule initial consultation",
          description: "Discuss your business plans, contract review needs, and ongoing legal support",
          required: true,
        },
        {
          id: "contract-templates",
          label: "Have attorney review your standard contract templates",
          description: "Don't use contracts you found online without legal review",
          required: true,
        },
        {
          id: "lien-rights",
          label: "Understand mechanic's lien rights in your state",
          description: "Lien rights are your strongest tool for getting paid - know the deadlines",
          required: true,
        },
      ],
      resources: [
        {
          title: "ABA - Find a Lawyer",
          url: "https://www.americanbar.org/groups/legal_services/",
          description: "American Bar Association lawyer referral",
          type: "website",
        },
        {
          title: "WA State Bar Lawyer Directory",
          url: "https://www.wsba.org/for-the-public",
          description: "Find a WA licensed attorney",
          type: "website",
        },
        {
          title: "Oregon State Bar Lawyer Referral",
          url: "https://www.osbar.org/public/ris/",
          description: "Find an OR licensed attorney",
          type: "website",
        },
      ],
      tips: [
        "A construction attorney pays for themselves many times over - one bad contract can cost you more than years of legal fees",
        "Ask for attorneys who specialize in construction law, not just general business law",
        "Many attorneys offer flat-rate contract review services",
        "Your mechanic's lien rights have STRICT deadlines - know them before you start any project",
      ],
      warnings: [
        "Using generic contract templates without legal review is a recipe for disaster",
        "Mechanic's lien deadlines are absolute - miss them and you lose your rights",
        "Every state has different lien laws - make sure your attorney knows your state's rules",
      ],
      stateSpecific: false,
      aiContext:
        "Construction attorney. Critical for contract review, lien rights, dispute resolution. Each state has different mechanic's lien laws with strict filing deadlines.",
    },
    {
      id: "naics-codes",
      title: "NAICS Codes for Ironwork",
      description:
        "NAICS (North American Industry Classification System) codes identify what your business does. They're used for SAM.gov registration, SBA size standards, and federal contract searches. Getting the right codes ensures you show up in contract opportunity searches.",
      estimatedTime: "30 minutes",
      estimatedCost: { min: 0, max: 0, notes: "No cost" },
      checklist: [
        {
          id: "primary-naics",
          label: "Set primary NAICS code: 238120",
          description: "Structural Steel and Precast Concrete Contractors",
          required: true,
        },
        {
          id: "secondary-naics",
          label: "Add secondary NAICS codes",
          description: "238190 (Other Specialty Trade), 332312 (Fabricated Structural Metal), 332311 (Prefabricated Metal Building)",
          required: true,
        },
        {
          id: "size-standard",
          label: "Verify SBA size standard for your NAICS",
          description: "238120 size standard: $19M average annual receipts (you're small business if under this)",
          required: true,
        },
        {
          id: "update-sam",
          label: "Update NAICS codes in SAM.gov profile",
          description: "Make sure your SAM.gov registration has all relevant NAICS codes",
          required: true,
        },
      ],
      resources: [
        {
          title: "Census Bureau - NAICS Search",
          url: "https://data.census.gov/cedsci/",
          description: "Official NAICS code lookup",
          type: "website",
        },
        {
          title: "SBA Size Standards",
          url: "https://www.sba.gov/federal-contracting/contracting-guide/size-standards",
          description: "Small business size standards by NAICS code",
          type: "guide",
        },
      ],
      tips: [
        "238120 is your bread-and-butter NAICS code for structural steel erection",
        "Add multiple NAICS codes to show up in more contract searches",
        "SBA size standard for 238120 is $19M - you'll be well under this starting out",
        "Your NAICS codes affect which set-aside contracts you can compete for",
      ],
      warnings: [
        "Don't add NAICS codes for work you can't actually perform",
        "Size standards vary by NAICS code - verify each one",
      ],
      stateSpecific: false,
      aiContext:
        "NAICS codes for ironwork. Primary: 238120 (Structural Steel/Precast Concrete). Secondary: 238190, 332312, 332311. SBA size standard for 238120: $19M annual receipts.",
    },
    {
      id: "capability-statement",
      title: "Build Your Capability Statement",
      description:
        "A capability statement is a 1-2 page document that markets your business to federal agencies, GCs, and project owners. It's the construction equivalent of a resume. You'll hand it out at industry events, include it with proposals, and post it on SAM.gov.",
      estimatedTime: "1-2 days to create",
      estimatedCost: { min: 0, max: 500, notes: "Free to DIY; $200-$500 for professional design" },
      checklist: [
        {
          id: "cap-statement-core",
          label: "Create core capability statement (1-2 pages)",
          description: "Include: company overview, core competencies, past performance, differentiators, certifications, NAICS codes, contact info",
          required: true,
        },
        {
          id: "cap-statement-design",
          label: "Design professional layout",
          description: "Clean, professional design with your logo - this is a marketing document",
          required: true,
        },
        {
          id: "cap-statement-tailor",
          label: "Create tailored versions for specific audiences",
          description: "Federal agencies, GCs, and different project types may need different emphasis",
          required: false,
        },
      ],
      resources: [
        {
          title: "SBA - Capability Statement Template",
          url: "https://www.sba.gov/federal-contracting/contracting-guide/basic-requirements#section-header-6",
          description: "Government guidance on capability statements",
          type: "guide",
        },
        {
          title: "PTAC - Find Your Local Procurement Center",
          url: "https://www.sba.gov/local-assistance/find",
          description: "Free help with capability statements and federal contracting",
          type: "website",
        },
      ],
      tips: [
        "Keep it to 1-2 pages MAX - decision makers scan these quickly",
        "Lead with your certifications (SDVOSB, 8(a), etc.) - they're your biggest differentiators",
        "Include specific project examples with dollar amounts and scope",
        "Your local PTAC (Procurement Technical Assistance Center) will help you for FREE",
        "Always carry printed copies to networking events and pre-bid meetings",
      ],
      warnings: [
        "Don't exaggerate or fabricate past performance - it's federal fraud on government contracts",
        "Update your capability statement regularly as you complete new projects",
      ],
      stateSpecific: false,
      aiContext:
        "Capability statement: 1-2 page marketing document. Include certifications, NAICS codes, past performance, core competencies. PTAC offers free help. Critical for federal and GC marketing.",
    },
    {
      id: "set-aside-contracts",
      title: "Understanding Set-Aside Contracts",
      description:
        "Set-aside contracts are federal contracts reserved for specific categories of small businesses. If you're certified as SDVOSB, 8(a), HUBZone, or WOSB, you can compete for contracts that large corporations can't bid on. This is how small contractors win federal work.",
      estimatedTime: "Ongoing learning",
      estimatedCost: { min: 0, max: 0, notes: "No cost - knowledge building" },
      checklist: [
        {
          id: "understand-set-asides",
          label: "Understand federal set-aside categories",
          description: "Small Business, SDVOSB, 8(a), HUBZone, WOSB - each has different thresholds",
          required: true,
        },
        {
          id: "search-sam",
          label: "Learn to search contract opportunities on SAM.gov",
          description: "Filter by NAICS code, set-aside type, and location",
          required: true,
          link: "https://sam.gov/content/opportunities",
        },
        {
          id: "find-ptac",
          label: "Connect with your local PTAC",
          description: "Procurement Technical Assistance Centers provide FREE help with federal contracting",
          required: true,
          link: "https://www.sba.gov/local-assistance/find",
        },
        {
          id: "mentor-protege",
          label: "Research SBA Mentor-Protégé program",
          description: "Get paired with an experienced contractor who helps you grow",
          required: false,
          link: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/sba-mentor-protege-program",
        },
      ],
      resources: [
        {
          title: "SAM.gov - Contract Opportunities",
          url: "https://sam.gov/content/opportunities",
          description: "Search federal contract opportunities",
          type: "website",
        },
        {
          title: "APTAC - Find a PTAC",
          url: "https://www.sba.gov/local-assistance/find",
          description: "Free federal contracting assistance",
          type: "website",
        },
        {
          title: "SBA Mentor-Protégé Program",
          url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/sba-mentor-protege-program",
          description: "Get paired with an experienced contractor mentor",
          type: "guide",
        },
        {
          title: "USA Spending",
          url: "https://www.usaspending.gov/",
          description: "See what the government is spending money on and who's winning contracts",
          type: "website",
        },
      ],
      tips: [
        "PTAC counselors are FREE and incredibly helpful - use them",
        "Start searching SAM.gov opportunities before you're ready to bid - learn what's out there",
        "Focus on agencies in your area first - USACE, GSA, VA, military installations",
        "The Mentor-Protégé program lets you joint venture with larger firms on contracts you couldn't handle alone",
        "Network at small business matchmaking events hosted by federal agencies",
      ],
      warnings: [
        "Don't bid on projects you can't perform - federal contracting has serious consequences for non-performance",
        "Read the entire solicitation before deciding to bid - construction federal contracts have complex requirements",
        "Factor in the cost of compliance (certified payroll, Davis-Bacon, etc.) when pricing federal work",
      ],
      stateSpecific: false,
      aiContext:
        "Federal set-aside contracts. Categories: Small Business, SDVOSB (3% goal), 8(a), HUBZone (3% goal), WOSB (5% goal). PTAC provides free counseling. SAM.gov for opportunity search. Mentor-Protégé for joint ventures.",
    },
    {
      id: "first-bid",
      title: "Your First Bid Checklist",
      description:
        "You've made it through the setup process. Here's your checklist for submitting your first bid. Whether it's a private project for a GC or a public/federal opportunity, these are the essentials you need to have in order.",
      estimatedTime: "Ongoing",
      estimatedCost: { min: 0, max: 0, notes: "You're ready to start earning" },
      checklist: [
        {
          id: "verify-all-licenses",
          label: "Verify all licenses and registrations are active",
          description: "State contractor license, business license, all current and in good standing",
          required: true,
        },
        {
          id: "verify-insurance",
          label: "Verify all insurance is current",
          description: "GL, workers' comp, commercial auto - ready to issue COIs",
          required: true,
        },
        {
          id: "verify-bonding",
          label: "Confirm bonding capacity with your surety",
          description: "Know your single-job and aggregate limits before bidding",
          required: true,
        },
        {
          id: "estimating-system",
          label: "Have an estimating system in place",
          description: "Spreadsheet or software for accurate takeoffs and pricing",
          required: true,
        },
        {
          id: "safety-program",
          label: "Have a written safety program",
          description: "Required by most GCs and all public projects - OSHA compliance",
          required: true,
        },
        {
          id: "prequalification",
          label: "Complete GC prequalification packages",
          description: "Most large GCs require prequalification before you can bid",
          required: true,
        },
        {
          id: "bid-day-ready",
          label: "Understand bid submission requirements",
          description: "Deadlines, formats, required forms, bid bonds",
          required: true,
        },
      ],
      resources: [
        {
          title: "iSqFt / Dodge Construction Network",
          url: "https://www.construction.com/",
          description: "Find bidding opportunities",
          type: "website",
        },
        {
          title: "BidClerk",
          url: "https://www.bidclerk.com/",
          description: "Construction project leads and bidding opportunities",
          type: "website",
        },
      ],
      tips: [
        "Start small - bid on projects within your bonding capacity and experience level",
        "Attend pre-bid meetings and site walks - you learn a lot and make connections",
        "Build relationships with GCs by being reliable, on-budget, and on-time",
        "Your first few projects set your reputation - over-deliver on quality and safety",
        "Keep detailed records of every project for future bonding and certification reviews",
        "Congratulations - you're building something real. The ironwork industry needs good contractors. Go get it! 🔨",
      ],
      warnings: [
        "Don't underbid to win work - it'll hurt your finances and your reputation",
        "Never bid on work you're not qualified or equipped to perform",
        "Missing a bid deadline is an automatic disqualification - build in buffer time",
      ],
      stateSpecific: false,
      aiContext:
        "First bid preparation. All licenses, insurance, bonding in place. Safety program required. GC prequalification common. Start small and build track record. Reputation is everything in construction.",
    },
  ],
};
