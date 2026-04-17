/**
 * Achievement definitions + rarity styling.
 * Conditions are pure functions of the extended UserState — they receive
 * enough derived info (chat history, session counts, etc.) to evaluate
 * without touching localStorage directly.
 */

import type { UserState, WizardProgress } from "@/lib/types/wizard";

export type AchievementCategory =
  | "progress"
  | "speed"
  | "engagement"
  | "mastery";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface AchievementContext {
  state: UserState;
  /** Total chat messages the user has sent (role === "user"). */
  totalChatMessages: number;
  /** Max messages sent at any single step. */
  maxMessagesAtSingleStep: number;
  /**
   * Total checklist items completed across all phases/steps.
   */
  completedChecklistCount: number;
  /** Total phases the user has visited at least one step in. */
  visitedPhaseCount: number;
  /** Checklist items completed during this active session. */
  sessionCompletedCount: number;
  /** Number of distinct calendar days the user has loaded the app (max 90 tracked). */
  consecutiveDaysUsed: number;
  /** True if the user has ever visited the estimator page. */
  usedEstimator: boolean;
  /** Phase completion ratios: phaseId → fraction visited (0..1). */
  phaseVisitRatio: Record<string, number>;
  /** Phase completion ratios: phaseId → fraction of checklist completed (0..1). */
  phaseChecklistRatio: Record<string, number>;
  /** Overall completion fraction across all phases/steps (checklist-based). */
  overallChecklistRatio: number;
  /** Duration in ms from first visit of phase to all steps visited (0 if not completed). */
  fastestPhaseDurationMs: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: (ctx: AchievementContext) => boolean;
  rarity: AchievementRarity;
  neonColor: string; // for Tailwind-friendly styling hints
}

/** Stable list of phase IDs used by the app. */
const ALL_PHASE_IDS = [
  "business-formation",
  "contractor-licensing",
  "surety-bonding",
  "insurance",
  "certifications",
  "union-signatory",
  "legal-federal",
] as const;

/** Helper: does any step in the phase have visited or a completed item? */
function hasAnyStepActivity(progress: WizardProgress, phaseId: string): boolean {
  const phase = progress[phaseId];
  if (!phase) return false;
  return Object.values(phase).some(
    (s) => s.visited || s.completedChecklist.length > 0,
  );
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Visit any wizard step.",
    icon: "⚡",
    category: "progress",
    rarity: "common",
    neonColor: "neon-cyan",
    condition: (ctx) =>
      Object.values(ctx.state.progress).some((phase) =>
        Object.values(phase).some((s) => s.visited),
      ),
  },
  {
    id: "checkbox-warrior",
    title: "Checkbox Warrior",
    description: "Complete 10 checklist items.",
    icon: "✅",
    category: "progress",
    rarity: "common",
    neonColor: "neon-cyan",
    condition: (ctx) => ctx.completedChecklistCount >= 10,
  },
  {
    id: "phase-1-complete",
    title: "Phase 1 Complete",
    description: "Complete all Phase 1 (Business Formation) items.",
    icon: "🏗️",
    category: "progress",
    rarity: "common",
    neonColor: "neon-cyan",
    condition: (ctx) =>
      (ctx.phaseChecklistRatio["business-formation"] ?? 0) >= 1,
  },
  {
    id: "halfway-there",
    title: "Halfway There",
    description: "Complete 50% of all checklist items.",
    icon: "🎯",
    category: "progress",
    rarity: "rare",
    neonColor: "neon-green",
    condition: (ctx) => ctx.overallChecklistRatio >= 0.5,
  },
  {
    id: "asked-the-mentor",
    title: "Asked the Mentor",
    description: "Send your first chat message.",
    icon: "💬",
    category: "engagement",
    rarity: "common",
    neonColor: "neon-cyan",
    condition: (ctx) => ctx.totalChatMessages >= 1,
  },
  {
    id: "deep-conversation",
    title: "Deep Conversation",
    description: "Send 10+ messages in a single wizard step.",
    icon: "🗣️",
    category: "engagement",
    rarity: "rare",
    neonColor: "neon-green",
    condition: (ctx) => ctx.maxMessagesAtSingleStep >= 10,
  },
  {
    id: "speed-runner",
    title: "Speed Runner",
    description: "Complete a full phase in under 24 hours.",
    icon: "⚡",
    category: "speed",
    rarity: "rare",
    neonColor: "neon-green",
    condition: (ctx) =>
      ctx.fastestPhaseDurationMs > 0 &&
      ctx.fastestPhaseDurationMs < 24 * 60 * 60 * 1000,
  },
  {
    id: "data-driven",
    title: "Data Driven",
    description: "Visit every step in a single phase.",
    icon: "📊",
    category: "progress",
    rarity: "common",
    neonColor: "neon-cyan",
    condition: (ctx) =>
      Object.values(ctx.phaseVisitRatio).some((r) => r >= 1),
  },
  {
    id: "all-seven",
    title: "All Seven",
    description: "Complete every checklist item in all 7 phases.",
    icon: "🏆",
    category: "mastery",
    rarity: "legendary",
    neonColor: "neon-amber",
    condition: (ctx) =>
      ALL_PHASE_IDS.every(
        (id) => (ctx.phaseChecklistRatio[id] ?? 0) >= 1,
      ),
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Reach 100% checklist completion overall.",
    icon: "💎",
    category: "mastery",
    rarity: "legendary",
    neonColor: "neon-amber",
    condition: (ctx) => ctx.overallChecklistRatio >= 1,
  },
  {
    id: "on-fire",
    title: "On Fire",
    description: "Complete 5+ checklist items in one session.",
    icon: "🔥",
    category: "engagement",
    rarity: "rare",
    neonColor: "neon-green",
    condition: (ctx) => ctx.sessionCompletedCount >= 5,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit at least one step in all 7 phases.",
    icon: "🗺️",
    category: "engagement",
    rarity: "rare",
    neonColor: "neon-green",
    condition: (ctx) =>
      ALL_PHASE_IDS.every((id) => hasAnyStepActivity(ctx.state.progress, id)),
  },
  {
    id: "consistent",
    title: "Consistent",
    description: "Use the app 3 days in a row.",
    icon: "📅",
    category: "engagement",
    rarity: "epic",
    neonColor: "neon-magenta",
    condition: (ctx) => ctx.consecutiveDaysUsed >= 3,
  },
  {
    id: "veteran-contractor",
    title: "Veteran Contractor",
    description: "Complete all 7 phases as a veteran.",
    icon: "🎖️",
    category: "mastery",
    rarity: "epic",
    neonColor: "neon-magenta",
    condition: (ctx) =>
      (ctx.state.profile.isVeteran || ctx.state.profile.isDisabledVeteran) &&
      ALL_PHASE_IDS.every(
        (id) => (ctx.phaseChecklistRatio[id] ?? 0) >= 1,
      ),
  },
  {
    id: "iron-will",
    title: "Iron Will",
    description: "Complete all 7 phases AND use the estimator.",
    icon: "⚒️",
    category: "mastery",
    rarity: "legendary",
    neonColor: "neon-amber",
    condition: (ctx) =>
      ctx.usedEstimator &&
      ALL_PHASE_IDS.every(
        (id) => (ctx.phaseChecklistRatio[id] ?? 0) >= 1,
      ),
  },
];

export const RARITY_ORDER: Record<AchievementRarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

export interface RarityStyle {
  border: string;
  text: string;
  glow: string;
  label: string;
}

/** Tailwind class lookups per rarity (literals so the compiler can find them). */
export const RARITY_STYLES: Record<AchievementRarity, RarityStyle> = {
  common: {
    border: "border-neon-cyan/60",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_15px_rgba(0,240,255,0.25)]",
    label: "Common",
  },
  rare: {
    border: "border-neon-green/60",
    text: "text-neon-green",
    glow: "shadow-[0_0_15px_rgba(0,255,65,0.25)]",
    label: "Rare",
  },
  epic: {
    border: "border-neon-magenta/60",
    text: "text-neon-magenta",
    glow: "shadow-[0_0_15px_rgba(255,0,170,0.25)]",
    label: "Epic",
  },
  legendary: {
    border: "border-neon-amber/70",
    text: "text-neon-amber",
    glow:
      "shadow-[0_0_20px_rgba(255,170,0,0.4),0_0_40px_rgba(255,170,0,0.15)]",
    label: "Legendary",
  },
};
