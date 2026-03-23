import type { Phase } from "@/lib/types/content";

export const insuranceEducation: Phase = {
  id: "insurance",
  title: "Insurance Coverage",
  description: "Essential insurance for ironwork contractors",
  icon: "ShieldCheck",
  steps: [
    {
      id: "general-liability",
      title: "General Liability Insurance",
      description:
        "General liability (GL) is your most important insurance policy. It covers bodily injury, property damage, and completed operations claims arising from your work. Most project owners and general contractors require you to carry at least $1M per occurrence / $2M aggregate. For structural steel and ironwork, expect higher premiums due to the inherent risks of the trade.",
      estimatedTime: "1-2 weeks to shop and bind",
      estimatedCost: { min: 2000, max: 8000, notes: "Annual premium varies by revenue, experience, and claims history" },
      checklist: [
        {
          id: "gl-minimum",
          label: "Obtain GL insurance ($1M/$2M minimum recommended)",
          description: "Per occurrence/aggregate - most GCs require these minimums",
          required: true,
        },
        {
          id: "completed-operations",
          label: "Ensure completed operations coverage is included",
          description: "Covers claims arising from your completed work",
          required: true,
        },
        {
          id: "additional-insured",
          label: "Understand additional insured endorsements",
          description: "GCs and project owners will require being added as additional insureds",
          required: true,
        },
        {
          id: "coi-process",
          label: "Set up Certificate of Insurance (COI) process",
          description: "You'll need to issue COIs frequently - make sure your agent is responsive",
          required: true,
        },
      ],
      resources: [
        {
          title: "IRMI - Construction Insurance Guide",
          url: "https://www.irmi.com/online/insurance-glossary/construction-insurance",
          description: "Industry resource on construction insurance",
          type: "guide",
        },
      ],
      tips: [
        "Shop with an insurance agent who specializes in construction - they know the right carriers",
        "Don't just go for the cheapest policy - coverage quality matters when you have a claim",
        "Higher deductibles = lower premiums. Find the balance you can afford",
        "Many GCs require $2M/$5M limits for structural steel work - umbrella policies can help reach higher limits cheaply",
        "Your GL premium is typically based on your annual revenue - it adjusts at audit time",
      ],
      warnings: [
        "Ironwork is classified as high-hazard - expect higher premiums than many other trades",
        "A gap in coverage can disqualify you from bidding - never let your policy lapse",
        "Claims history follows you - even one claim can significantly increase your premiums",
      ],
      stateSpecific: false,
      aiContext:
        "GL insurance for ironwork. Minimum $1M/$2M recommended, many GCs require $2M/$5M for structural steel. Premium $2K-$8K+ based on revenue. High-hazard classification for ironwork. COIs required frequently.",
    },
    {
      id: "commercial-auto",
      title: "Commercial Auto Insurance",
      description:
        "If you use any vehicles for business purposes (hauling equipment, driving to job sites, company trucks), you need commercial auto insurance. Personal auto policies typically exclude business use, and a personal policy claim during business use can be denied.",
      estimatedTime: "1 week",
      estimatedCost: { min: 1200, max: 4000, notes: "Per vehicle, varies by vehicle type and driving record" },
      checklist: [
        {
          id: "commercial-auto-policy",
          label: "Obtain commercial auto policy",
          description: "Covers all vehicles used for business purposes",
          required: true,
        },
        {
          id: "hired-non-owned",
          label: "Add hired & non-owned auto coverage",
          description: "Covers vehicles you rent or employee-owned vehicles used for business",
          required: false,
        },
      ],
      resources: [
        {
          title: "NAIC - Commercial Auto Insurance",
          url: "https://www.iii.org/article/commercial-auto-insurance",
          description: "Understanding commercial auto insurance",
          type: "guide",
        },
      ],
      tips: [
        "Bundle commercial auto with your GL for potential discounts",
        "If employees drive company vehicles, their driving records affect your premium",
        "Consider higher liability limits - a serious accident can exceed minimums quickly",
      ],
      warnings: [
        "Personal auto policies DO NOT cover business use - claims will be denied",
        "Using personal vehicles for business without commercial coverage creates a gap",
      ],
      stateSpecific: false,
      aiContext: "Commercial auto insurance. Required for any business vehicle use. $1,200-$4,000+ per vehicle. Hired & non-owned coverage recommended.",
    },
    {
      id: "tools-equipment",
      title: "Tools & Equipment Coverage (Inland Marine)",
      description:
        "Inland marine insurance covers your tools, equipment, and materials in transit or at job sites. Standard property insurance typically doesn't cover items away from your primary business location. For ironworkers, this includes welding equipment, rigging gear, power tools, and fabrication equipment.",
      estimatedTime: "1 week",
      estimatedCost: { min: 500, max: 3000, notes: "Based on total equipment value" },
      checklist: [
        {
          id: "inventory-equipment",
          label: "Create a complete equipment inventory with values",
          description: "List all tools and equipment with replacement costs - photograph everything",
          required: true,
        },
        {
          id: "inland-marine-policy",
          label: "Obtain inland marine / tools coverage",
          description: "Covers tools and equipment at job sites, in transit, and in storage",
          required: true,
        },
      ],
      resources: [],
      tips: [
        "Photograph and serial-number all major tools and equipment",
        "Keep your inventory list updated - new purchases need to be added",
        "Some policies cover rented equipment too - useful if you rent cranes or other heavy equipment",
        "Equipment breakdown coverage can be added for mechanical/electrical failure",
      ],
      warnings: [
        "Standard GL and property policies typically exclude tools at job sites",
        "Stolen tools are a major issue in construction - document everything",
      ],
      stateSpecific: false,
      aiContext: "Inland marine / tools coverage. $500-$3,000+ based on equipment value. Covers tools/equipment at job sites, in transit. Separate from GL and property insurance.",
    },
    {
      id: "umbrella-liability",
      title: "Umbrella / Excess Liability Insurance",
      description:
        "An umbrella policy provides additional liability coverage above your underlying GL, auto, and employer's liability limits. For ironwork contractors, where a single accident could result in a multi-million dollar claim, umbrella coverage is highly recommended. It's also the most cost-effective way to meet higher limit requirements from GCs.",
      estimatedTime: "1 week (usually bundled)",
      estimatedCost: { min: 800, max: 3000, notes: "Per $1M of additional coverage" },
      checklist: [
        {
          id: "assess-umbrella-need",
          label: "Assess your umbrella coverage needs",
          description: "Most GCs require $1M-$5M total limits for structural steel work",
          required: true,
        },
        {
          id: "obtain-umbrella",
          label: "Obtain umbrella policy",
          description: "$1M-$5M umbrella over your GL, auto, and employer's liability",
          required: false,
        },
      ],
      resources: [],
      tips: [
        "Umbrella coverage is relatively cheap compared to increasing underlying policy limits",
        "$1M umbrella often costs $800-$1,500/year - much cheaper than doubling your GL limits",
        "Many GCs require higher limits for structural steel - umbrella is how you meet them affordably",
      ],
      warnings: [
        "Make sure your umbrella follows the same policy form as your underlying GL",
        "Umbrella policies have minimum underlying limits - verify your GL meets them",
      ],
      stateSpecific: false,
      aiContext: "Umbrella/excess liability. $800-$3,000 per $1M. Cost-effective way to meet higher GC limit requirements. Sits over GL, auto, employer's liability.",
    },
  ],
};
