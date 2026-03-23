import type { Phase } from "@/lib/types/content";

export const unionSignatoryEducation: Phase = {
  id: "union-signatory",
  title: "Union Signatory Contractor",
  description: "Becoming a signatory contractor with the Ironworkers union",
  icon: "Handshake",
  steps: [
    {
      id: "what-is-signatory",
      title: "What Is a Union Signatory Contractor?",
      description:
        "A signatory contractor is a company that has signed a Collective Bargaining Agreement (CBA) with an ironworkers local union. This means you agree to hire ironworkers through the union hiring hall, pay union scale wages and benefits, and contribute to trust funds (pension, health & welfare, annuity, apprenticeship training). In return, you get access to a highly skilled, certified workforce dispatched to your jobs on demand.",
      estimatedTime: "1-2 hours to research and understand",
      estimatedCost: { min: 0, max: 0, notes: "No cost to learn — obligations begin when you sign the CBA" },
      checklist: [
        {
          id: "understand-cba",
          label: "Understand what a Collective Bargaining Agreement (CBA) is",
          description: "A CBA is a legally binding contract between your company and the union covering wages, benefits, working conditions, and dispute resolution",
          required: true,
        },
        {
          id: "understand-obligations",
          label: "Understand signatory contractor obligations",
          description: "You must pay union scale wages, contribute to trust funds, use the hiring hall, and follow CBA work rules",
          required: true,
        },
        {
          id: "understand-benefits",
          label: "Understand the benefits of being signatory",
          description: "Access to skilled/certified workforce, apprenticeship pipeline, prevailing wage compliance built-in, and ability to bid on union-only projects",
          required: true,
        },
        {
          id: "understand-hiring-hall",
          label: "Understand how the hiring hall and dispatch work",
          description: "You request workers through the union dispatch — they send qualified ironworkers to your jobs based on seniority and availability",
          required: true,
        },
      ],
      resources: [
        {
          title: "International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers",
          url: "https://www.ironworkers.org/",
          description: "The International union — parent organization of all ironworkers locals",
          type: "website",
        },
        {
          title: "IMPACT — Ironworker Management Progressive Action Cooperative Trust",
          url: "https://www.impact-net.org/",
          description: "Joint labor-management trust that provides training, safety, and business resources for signatory contractors",
          type: "website",
        },
        {
          title: "Ironworkers Apprenticeship Programs",
          url: "https://www.ironworkers.org/training-and-apprenticeships",
          description: "National apprenticeship training information",
          type: "guide",
        },
      ],
      tips: [
        "Being signatory means you get a TRAINED, CERTIFIED workforce dispatched to you — no recruiting, no screening, no training costs",
        "Union ironworkers complete a 3-4 year apprenticeship with thousands of hours of training — you're getting the best-trained workers in the trade",
        "On prevailing wage projects, union contractors are already at scale — no wage compliance headaches",
        "IMPACT provides free business development resources, safety training, and even drug testing for signatory contractors",
        "Many large GCs and project owners prefer or require union subcontractors — being signatory opens doors",
        "You can start as a single-person signatory and call workers from the hall as you win jobs",
      ],
      warnings: [
        "Signing a CBA is a legally binding commitment — understand all obligations before you sign",
        "Trust fund contributions (pension, health, annuity) are in addition to the hourly wage — factor them into your bids",
        "Late trust fund payments can result in penalties, interest, and even being sued by the trust",
        "You must follow the CBA's grievance procedures — you can't fire workers without following the process",
      ],
      stateSpecific: false,
      aiContext:
        "Union signatory education. CBA = collective bargaining agreement. Signatory contractors hire through the union hiring hall, pay scale wages + trust fund contributions. Benefits: skilled workforce, apprenticeship pipeline, prevailing wage compliance, access to union-only projects. IMPACT provides joint labor-management resources.",
    },
    {
      id: "trust-fund-obligations",
      title: "Trust Fund Obligations (Pension, Health, Annuity)",
      description:
        "As a signatory contractor, you're required to contribute to multiple trust funds for every hour worked by your ironworkers. These include the pension fund, health & welfare fund, annuity fund, and apprenticeship training fund. These contributions are negotiated in the CBA and are in ADDITION to the hourly wage. Total package (wages + fringes) for journeyman ironworkers typically ranges from $60-$120+/hour depending on your local market.",
      estimatedTime: "1-2 hours to understand",
      estimatedCost: { min: 0, max: 0, notes: "Contributions begin when your workers start — factor into bids" },
      checklist: [
        {
          id: "understand-pension",
          label: "Understand pension fund contributions",
          description: "You contribute a negotiated amount per hour worked — this funds the ironworker's retirement pension",
          required: true,
        },
        {
          id: "understand-health",
          label: "Understand health & welfare fund contributions",
          description: "Provides medical, dental, vision, and sometimes life insurance for ironworkers and their families",
          required: true,
        },
        {
          id: "understand-annuity",
          label: "Understand annuity fund contributions",
          description: "A supplemental retirement account — similar to a 401(k) funded by your hourly contributions",
          required: true,
        },
        {
          id: "understand-training",
          label: "Understand apprenticeship/training fund contributions",
          description: "Funds the local's apprenticeship training center and journeyman upgrade training",
          required: true,
        },
        {
          id: "setup-reporting",
          label: "Set up trust fund reporting system",
          description: "You'll submit monthly reports of hours worked by each employee and remit contributions",
          required: true,
        },
      ],
      resources: [
        {
          title: "IMPACT - Contractor Resources",
          url: "https://www.impact-net.org/contractors",
          description: "Resources specifically for signatory ironwork contractors",
          type: "guide",
        },
        {
          title: "Iron Workers National Pension Fund",
          url: "https://www.ironworkers.org/",
          description: "National pension fund information",
          type: "website",
        },
      ],
      tips: [
        "Total fringe package typically adds $25-$50+/hour on top of the base wage — know your local's total package",
        "Trust fund contributions are your single biggest ongoing obligation as a signatory — never fall behind",
        "Set up automatic reporting systems early — late or inaccurate reports trigger audits",
        "IMPACT can help you understand and set up your trust fund reporting",
        "Your accountant/CPA must understand trust fund reporting — construction-focused CPAs are essential",
        "Factor the total package (wages + all fringes) into every bid — this is your true labor cost per hour",
      ],
      warnings: [
        "Trust fund delinquency is the #1 way signatory contractors get into trouble — treat it like payroll taxes",
        "Trustees can and will audit your books — keep impeccable records of hours worked",
        "Late contributions accrue interest AND penalties — they add up fast",
        "If you fail to remit trust fund contributions, the funds can sue you personally as an owner",
        "Never use trust fund money for operating expenses — it's not your money",
      ],
      stateSpecific: false,
      aiContext:
        "Trust fund obligations for signatory contractors. Pension, health & welfare, annuity, apprenticeship training. Contributions per hour worked, reported monthly. Total package $60-$120+/hr. Delinquency triggers audits, penalties, lawsuits. IMPACT provides contractor support.",
    },
    {
      id: "signing-process",
      title: "How to Become a Signatory Contractor",
      description:
        "The process of becoming signatory is straightforward: you contact your local ironworkers union, express interest in signing a CBA, and work with the Business Manager or Business Agent to complete the agreement. You'll need your contractor license, insurance, bonding, and a legitimate business. Most locals are eager to sign new contractors because it creates more work opportunities for their members.",
      estimatedTime: "2-4 weeks",
      estimatedCost: { min: 0, max: 500, notes: "Some locals may have nominal association or initiation fees" },
      checklist: [
        {
          id: "contact-local",
          label: "Contact your local ironworkers union Business Manager/Agent",
          description: "Call the local union hall, introduce yourself, and express interest in becoming a signatory contractor",
          required: true,
        },
        {
          id: "meet-business-agent",
          label: "Schedule a meeting with the Business Agent",
          description: "They'll explain the CBA, trust fund obligations, dispatch procedures, and answer your questions",
          required: true,
        },
        {
          id: "review-cba",
          label: "Review the Collective Bargaining Agreement carefully",
          description: "Read every section — wages, fringes, work rules, overtime, travel pay, dispute resolution",
          required: true,
        },
        {
          id: "attorney-review",
          label: "Have your construction attorney review the CBA",
          description: "Understand your legal obligations before signing — this is a binding contract",
          required: true,
        },
        {
          id: "setup-trust-accounts",
          label: "Set up trust fund reporting and payment accounts",
          description: "Register with each trust fund to enable monthly contributions",
          required: true,
        },
        {
          id: "sign-cba",
          label: "Sign the CBA and register with the local",
          description: "Once signed, you can begin dispatching ironworkers through the hiring hall",
          required: true,
        },
        {
          id: "join-impact",
          label: "Register with IMPACT (Ironworker Management Progressive Action Trust)",
          description: "Free resources for signatory contractors: safety training, drug testing, business development",
          required: false,
          link: "https://www.impact-net.org/",
        },
      ],
      resources: [
        {
          title: "IMPACT — Find Your Local",
          url: "https://www.impact-net.org/",
          description: "Joint labor-management trust with contractor resources",
          type: "website",
        },
        {
          title: "Ironworkers International — Local Union Directory",
          url: "https://www.ironworkers.org/find-a-local",
          description: "Find your local ironworkers union by location",
          type: "website",
        },
      ],
      tips: [
        "Don't be intimidated — Business Agents WANT new signatory contractors. More contractors = more work for members",
        "You can start small — sign the CBA and call one or two ironworkers for your first project",
        "Ask the Business Agent about any upcoming projects that need ironwork subs — they know who's bidding what",
        "The union hiring hall is basically a free recruiting service — you call, they dispatch qualified workers",
        "IMPACT provides FREE contractor training on estimating, project management, and safety",
        "Being signatory immediately qualifies you to bid on Project Labor Agreement (PLA) jobs",
        "Many signatory contractors started as union journeymen who went out on their own",
      ],
      warnings: [
        "The CBA is legally binding for its full term (typically 3-5 years) — understand what you're committing to",
        "You cannot selectively follow the CBA — it's all or nothing",
        "If you sign and then don't follow the agreement, the union can file grievances and unfair labor practice charges",
        "Make sure your insurance and bonding are in order before signing — the union will verify",
      ],
      stateSpecific: false,
      aiContext:
        "Process: Contact local union Business Agent → meet to discuss → review CBA → attorney review → sign → set up trust accounts → register with IMPACT. Locals want new signatory contractors. CBA is binding for full term. IMPACT provides free resources. Union hiring hall = free recruiting.",
    },
    {
      id: "bidding-as-union",
      title: "Bidding and Working as a Union Signatory Contractor",
      description:
        "As a signatory contractor, you gain access to projects that non-union contractors cannot bid on — Project Labor Agreements (PLAs), union-only GC requirements, and prevailing wage work where your built-in compliance is a competitive advantage. You'll bid using the total labor package from your CBA and dispatch workers through the hiring hall as you win projects.",
      estimatedTime: "Ongoing",
      estimatedCost: { min: 0, max: 0, notes: "Part of operating as signatory" },
      checklist: [
        {
          id: "understand-pla",
          label: "Understand Project Labor Agreements (PLAs)",
          description: "PLAs require all contractors on a project to use union labor — being signatory is required to bid",
          required: true,
        },
        {
          id: "prevailing-wage-advantage",
          label: "Leverage your prevailing wage compliance advantage",
          description: "Your CBA rates meet or exceed prevailing wage — automatic compliance, no extra paperwork",
          required: true,
        },
        {
          id: "dispatch-process",
          label: "Learn the dispatch/referral process for your local",
          description: "Know how to request workers: number needed, skills required, start date, project duration",
          required: true,
        },
        {
          id: "build-gc-relationships",
          label: "Build relationships with union-friendly GCs",
          description: "Many large GCs prefer or require union subs — network at pre-bid meetings and industry events",
          required: true,
        },
        {
          id: "track-hours-contributions",
          label: "Set up robust hour tracking and trust fund contribution systems",
          description: "Accurate, timely reporting is critical — consider payroll services experienced with union contractors",
          required: true,
        },
      ],
      resources: [
        {
          title: "IMPACT - Business Development Resources",
          url: "https://www.impact-net.org/",
          description: "Training and resources for growing your signatory business",
          type: "guide",
        },
      ],
      tips: [
        "PLA projects are where signatory contractors have an exclusive advantage — seek them out",
        "Your local's Business Agent is your best source of leads on upcoming projects",
        "Prevailing wage compliance is automatic when you pay CBA rates — huge competitive advantage on public work",
        "Join your local Building Trades Council for networking and project intelligence",
        "IMPACT offers estimating and bidding training specifically for ironwork contractors",
        "Consider mentoring under an experienced signatory contractor before going fully independent",
        "Many union GCs have preferred subcontractor lists — get on them by delivering quality work safely",
      ],
      warnings: [
        "Always bid using the correct CBA total package — underbidding will make you lose money on every job",
        "Workers dispatched from the hall are journeymen and apprentices at your local's ratio — plan your crews accordingly",
        "You must provide the same working conditions specified in the CBA — no shortcuts",
        "CBA overtime rules, show-up time, travel pay, and subsistence are all part of your cost — include them in bids",
      ],
      stateSpecific: false,
      aiContext:
        "Bidding as union signatory. PLA projects require union labor. Prevailing wage compliance is built-in. Dispatch through hiring hall. Network with union GCs. IMPACT training available. Factor total CBA package into bids including OT rules, travel pay, subsistence.",
    },
  ],
};
