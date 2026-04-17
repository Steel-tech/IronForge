import type { UserProfile } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";

/**
 * AI Phase Coach — proactive tips shown in the wizard step content.
 *
 * Each tip declares when it's relevant via phaseId (required), optional
 * stepId, and conditions that match against the UserProfile. Tips with
 * higher `priority` are shown first.
 *
 * Tip text can contain the following template tokens, replaced at render
 * time by `renderTipMessage()`:
 *   - {state}        → State name ("Washington")
 *   - {stateCode}    → State code ("WA")
 *   - {sosUrl}       → Secretary of State / LLC filing URL
 *   - {llcFee}       → LLC filing fee (e.g. "$200")
 *   - {licensingUrl} → State contractor licensing URL
 *   - {wcAgency}     → Workers' comp agency
 *   - {wcAgencyUrl}  → Workers' comp agency URL
 *   - {localName}    → Comma-joined list of Ironworkers local names
 */

export interface CoachTip {
  id: string;
  message: string;
  context: string; // human-readable when-to-show summary
  phaseId: string;
  stepId?: string;
  priority: number;
  conditions: {
    states?: string[];
    excludeStates?: string[];
    isVeteran?: boolean;
    isMinority?: boolean;
    isWomanOwned?: boolean;
    isDisabledVeteran?: boolean;
    minExperience?: string; // "0-2" | "3-5" | "5-10" | "10+"
    wcType?: "monopolistic" | "competitive" | "private";
    hasStatePrevailingWage?: boolean;
  };
}

// ── Condition helpers ────────────────────────────────────────

const EXPERIENCE_ORDER: Record<string, number> = {
  "0-2": 0,
  "3-5": 1,
  "5-10": 2,
  "10+": 3,
};

function meetsMinExperience(profile: UserProfile, min: string): boolean {
  const userRank = EXPERIENCE_ORDER[profile.tradeExperience];
  const minRank = EXPERIENCE_ORDER[min];
  if (userRank === undefined || minRank === undefined) return false;
  return userRank >= minRank;
}

// Monopolistic workers' comp states (must use state fund)
export const MONOPOLISTIC_WC_STATES = ["ND", "OH", "WA", "WY"];

// ── Tip catalog (30+ tips) ───────────────────────────────────

export const COACH_TIPS: CoachTip[] = [
  // ═══════════ PHASE 1: Business Formation ═══════════
  {
    id: "bf-sos-online",
    phaseId: "business-formation",
    priority: 90,
    context: "Any state — general LLC formation tip",
    message:
      "In {state}, you can file your LLC online through {sosUrl} — it's faster than mail and usually cheaper. The filing fee is {llcFee}.",
    conditions: {},
  },
  {
    id: "bf-ein-next",
    phaseId: "business-formation",
    priority: 85,
    context: "General — EIN reminder",
    message:
      "Pro tip: Get your EIN from the IRS website (irs.gov/ein) immediately after LLC formation. It's **free** and **instant** — don't pay any third-party service to do it for you.",
    conditions: {},
  },
  {
    id: "bf-s-corp-election",
    phaseId: "business-formation",
    priority: 70,
    context: "Users with 3+ years experience (more likely to hit profit threshold)",
    message:
      "Consider an S-Corp election if you expect profits over **$40K/year** — it can save you meaningful money on self-employment tax. Talk to a CPA before electing.",
    conditions: { minExperience: "3-5" },
  },
  {
    id: "bf-bank-account-early",
    phaseId: "business-formation",
    priority: 75,
    context: "General — banking",
    message:
      "Open your business bank account the **same week** you get your EIN. Never mix personal and business funds — it voids your LLC's liability protection ('piercing the corporate veil').",
    conditions: {},
  },
  {
    id: "bf-no-sales-tax-states",
    phaseId: "business-formation",
    priority: 65,
    context: "States with no sales tax",
    message:
      "Heads up — {state} has no state sales tax, but you may still owe **use tax** on out-of-state tool purchases. And localities can levy their own taxes.",
    conditions: { states: ["AK", "DE", "MT", "NH", "OR"] },
  },

  // ═══════════ PHASE 2: Licensing ═══════════
  {
    id: "lic-wa-li-separate",
    phaseId: "contractor-licensing",
    priority: 95,
    context: "Washington-specific",
    message:
      "Washington requires the **L&I contractor registration** — it's separate from the business license. You need both: the Business License Application (BLS) for the entity, and the specialty/general registration through L&I.",
    conditions: { states: ["WA"] },
  },
  {
    id: "lic-prevailing-wage",
    phaseId: "contractor-licensing",
    priority: 80,
    context: "States with prevailing wage laws",
    message:
      "{state} enforces **prevailing wage** on public projects. Factor this into your bids — wages on public work can be 1.5-2x private-sector rates, plus fringes. Certified payroll reports are required.",
    conditions: { hasStatePrevailingWage: true },
  },
  {
    id: "lic-ca-classification",
    phaseId: "contractor-licensing",
    priority: 90,
    context: "California — CSLB",
    message:
      "California ironwork falls under **C-51 (Structural Steel)** or **C-50 (Reinforcing Steel)**. Get the right classification from day one — switching later means re-exams and fees.",
    conditions: { states: ["CA"] },
  },
  {
    id: "lic-no-state-license",
    phaseId: "contractor-licensing",
    priority: 85,
    context: "States without state-level contractor license",
    message:
      "{state} doesn't require a state-level contractor license, but **city and county** licenses are almost always required. Check each jurisdiction where you plan to work.",
    conditions: {
      states: ["CO", "ID", "KS", "ME", "NH", "OH", "PA", "TX", "VT", "WY"],
    },
  },
  {
    id: "lic-exam-study",
    phaseId: "contractor-licensing",
    priority: 70,
    context: "Newer contractors taking exams",
    message:
      "If {state} requires a contractor exam, invest in a **prep course** (NASCLA, PSI prep). First-time pass rates are ~60% — studying is cheaper than retaking.",
    conditions: { minExperience: "0-2" },
  },

  // ═══════════ PHASE 3: Bonding ═══════════
  {
    id: "bond-credit-680",
    phaseId: "surety-bonding",
    priority: 95,
    context: "General — bonding credit threshold",
    message:
      "Most surety companies want to see a personal credit score of **680+** for new contractors. If yours is below that, start with a high-risk market (2-5% rates) and build track record.",
    conditions: {},
  },
  {
    id: "bond-start-small",
    phaseId: "surety-bonding",
    priority: 85,
    context: "General — don't overextend",
    message:
      "Start with a **$25-50K bond line** and grow it. Sureties hate seeing new contractors try to jump to $1M bonds — it looks desperate. Stack a few clean, completed jobs first.",
    conditions: {},
  },
  {
    id: "bond-personal-indemnity",
    phaseId: "surety-bonding",
    priority: 80,
    context: "General — personal indemnity",
    message:
      "Surety bonds are not insurance — they're **credit**. You (and your spouse) will sign a personal indemnity agreement. If the bond pays out, the surety comes after your personal assets.",
    conditions: {},
  },
  {
    id: "bond-wa-12k",
    phaseId: "surety-bonding",
    priority: 90,
    context: "Washington — specific bond amount",
    message:
      "Washington requires a **$12K** general contractor bond or **$6K** specialty bond for L&I registration. This is a separate requirement from any project-specific bonds.",
    conditions: { states: ["WA"] },
  },

  // ═══════════ PHASE 4: Insurance ═══════════
  {
    id: "ins-monopolistic-wc",
    phaseId: "insurance",
    priority: 100,
    context: "Monopolistic workers' comp states",
    message:
      "⚠️ {state} has a **monopolistic workers' comp fund**. You MUST use the state fund ({wcAgency}) — no private carriers are allowed. Get registered at {wcAgencyUrl} before hiring your first employee.",
    conditions: { wcType: "monopolistic" },
  },
  {
    id: "ins-gl-first",
    phaseId: "insurance",
    priority: 95,
    context: "General — GL first",
    message:
      "Get your **General Liability policy in place before bidding any work**. GCs will require a Certificate of Insurance (COI) listing them as Additional Insured — and they need that before you step on site.",
    conditions: {},
  },
  {
    id: "ins-ironwork-class-code",
    phaseId: "insurance",
    priority: 85,
    context: "Ironworkers specifically",
    message:
      "Ironwork is a **high-hazard class** for insurers (WC class codes 5040/5102/5059, GL class 91746). Expect GL at $5-15K/year, WC at 15-25% of payroll. Budget accordingly.",
    conditions: {},
  },
  {
    id: "ins-umbrella",
    phaseId: "insurance",
    priority: 70,
    context: "Experienced contractors",
    message:
      "Once you're running jobs over **$250K**, add a **$1M umbrella policy**. Most commercial GCs require $2M aggregate minimum — umbrella is the cheapest way to get there.",
    conditions: { minExperience: "5-10" },
  },
  {
    id: "ins-tools-equipment",
    phaseId: "insurance",
    priority: 65,
    context: "General — inland marine",
    message:
      "Add an **Inland Marine (tools & equipment)** policy. Your GL does NOT cover your own tools, and losing a $40K welding rig to theft overnight will end your business.",
    conditions: {},
  },

  // ═══════════ PHASE 5: Certifications ═══════════
  {
    id: "cert-sdvosb",
    phaseId: "certifications",
    priority: 100,
    context: "Disabled veterans",
    message:
      "🎖️ As a service-disabled veteran, **prioritize SDVOSB certification** through the VA SBA portal. It opens **federal set-asides** — roughly 3% of federal spend is reserved for SDVOSB firms ($25B+/year).",
    conditions: { isDisabledVeteran: true },
  },
  {
    id: "cert-vosb",
    phaseId: "certifications",
    priority: 90,
    context: "Veterans (non-disabled)",
    message:
      "As a veteran, you qualify for **VOSB** certification — plus state-level preference programs (many states have them). Check {state}'s state procurement office.",
    conditions: { isVeteran: true, isDisabledVeteran: false },
  },
  {
    id: "cert-mbe-dbe",
    phaseId: "certifications",
    priority: 95,
    context: "Minority business owners",
    message:
      "Your **MBE/DBE certification** can give you a significant advantage on public contracts — federally funded highway, transit, and airport projects have DBE goals of 10-15%. Start with your state UCP.",
    conditions: { isMinority: true },
  },
  {
    id: "cert-wosb-free",
    phaseId: "certifications",
    priority: 95,
    context: "Woman-owned businesses",
    message:
      "**WOSB certification through SBA is free** and opens women-owned set-asides. There's also EDWOSB for economically disadvantaged women — additional set-asides on top.",
    conditions: { isWomanOwned: true },
  },
  {
    id: "cert-8a-program",
    phaseId: "certifications",
    priority: 85,
    context: "Minority + possibly disadvantaged",
    message:
      "Look into **SBA 8(a) Business Development**. Minority-owned firms can get up to 9 years of federal set-aside eligibility, mentor-protégé relationships, and sole-source contracts up to $4.5M.",
    conditions: { isMinority: true },
  },
  {
    id: "cert-hubzone",
    phaseId: "certifications",
    priority: 70,
    context: "General — geographic advantage",
    message:
      "Check if your business address is in a **HUBZone** (sba.gov/hubzone). If yes, you get federal set-aside access — and 3% of federal contract dollars are reserved for HUBZone firms.",
    conditions: {},
  },

  // ═══════════ PHASE 6: Union ═══════════
  {
    id: "union-contact-ba",
    phaseId: "union-signatory",
    priority: 95,
    context: "All states — general union advice",
    message:
      "Contact your local ({localName}) early. The **Business Agent (BA)** can walk you through the signatory process — they'd rather onboard you properly than see you cut corners.",
    conditions: {},
  },
  {
    id: "union-signatory-value",
    phaseId: "union-signatory",
    priority: 85,
    context: "General — value of signatory",
    message:
      "Going signatory unlocks **union manpower** when you need to scale (hall calls, travelers) and makes you eligible for PLA/project labor agreement work. On big jobs, that's the difference between bidding and not bidding.",
    conditions: {},
  },
  {
    id: "union-fringes-math",
    phaseId: "union-signatory",
    priority: 75,
    context: "General — fringes budgeting",
    message:
      "Union **fringes (H&W, pension, annuity, training)** typically add 35-55% on top of base wages. Build this into your estimating template before your first signatory bid.",
    conditions: {},
  },

  // ═══════════ PHASE 7: Legal / Federal ═══════════
  {
    id: "legal-capability-statement",
    phaseId: "legal-federal",
    priority: 95,
    context: "General — federal contracting",
    message:
      "Your **capability statement** is your marketing document for government work. Keep it to **1 page**: Core competencies, Past performance, Differentiators, Company data (DUNS/UEI, NAICS, POC). Make it sharp.",
    conditions: {},
  },
  {
    id: "legal-sam-registration",
    phaseId: "legal-federal",
    priority: 90,
    context: "General — SAM.gov",
    message:
      "**SAM.gov registration is free** — never pay a third-party service to do it. The process takes 2-4 weeks. Start now even if you're not ready to bid federal yet.",
    conditions: {},
  },
  {
    id: "legal-naics-codes",
    phaseId: "legal-federal",
    priority: 80,
    context: "General — NAICS",
    message:
      "For ironwork, your primary NAICS codes are **238120 (Structural Steel & Precast Concrete)** and **238190 (Other Foundation, Structure, Exterior)**. Size standard is $19M avg annual receipts for small business.",
    conditions: {},
  },
  {
    id: "legal-attorney-review",
    phaseId: "legal-federal",
    priority: 100,
    context: "General — attorney advice",
    message:
      "⚖️ Find a **construction attorney** in {state} before you sign your first subcontract. $500 for 2 hours of review will save you from 6-figure mistakes in indemnification and pay-if-paid clauses.",
    conditions: {},
  },
  {
    id: "legal-lien-rights",
    phaseId: "legal-federal",
    priority: 85,
    context: "General — mechanic's lien",
    message:
      "Learn {state}'s **mechanic's lien** deadlines cold. Most states require preliminary notices within 20-45 days of starting work, and lien filing within 60-90 days of last work. Miss the deadline and your leverage is gone.",
    conditions: {},
  },
];

// ── Rendering + selection ────────────────────────────────────

/**
 * Replace {tokens} in a tip message with profile/state data.
 * Tokens that have no data resolve to an empty string.
 */
export function renderTipMessage(
  message: string,
  profile: UserProfile
): string {
  const state = profile.state ? STATE_REGISTRY[profile.state] : undefined;
  const localNames =
    state?.ironworkersLocals?.map((l) => l.name).join(", ") ||
    "your local Ironworkers chapter";

  const tokens: Record<string, string> = {
    state: state?.name ?? "your state",
    stateCode: profile.state ?? "",
    sosUrl: state?.llcFilingUrl ?? "your Secretary of State website",
    llcFee: state ? `$${state.llcFilingFee}` : "",
    licensingUrl: state?.licensingUrl ?? "",
    wcAgency: state?.wcAgency ?? "the state workers' comp fund",
    wcAgencyUrl: state?.wcAgencyUrl ?? "",
    localName: localNames,
  };

  return message.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? "");
}

/**
 * Returns the tips relevant to a given phase/step/profile, sorted by
 * priority DESC. Exclude dismissed ids from the caller.
 */
export function getRelevantTips(params: {
  phaseId: string;
  stepId?: string;
  profile: UserProfile;
  dismissedIds?: string[];
}): CoachTip[] {
  const { phaseId, stepId, profile, dismissedIds = [] } = params;
  const state = profile.state ? STATE_REGISTRY[profile.state] : undefined;
  const dismissed = new Set(dismissedIds);

  return COACH_TIPS.filter((tip) => {
    if (tip.phaseId !== phaseId) return false;
    if (tip.stepId && stepId && tip.stepId !== stepId) return false;
    if (dismissed.has(tip.id)) return false;

    const c = tip.conditions;

    if (c.states && profile.state && !c.states.includes(profile.state)) {
      return false;
    }
    if (c.states && !profile.state) return false;

    if (c.excludeStates && profile.state && c.excludeStates.includes(profile.state)) {
      return false;
    }

    if (c.isVeteran !== undefined && profile.isVeteran !== c.isVeteran) {
      return false;
    }
    if (
      c.isDisabledVeteran !== undefined &&
      profile.isDisabledVeteran !== c.isDisabledVeteran
    ) {
      return false;
    }
    if (c.isMinority !== undefined && profile.isMinority !== c.isMinority) {
      return false;
    }
    if (c.isWomanOwned !== undefined && profile.isWomanOwned !== c.isWomanOwned) {
      return false;
    }

    if (c.minExperience && !meetsMinExperience(profile, c.minExperience)) {
      return false;
    }

    if (c.wcType && state && state.wcType !== c.wcType) return false;
    if (c.wcType && !state) return false;

    if (
      c.hasStatePrevailingWage !== undefined &&
      state &&
      state.hasStatePrevailingWage !== c.hasStatePrevailingWage
    ) {
      return false;
    }
    if (c.hasStatePrevailingWage !== undefined && !state) return false;

    return true;
  }).sort((a, b) => b.priority - a.priority);
}
