/**
 * Achievement detection engine.
 * Pure functions — given a UserState + some auxiliary metrics, returns
 * which achievements should be unlocked.
 */

import type { UserState } from "@/lib/types/wizard";
import type { ChatState } from "@/lib/types/chat";
import {
  ACHIEVEMENTS,
  type Achievement,
  type AchievementContext,
} from "./definitions";
import {
  PHASE_DEFINITIONS,
  getPhaseContent,
  type StateCode,
} from "@/content/phases";

export interface DetectorAuxInputs {
  /** Chat history (same object saved by chat-history store). */
  chatState: ChatState;
  /** Number of checklist completions recorded this active session. */
  sessionCompletedCount: number;
  /** Consecutive-days count tracked by the achievement store. */
  consecutiveDaysUsed: number;
  /** True if the user has loaded the estimator page at least once. */
  usedEstimator: boolean;
  /** Phase start/finish timestamps (ms since epoch), for speed tracking. */
  phaseTimestamps: Record<string, { firstVisit?: number; completed?: number }>;
}

/** Count user messages globally, and find max per-step. */
function chatStats(chatState: ChatState): {
  total: number;
  maxPerStep: number;
} {
  let total = 0;
  let maxPerStep = 0;
  for (const messages of Object.values(chatState)) {
    const userMsgs = messages.filter((m) => m.role === "user").length;
    total += userMsgs;
    if (userMsgs > maxPerStep) maxPerStep = userMsgs;
  }
  return { total, maxPerStep };
}

/**
 * Compute phase-level ratios from the user's current state.
 * Uses the state-specific generated phase content to know how many
 * steps and checklist items each phase has.
 */
function computePhaseRatios(state: UserState): {
  phaseVisitRatio: Record<string, number>;
  phaseChecklistRatio: Record<string, number>;
  completedChecklistCount: number;
  overallChecklistRatio: number;
  visitedPhaseCount: number;
} {
  const phaseVisitRatio: Record<string, number> = {};
  const phaseChecklistRatio: Record<string, number> = {};
  let completedChecklistCount = 0;
  let totalChecklistItems = 0;
  let visitedPhaseCount = 0;

  const stateCode = (state.profile.state ?? null) as StateCode | null;

  for (const phaseDef of PHASE_DEFINITIONS) {
    const phaseId = phaseDef.id;
    const progressPhase = state.progress[phaseId] ?? {};

    // Use generated content if we have a state, otherwise fall back to
    // what's in progress (keeps the detector safe when no state is set).
    let totalSteps = Object.keys(progressPhase).length;
    let stepChecklistSizes: Record<string, number> = {};

    if (stateCode) {
      try {
        const phaseContent = getPhaseContent(phaseId, stateCode);
        totalSteps = phaseContent.steps.length;
        for (const s of phaseContent.steps) {
          stepChecklistSizes[s.id] = s.checklist.length;
        }
      } catch {
        // Fallback to progress-derived counts
        stepChecklistSizes = {};
      }
    }

    // Visit ratio
    const visitedSteps = Object.values(progressPhase).filter(
      (s) => s.visited,
    ).length;
    phaseVisitRatio[phaseId] =
      totalSteps > 0 ? visitedSteps / totalSteps : 0;

    if (visitedSteps > 0) visitedPhaseCount++;

    // Checklist ratio
    let phaseCompleted = 0;
    let phaseTotal = 0;
    if (stateCode && Object.keys(stepChecklistSizes).length > 0) {
      for (const [stepId, size] of Object.entries(stepChecklistSizes)) {
        phaseTotal += size;
        phaseCompleted += (progressPhase[stepId]?.completedChecklist ?? [])
          .length;
      }
    } else {
      for (const step of Object.values(progressPhase)) {
        phaseCompleted += step.completedChecklist.length;
      }
    }
    phaseChecklistRatio[phaseId] =
      phaseTotal > 0 ? Math.min(1, phaseCompleted / phaseTotal) : 0;
    completedChecklistCount += phaseCompleted;
    totalChecklistItems += phaseTotal;
  }

  const overallChecklistRatio =
    totalChecklistItems > 0
      ? Math.min(1, completedChecklistCount / totalChecklistItems)
      : 0;

  return {
    phaseVisitRatio,
    phaseChecklistRatio,
    completedChecklistCount,
    overallChecklistRatio,
    visitedPhaseCount,
  };
}

function fastestPhaseDurationMs(
  phaseTimestamps: Record<
    string,
    { firstVisit?: number; completed?: number }
  >,
): number {
  let fastest = 0;
  for (const t of Object.values(phaseTimestamps)) {
    if (t.firstVisit && t.completed && t.completed > t.firstVisit) {
      const d = t.completed - t.firstVisit;
      if (fastest === 0 || d < fastest) fastest = d;
    }
  }
  return fastest;
}

/** Build the full context object consumed by achievement conditions. */
export function buildAchievementContext(
  state: UserState,
  aux: DetectorAuxInputs,
): AchievementContext {
  const chat = chatStats(aux.chatState);
  const ratios = computePhaseRatios(state);

  return {
    state,
    totalChatMessages: chat.total,
    maxMessagesAtSingleStep: chat.maxPerStep,
    completedChecklistCount: ratios.completedChecklistCount,
    visitedPhaseCount: ratios.visitedPhaseCount,
    sessionCompletedCount: aux.sessionCompletedCount,
    consecutiveDaysUsed: aux.consecutiveDaysUsed,
    usedEstimator: aux.usedEstimator,
    phaseVisitRatio: ratios.phaseVisitRatio,
    phaseChecklistRatio: ratios.phaseChecklistRatio,
    overallChecklistRatio: ratios.overallChecklistRatio,
    fastestPhaseDurationMs: fastestPhaseDurationMs(aux.phaseTimestamps),
  };
}

/** Return the list of currently unlocked achievements (full objects). */
export function checkAchievements(
  state: UserState,
  aux: DetectorAuxInputs,
): Achievement[] {
  const ctx = buildAchievementContext(state, aux);
  return ACHIEVEMENTS.filter((a) => {
    try {
      return a.condition(ctx);
    } catch {
      return false;
    }
  });
}

/**
 * Diff against previously-unlocked ids and return only newly unlocked.
 */
export function getNewAchievements(
  state: UserState,
  aux: DetectorAuxInputs,
  previouslyUnlocked: string[],
): Achievement[] {
  const unlocked = checkAchievements(state, aux);
  const prev = new Set(previouslyUnlocked);
  return unlocked.filter((a) => !prev.has(a.id));
}
