/**
 * Compliance Calendar Data Engine
 * Generates a personalized list of compliance deadlines based on the user's
 * state and business start date. Pure, side-effect-free helpers — safe to use
 * in both client and server contexts.
 */

import { STATE_REGISTRY } from "@/content/state-registry";
import type { UserProfile } from "@/lib/types/wizard";

export type ComplianceCategory =
  | "formation"
  | "licensing"
  | "insurance"
  | "bonding"
  | "tax"
  | "certification"
  | "osha";

export type CompliancePriority = "critical" | "important" | "info";

export type RecurrenceInterval = "monthly" | "quarterly" | "annually";

export interface ComplianceEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: ComplianceCategory;
  recurring: boolean;
  recurrenceInterval?: RecurrenceInterval;
  priority: CompliancePriority;
  phaseId?: string;
  completed: boolean;
}

export const CATEGORY_COLORS: Record<ComplianceCategory, string> = {
  formation: "neon-cyan",
  licensing: "neon-blue",
  insurance: "neon-green",
  bonding: "neon-amber",
  tax: "neon-magenta",
  certification: "neon-purple",
  osha: "neon-red",
};

export const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  formation: "Formation",
  licensing: "Licensing",
  insurance: "Insurance",
  bonding: "Bonding",
  tax: "Tax",
  certification: "Certification",
  osha: "OSHA",
};

/** Generate a date N years from start, same month/day. */
function addYears(base: Date, years: number): Date {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Stable UTC-noon date helper so local TZ never shifts a day backwards. */
function makeDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 9, 0, 0));
}

interface GenerateOptions {
  /** Business start date. If omitted, uses today. */
  startDate: Date;
  /** How many years of forward-looking events to project. Default 3. */
  horizonYears?: number;
  /** Completed event IDs (to set `completed: true`). */
  completedIds?: string[];
  /** User profile — used for state-specific + certification events. */
  profile: UserProfile;
}

/** True if the user qualifies for SAM.gov (most federally-interested folks do). */
function usesSam(profile: UserProfile): boolean {
  return (
    profile.isVeteran ||
    profile.isDisabledVeteran ||
    profile.isMinority ||
    profile.isWomanOwned
  );
}

/**
 * Generate all compliance events for the user over the given horizon.
 * Returns events sorted ascending by date.
 */
export function generateComplianceEvents(
  options: GenerateOptions,
): ComplianceEvent[] {
  const {
    startDate,
    horizonYears = 3,
    completedIds = [],
    profile,
  } = options;

  const events: ComplianceEvent[] = [];
  const completed = new Set(completedIds);
  const stateData = profile.state ? STATE_REGISTRY[profile.state] : null;

  const startYear = startDate.getUTCFullYear();
  const endYear = startYear + horizonYears;

  const push = (e: Omit<ComplianceEvent, "completed">) => {
    events.push({ ...e, completed: completed.has(e.id) });
  };

  // ── FORMATION: Annual report ────────────────────────────────────────
  // Use anniversary of formation as the default (most states), unless
  // state data suggests otherwise (currently we just use anniversary).
  if (stateData && stateData.annualReportName) {
    for (let y = 1; y <= horizonYears; y++) {
      const date = addYears(startDate, y);
      push({
        id: `formation-annual-report-${y}`,
        title: `${stateData.annualReportName}`,
        description: `File your ${stateData.annualReportName} with ${stateData.name} Secretary of State. Filing fee: $${stateData.annualReportFee}.`,
        date,
        category: "formation",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "critical",
        phaseId: "business-formation",
      });
    }
  }

  // ── TAX: Quarterly estimated tax payments ───────────────────────────
  // Federal: Q1 Apr 15, Q2 Jun 15, Q3 Sep 15, Q4 Jan 15 (next year)
  for (let y = startYear; y <= endYear; y++) {
    const quarters: { q: string; date: Date }[] = [
      { q: "Q1", date: makeDate(y, 3, 15) }, // Apr 15
      { q: "Q2", date: makeDate(y, 5, 15) }, // Jun 15
      { q: "Q3", date: makeDate(y, 8, 15) }, // Sep 15
      { q: "Q4", date: makeDate(y + 1, 0, 15) }, // Jan 15 (next year)
    ];
    for (const { q, date } of quarters) {
      if (date < startDate) continue;
      push({
        id: `tax-estimated-${y}-${q}`,
        title: `Quarterly Estimated Tax Payment — ${q} ${y}`,
        description: `Federal (and possibly state) estimated tax payment for ${q} ${y}. Pay via IRS Direct Pay or EFTPS.`,
        date,
        category: "tax",
        recurring: true,
        recurrenceInterval: "quarterly",
        priority: "critical",
      });
    }
  }

  // ── TAX: Annual tax return ──────────────────────────────────────────
  for (let y = startYear; y <= endYear; y++) {
    const date = makeDate(y + 1, 3, 15); // Apr 15 of following year
    if (date < startDate) continue;
    push({
      id: `tax-annual-${y}`,
      title: `Annual Tax Return — ${y}`,
      description: `File your federal (and state, if applicable) annual tax return for tax year ${y}. Federal deadline is April 15.`,
      date,
      category: "tax",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "critical",
    });
  }

  // ── INSURANCE: GL renewal (annual) ──────────────────────────────────
  for (let y = 1; y <= horizonYears; y++) {
    push({
      id: `insurance-gl-${y}`,
      title: `General Liability Policy Renewal`,
      description: `Your General Liability (GL) insurance policy is up for renewal. Review coverage limits and shop quotes 30 days before expiration.`,
      date: addYears(startDate, y),
      category: "insurance",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "critical",
      phaseId: "insurance",
    });
  }

  // ── INSURANCE: WC renewal (annual) ──────────────────────────────────
  for (let y = 1; y <= horizonYears; y++) {
    push({
      id: `insurance-wc-${y}`,
      title: `Workers' Comp Policy Renewal`,
      description: `Your Workers' Compensation policy is up for renewal. Confirm audit documentation is current.`,
      date: addYears(startDate, y),
      category: "insurance",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "critical",
      phaseId: "insurance",
    });
  }

  // ── INSURANCE: Auto renewal (every 6 months) ────────────────────────
  for (let m = 6; m <= horizonYears * 12; m += 6) {
    push({
      id: `insurance-auto-${m}`,
      title: `Commercial Auto Policy Renewal`,
      description: `Your Commercial Auto insurance is up for renewal (typical 6-month term). Verify vehicle list and driver schedule.`,
      date: addMonths(startDate, m),
      category: "insurance",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "important",
      phaseId: "insurance",
    });
  }

  // ── BONDING: Surety bond renewal (annual) ───────────────────────────
  if (!stateData || stateData.stateBondRequired || true) {
    // Always include — bond renewal is common even if state doesn't require.
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `bonding-renewal-${y}`,
        title: `Surety Bond Renewal`,
        description: `Your contractor/license surety bond is up for renewal. Contact your surety agent 45-60 days prior.`,
        date: addYears(startDate, y),
        category: "bonding",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "critical",
        phaseId: "surety-bonding",
      });
    }
  }

  // ── LICENSING: State contractor license renewal ────────────────────
  if (stateData && stateData.hasStateLicense) {
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `licensing-state-${y}`,
        title: `${stateData.name} Contractor License Renewal`,
        description: `Renew your state contractor license with ${stateData.licensingAgency}. Fee range: $${stateData.licensingFee.min}-$${stateData.licensingFee.max}.`,
        date: addYears(startDate, y),
        category: "licensing",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "critical",
        phaseId: "contractor-licensing",
      });
    }
  }

  // ── OSHA: OSHA 10/30 refresher (every 5 years) ─────────────────────
  for (let y = 5; y <= horizonYears * 5; y += 5) {
    if (y > horizonYears + 5) break;
    push({
      id: `osha-refresher-${y}`,
      title: `OSHA 10/30 Certification Refresher`,
      description: `OSHA recommends refreshing OSHA 10 / OSHA 30 training every 5 years. Many GCs and owners require current cards.`,
      date: addYears(startDate, y),
      category: "osha",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "info",
    });
  }

  // ── OSHA: 300 log posting (Feb 1 – Apr 30 annually) ────────────────
  for (let y = startYear; y <= endYear; y++) {
    const date = makeDate(y, 1, 1); // Feb 1
    if (date < startDate) continue;
    push({
      id: `osha-300-post-${y}`,
      title: `Post OSHA Form 300A (Feb 1 – Apr 30)`,
      description: `Post the Form 300A summary of work-related injuries/illnesses in a visible location through April 30. Required for employers with 11+ employees.`,
      date,
      category: "osha",
      recurring: true,
      recurrenceInterval: "annually",
      priority: "important",
    });
  }

  // ── CERTIFICATION: SAM.gov annual renewal ──────────────────────────
  if (usesSam(profile)) {
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `cert-sam-${y}`,
        title: `SAM.gov Registration Renewal`,
        description: `Your SAM.gov (System for Award Management) registration expires annually. Renew before expiration to stay eligible for federal contracts.`,
        date: addYears(startDate, y),
        category: "certification",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "critical",
        phaseId: "legal-federal",
      });
    }
  }

  // ── CERTIFICATION: SDVOSB / 8(a) / DBE / WBE recertification ──────
  if (profile.isDisabledVeteran) {
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `cert-sdvosb-${y}`,
        title: `SDVOSB Recertification`,
        description: `Service-Disabled Veteran-Owned Small Business (SDVOSB) certification requires annual recertification with the SBA.`,
        date: addYears(startDate, y),
        category: "certification",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "important",
        phaseId: "certifications",
      });
    }
  }

  if (profile.isMinority) {
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `cert-mbe-dbe-${y}`,
        title: `MBE/DBE/8(a) Recertification`,
        description: `Minority Business Enterprise / Disadvantaged Business Enterprise / 8(a) programs typically require annual recertification to maintain status.`,
        date: addYears(startDate, y),
        category: "certification",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "important",
        phaseId: "certifications",
      });
    }
  }

  if (profile.isWomanOwned) {
    for (let y = 1; y <= horizonYears; y++) {
      push({
        id: `cert-wosb-${y}`,
        title: `WOSB Recertification`,
        description: `Women-Owned Small Business (WOSB) certification requires annual recertification to remain eligible for set-aside contracts.`,
        date: addYears(startDate, y),
        category: "certification",
        recurring: true,
        recurrenceInterval: "annually",
        priority: "important",
        phaseId: "certifications",
      });
    }
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Filter events to those occurring within [from, to] (inclusive). */
export function filterEventsInRange(
  events: ComplianceEvent[],
  from: Date,
  to: Date,
): ComplianceEvent[] {
  return events.filter(
    (e) => e.date.getTime() >= from.getTime() && e.date.getTime() <= to.getTime(),
  );
}

/** Return events occurring on a given calendar day (local time). */
export function getEventsForDay(
  events: ComplianceEvent[],
  day: Date,
): ComplianceEvent[] {
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();
  return events.filter((e) => {
    const ed = e.date;
    return (
      ed.getFullYear() === y &&
      ed.getMonth() === m &&
      ed.getDate() === d
    );
  });
}

/** Upcoming events within the next N days (sorted ascending). */
export function getUpcomingEvents(
  events: ComplianceEvent[],
  days = 30,
  now: Date = new Date(),
): ComplianceEvent[] {
  const end = new Date(now);
  end.setDate(end.getDate() + days);
  return filterEventsInRange(events, now, end);
}

/** Number of whole days until the event (negative if past). */
export function daysUntil(date: Date, now: Date = new Date()): number {
  const MS = 1000 * 60 * 60 * 24;
  const a = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / MS);
}

/** Short human-readable relative day label. */
export function formatDaysUntil(date: Date, now: Date = new Date()): string {
  const d = daysUntil(date, now);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  if (d > 0) return `in ${d} days`;
  return `${Math.abs(d)} days ago`;
}
