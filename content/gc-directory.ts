// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * General Contractor Directory
 *
 * A curated list of major GCs that commonly hire ironwork (structural steel,
 * rebar, precast, miscellaneous metals) subcontractors. Data is drawn from
 * publicly available information on company websites and press pages. State
 * coverage lists are best-effort "active markets" — GCs pursue work anywhere,
 * so treat the list as a starting point, not gospel.
 */

export type ProjectType =
  | "commercial"
  | "industrial"
  | "bridge"
  | "healthcare"
  | "education"
  | "government"
  | "residential"
  | "aviation"
  | "energy"
  | "data-center"
  | "sports"
  | "transit"
  | "hospitality";

export type GcSize = "national" | "regional" | "local";

export interface GeneralContractor {
  name: string;
  hq: string;
  website: string;
  /** Two-letter state codes where the GC is publicly active. */
  states: string[];
  projectTypes: ProjectType[];
  size: GcSize;
  prequalRequired: boolean;
  unionPreferred: boolean;
  description: string;
  subcontractorPortalUrl?: string;
}

export const ALL_PROJECT_TYPES: ProjectType[] = [
  "commercial",
  "industrial",
  "bridge",
  "healthcare",
  "education",
  "government",
  "residential",
  "aviation",
  "energy",
  "data-center",
  "sports",
  "transit",
  "hospitality",
];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  commercial: "Commercial",
  industrial: "Industrial",
  bridge: "Bridge / Infrastructure",
  healthcare: "Healthcare",
  education: "Education",
  government: "Government / Public",
  residential: "Residential / Multifamily",
  aviation: "Aviation",
  energy: "Energy / Power",
  "data-center": "Data Center",
  sports: "Sports / Entertainment",
  transit: "Transit",
  hospitality: "Hospitality / Hotel",
};

// All 50 state codes, for the "national" GCs that work nearly everywhere.
const ALL_STATES: string[] = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export const GC_DIRECTORY: GeneralContractor[] = [
  // ───────── NATIONAL ─────────
  {
    name: "Turner Construction",
    hq: "New York, NY",
    website: "https://www.turnerconstruction.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "healthcare",
      "education",
      "sports",
      "aviation",
      "data-center",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Top-ranked US builder with strong signatory presence; deep healthcare, higher-ed, and aviation portfolios.",
    subcontractorPortalUrl: "https://turnerconstruction.com/subcontractors",
  },
  {
    name: "Skanska USA",
    hq: "New York, NY",
    website: "https://www.usa.skanska.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "healthcare",
      "transit",
      "bridge",
      "aviation",
      "government",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Global builder and civil contractor; large bridge/transit book and signatory on most markets.",
    subcontractorPortalUrl:
      "https://www.usa.skanska.com/who-we-are/suppliers-and-subcontractors/",
  },
  {
    name: "Hensel Phelps",
    hq: "Greeley, CO",
    website: "https://www.henselphelps.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "aviation",
      "government",
      "healthcare",
      "education",
      "data-center",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Employee-owned builder known for aviation terminals, federal work, and mission-critical projects.",
    subcontractorPortalUrl: "https://www.henselphelps.com/subcontractors/",
  },
  {
    name: "Clark Construction",
    hq: "Bethesda, MD",
    website: "https://www.clarkconstruction.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "government",
      "sports",
      "transit",
      "education",
      "healthcare",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Heavy civil + commercial builder with stadiums, federal, and large public infrastructure.",
    subcontractorPortalUrl:
      "https://www.clarkconstruction.com/work-with-us/subcontractors",
  },
  {
    name: "Whiting-Turner",
    hq: "Baltimore, MD",
    website: "https://www.whiting-turner.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "healthcare",
      "education",
      "industrial",
      "data-center",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "One of the largest US CMs; heavy in semiconductor fabs, higher-ed, and corporate campuses.",
    subcontractorPortalUrl: "https://www.whiting-turner.com/subcontractors/",
  },
  {
    name: "Mortenson",
    hq: "Minneapolis, MN",
    website: "https://www.mortenson.com/",
    states: ALL_STATES,
    projectTypes: [
      "sports",
      "healthcare",
      "energy",
      "education",
      "commercial",
      "data-center",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Builder behind many NFL/MLB venues, large wind/solar farms, and flagship university builds.",
    subcontractorPortalUrl: "https://www.mortenson.com/subcontractors",
  },
  {
    name: "McCarthy Building Companies",
    hq: "St. Louis, MO",
    website: "https://www.mccarthy.com/",
    states: ALL_STATES,
    projectTypes: [
      "healthcare",
      "education",
      "commercial",
      "industrial",
      "energy",
      "transit",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Employee-owned national with deep healthcare and solar-field portfolios.",
    subcontractorPortalUrl: "https://www.mccarthy.com/subcontractors",
  },
  {
    name: "Holder Construction",
    hq: "Atlanta, GA",
    website: "https://www.holderconstruction.com/",
    states: ALL_STATES,
    projectTypes: ["commercial", "data-center", "education", "healthcare"],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Corporate interiors and hyperscale data centers; one of the largest data-center GCs in the US.",
  },
  {
    name: "Brasfield & Gorrie",
    hq: "Birmingham, AL",
    website: "https://www.brasfieldgorrie.com/",
    states: [
      "AL", "GA", "FL", "TN", "NC", "SC", "MS", "LA", "TX", "VA", "KY",
    ],
    projectTypes: [
      "healthcare",
      "commercial",
      "industrial",
      "education",
      "data-center",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Southeast-anchored builder; top-20 US GC with broad healthcare and industrial book.",
    subcontractorPortalUrl:
      "https://www.brasfieldgorrie.com/subcontractors-suppliers/",
  },
  {
    name: "DPR Construction",
    hq: "Newark, CA",
    website: "https://www.dpr.com/",
    states: ALL_STATES,
    projectTypes: [
      "healthcare",
      "commercial",
      "education",
      "data-center",
      "industrial",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Technical builder specializing in healthcare, life sciences, advanced tech, and higher-ed.",
    subcontractorPortalUrl: "https://www.dpr.com/company/trade-partners",
  },
  {
    name: "Gilbane Building Company",
    hq: "Providence, RI",
    website: "https://www.gilbaneco.com/",
    states: ALL_STATES,
    projectTypes: [
      "education",
      "healthcare",
      "government",
      "commercial",
      "sports",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Family-owned national; deep public-sector and K-12/higher-ed portfolios.",
    subcontractorPortalUrl: "https://www.gilbaneco.com/subcontractors/",
  },
  {
    name: "PCL Construction",
    hq: "Denver, CO (US HQ)",
    website: "https://www.pcl.com/us",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "aviation",
      "healthcare",
      "bridge",
      "energy",
      "sports",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Employee-owned; strong in aviation terminals, solar, and complex concrete/steel work.",
    subcontractorPortalUrl: "https://www.pcl.com/us/en/trade-partners",
  },
  {
    name: "Kiewit",
    hq: "Omaha, NE",
    website: "https://www.kiewit.com/",
    states: ALL_STATES,
    projectTypes: [
      "bridge",
      "transit",
      "energy",
      "industrial",
      "government",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Heavy civil and industrial giant; signature bridges, power plants, and LNG terminals.",
    subcontractorPortalUrl: "https://www.kiewit.com/suppliers-subcontractors/",
  },
  {
    name: "AECOM (AECOM Hunt)",
    hq: "Dallas, TX",
    website: "https://aecom.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "transit",
      "sports",
      "aviation",
      "government",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Global engineering + construction. AECOM Hunt builds stadiums, convention centers, and airports.",
  },
  {
    name: "Jacobs",
    hq: "Dallas, TX",
    website: "https://www.jacobs.com/",
    states: ALL_STATES,
    projectTypes: [
      "industrial",
      "energy",
      "transit",
      "government",
      "aviation",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Engineering-led giant with federal, water, transit, and advanced-manufacturing construction.",
  },
  {
    name: "Balfour Beatty US",
    hq: "Dallas, TX",
    website: "https://www.balfourbeattyus.com/",
    states: ALL_STATES,
    projectTypes: [
      "commercial",
      "government",
      "education",
      "aviation",
      "transit",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "US arm of UK-based Balfour Beatty; strong military housing, higher-ed, and aviation lines.",
    subcontractorPortalUrl:
      "https://www.balfourbeattyus.com/expertise/trade-partners",
  },
  {
    name: "Walsh Group",
    hq: "Chicago, IL",
    website: "https://www.walshgroup.com/",
    states: ALL_STATES,
    projectTypes: [
      "bridge",
      "transit",
      "commercial",
      "aviation",
      "healthcare",
      "government",
    ],
    size: "national",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Family-owned; top bridge builder in North America plus major airport and transit work.",
    subcontractorPortalUrl: "https://www.walshgroup.com/subcontractors",
  },

  // ───────── REGIONAL ─────────
  {
    name: "Andersen Construction",
    hq: "Portland, OR",
    website: "https://www.andersen-const.com/",
    states: ["OR", "WA", "ID", "CA"],
    projectTypes: ["commercial", "healthcare", "education", "industrial"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Pacific Northwest mainstay; consistent hospital, higher-ed, and tech campus work.",
    subcontractorPortalUrl: "https://www.andersen-const.com/subcontractors/",
  },
  {
    name: "Howard S. Wright (Balfour Beatty)",
    hq: "Seattle, WA",
    website: "https://www.balfourbeattyus.com/our-work/regions/northwest",
    states: ["WA", "OR", "CA", "AK"],
    projectTypes: ["commercial", "healthcare", "sports", "aviation"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Historic PNW builder now operating as Balfour Beatty's Northwest region.",
  },
  {
    name: "Sellen Construction",
    hq: "Seattle, WA",
    website: "https://www.sellen.com/",
    states: ["WA"],
    projectTypes: ["commercial", "healthcare", "education"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Employee-owned Seattle GC with a deep downtown high-rise and campus portfolio.",
    subcontractorPortalUrl: "https://www.sellen.com/subcontractors",
  },
  {
    name: "Lease Crutcher Lewis",
    hq: "Seattle, WA",
    website: "https://www.lewisbuilds.com/",
    states: ["WA", "OR"],
    projectTypes: ["commercial", "healthcare", "education", "industrial"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "PNW builder with strong tech, healthcare, and higher-ed backlog in Seattle and Portland.",
  },
  {
    name: "Hoffman Construction",
    hq: "Portland, OR",
    website: "https://www.hoffmancorp.com/",
    states: ["OR", "WA", "ID", "UT", "NV"],
    projectTypes: ["commercial", "healthcare", "industrial", "education"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Portland-based heavy commercial contractor; major healthcare, fabs, and data centers.",
    subcontractorPortalUrl: "https://www.hoffmancorp.com/subcontractors/",
  },
  {
    name: "Barton Malow",
    hq: "Southfield, MI",
    website: "https://www.bartonmalow.com/",
    states: [
      "MI", "OH", "IN", "IL", "WI", "PA", "GA", "FL", "NC", "SC", "TX",
    ],
    projectTypes: [
      "industrial",
      "sports",
      "education",
      "healthcare",
      "commercial",
    ],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Midwest-anchored builder known for automotive plants, arenas, and K-12 programs.",
    subcontractorPortalUrl:
      "https://www.bartonmalow.com/trade-partners/",
  },
  {
    name: "Pepper Construction",
    hq: "Chicago, IL",
    website: "https://www.pepperconstruction.com/",
    states: ["IL", "IN", "OH", "WI"],
    projectTypes: ["commercial", "healthcare", "education", "industrial"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Midwest commercial builder with broad Chicago-area presence and signatory relationships.",
  },
  {
    name: "Power Construction",
    hq: "Chicago, IL",
    website: "https://www.powerconstruction.net/",
    states: ["IL", "IN", "WI"],
    projectTypes: ["commercial", "healthcare", "residential", "education"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Chicago-area builder; frequent high-rise residential and healthcare delivery.",
  },
  {
    name: "Webcor",
    hq: "San Francisco, CA",
    website: "https://www.webcor.com/",
    states: ["CA"],
    projectTypes: [
      "commercial",
      "healthcare",
      "residential",
      "education",
      "transit",
    ],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "California builder; Salesforce Tower, SFO expansions, and major UC system work.",
    subcontractorPortalUrl: "https://www.webcor.com/subcontractors/",
  },
  {
    name: "Swinerton",
    hq: "San Francisco, CA",
    website: "https://swinerton.com/",
    states: ["CA", "OR", "WA", "TX", "CO", "HI", "AZ", "NC", "SC"],
    projectTypes: [
      "commercial",
      "education",
      "healthcare",
      "residential",
      "energy",
    ],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "100% employee-owned; West Coast leader plus growing solar/renewables division.",
  },
  {
    name: "Hunt Construction Group (AECOM Hunt)",
    hq: "Indianapolis, IN",
    website:
      "https://aecom.com/construction-services/aecom-hunt/",
    states: ["IN", "TX", "AZ", "NV", "FL", "CA"],
    projectTypes: ["sports", "aviation", "commercial", "government"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Stadium and convention-center specialist operating within AECOM's construction arm.",
  },
  {
    name: "Haskell",
    hq: "Jacksonville, FL",
    website: "https://www.haskell.com/",
    states: [
      "FL", "GA", "AL", "SC", "NC", "TX", "TN", "MO", "OH", "MI",
    ],
    projectTypes: [
      "industrial",
      "commercial",
      "healthcare",
      "government",
      "energy",
    ],
    size: "regional",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Design-build heavy in food & beverage plants, manufacturing, and federal infrastructure.",
  },
  {
    name: "JE Dunn Construction",
    hq: "Kansas City, MO",
    website: "https://www.jedunn.com/",
    states: [
      "MO", "KS", "IA", "NE", "CO", "TX", "TN", "GA", "FL", "NC",
      "MN", "OK", "AZ",
    ],
    projectTypes: [
      "commercial",
      "healthcare",
      "education",
      "government",
      "sports",
    ],
    size: "regional",
    prequalRequired: true,
    unionPreferred: true,
    description:
      "Employee-owned top-25 US GC with strong federal, healthcare, and corporate campus lines.",
    subcontractorPortalUrl: "https://www.jedunn.com/subcontractors/",
  },
  {
    name: "Manhattan Construction",
    hq: "Tulsa, OK",
    website: "https://www.manhattanconstruction.com/",
    states: ["OK", "TX", "FL", "DC", "VA"],
    projectTypes: ["sports", "government", "aviation", "commercial"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Stadium and capitol builder — Mercedes-Benz Stadium, US Capitol Visitor Center.",
  },
  {
    name: "Layton Construction",
    hq: "Sandy, UT",
    website: "https://laytonconstruction.com/",
    states: ["UT", "ID", "AZ", "NV", "TN", "FL", "HI", "CO", "TX"],
    projectTypes: ["healthcare", "commercial", "hospitality", "industrial"],
    size: "regional",
    prequalRequired: true,
    unionPreferred: false,
    description:
      "Mountain West / Sunbelt GC with a strong healthcare and hospitality portfolio.",
  },
];

