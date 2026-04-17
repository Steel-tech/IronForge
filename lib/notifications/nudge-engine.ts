/**
 * Smart Notifications (Nudge) engine.
 * Pure functions that evaluate the user's state and return relevant,
 * motivational or informational banners to display in the wizard.
 */

import type { UserState } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";
import { PHASE_DEFINITIONS } from "@/content/phases";

export type NudgeType =
  | "encouragement"
  | "tip"
  | "reminder"
  | "milestone";

export interface NudgeContext {
  state: UserState;
  /** Completion ratio (0..1) per phase, checklist-based. */
  phaseChecklistRatio: Record<string, number>;
  /** Visited-step ratio (0..1) per phase. */
  phaseVisitRatio: Record<string, number>;
  /** Last visit ISO string (or null). */
  lastVisitISO: string | null;
  /** Checklist items completed today (local date). */
  itemsCompletedToday: number;
  /** Days since phase 1 first visit (or null if never visited). */
  daysSincePhase1FirstVisit: number | null;
}

export interface Nudge {
  id: string;
  message: string;
  type: NudgeType;
  icon: string;
  priority: number;
  condition: (ctx: NudgeContext) => boolean;
  dismissable: boolean;
}

function daysBetween(a: Date, b: Date): number {
  const MS = 1000 * 60 * 60 * 24;
  const aUTC = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bUTC = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aUTC - bUTC) / MS);
}

export const NUDGES: Nudge[] = [
  {
    id: "phase-halfway",
    type: "encouragement",
    icon: "🔥",
    priority: 60,
    dismissable: true,
    message: "", // filled in dynamically
    condition: (ctx) =>
      Object.values(ctx.phaseChecklistRatio).some(
        (r) => r >= 0.5 && r < 1,
      ),
  },
  {
    id: "state-llc-tip",
    type: "tip",
    icon: "💡",
    priority: 50,
    dismissable: true,
    message: "",
    condition: (ctx) => {
      if (!ctx.state.profile.state) return false;
      const data = STATE_REGISTRY[ctx.state.profile.state];
      return !!data && data.llcFilingFee > 0;
    },
  },
  {
    id: "returning-user",
    type: "reminder",
    icon: "👋",
    priority: 80,
    dismissable: true,
    message: "",
    condition: (ctx) => {
      if (!ctx.lastVisitISO) return false;
      const last = new Date(ctx.lastVisitISO);
      if (isNaN(last.getTime())) return false;
      return daysBetween(new Date(), last) >= 3;
    },
  },
  {
    id: "momentum-today",
    type: "milestone",
    icon: "🚀",
    priority: 70,
    dismissable: true,
    message: "",
    condition: (ctx) => ctx.itemsCompletedToday > 3,
  },
  {
    id: "phase1-slow",
    type: "encouragement",
    icon: "⏱️",
    priority: 40,
    dismissable: true,
    message: "",
    condition: (ctx) => {
      if (!ctx.state.profile.state) return false;
      const ratio = ctx.phaseChecklistRatio["business-formation"] ?? 0;
      return (
        ctx.daysSincePhase1FirstVisit !== null &&
        ctx.daysSincePhase1FirstVisit >= 14 &&
        ratio < 1
      );
    },
  },
];

/**
 * Render a dynamic message string for the given nudge id + context.
 */
export function renderNudgeMessage(id: string, ctx: NudgeContext): string {
  switch (id) {
    case "phase-halfway": {
      // Pick the highest-progress phase that's <100%
      let best: { pct: number; label: string } | null = null;
      for (const [pid, r] of Object.entries(ctx.phaseChecklistRatio)) {
        if (r >= 0.5 && r < 1) {
          const phase = PHASE_DEFINITIONS.find((p) => p.id === pid);
          const label = phase?.title ?? pid;
          if (!best || r > best.pct) {
            best = { pct: r, label };
          }
        }
      }
      if (!best) return "You're making great progress — keep going!";
      return `You're making great progress! ${best.label} is ${Math.round(best.pct * 100)}% complete.`;
    }
    case "state-llc-tip": {
      const code = ctx.state.profile.state;
      if (!code) return "";
      const data = STATE_REGISTRY[code];
      return `Tip: In ${data.name}, LLC formation is typically an online filing with the Secretary of State — many contractors complete it in under 30 minutes for $${data.llcFilingFee}.`;
    }
    case "returning-user": {
      const last = ctx.lastVisitISO ? new Date(ctx.lastVisitISO) : null;
      const days = last ? daysBetween(new Date(), last) : 0;
      return `You haven't visited in ${days} day${days === 1 ? "" : "s"}. Pick up where you left off!`;
    }
    case "momentum-today":
      return `You've completed ${ctx.itemsCompletedToday} items today! Keep the momentum.`;
    case "phase1-slow": {
      const stateName = ctx.state.profile.state
        ? (STATE_REGISTRY[ctx.state.profile.state]?.name ?? "your state")
        : "your state";
      return `Most contractors in ${stateName} complete Phase 1 (Business Formation) in about a week. Need help? The AI mentor is one click away.`;
    }
    default:
      return "";
  }
}

/**
 * Evaluate all nudges against the context and return the highest-priority
 * non-dismissed nudge (or null if none qualify).
 */
export function pickNudge(
  ctx: NudgeContext,
  dismissedIds: string[],
): (Nudge & { renderedMessage: string }) | null {
  const dismissed = new Set(dismissedIds);
  const candidates = NUDGES.filter(
    (n) => !dismissed.has(n.id) && safeCondition(n, ctx),
  );
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.priority - a.priority);
  const picked = candidates[0];
  return {
    ...picked,
    renderedMessage: renderNudgeMessage(picked.id, ctx),
  };
}

function safeCondition(n: Nudge, ctx: NudgeContext): boolean {
  try {
    return n.condition(ctx);
  } catch {
    return false;
  }
}
