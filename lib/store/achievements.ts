"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Achievement persistence store.
 * Tracks unlocked achievements, whether the user has seen the toast,
 * session/usage counters, phase timestamps, and estimator visit flag.
 * Saved to localStorage key `ironforge-achievements`.
 */

const STORAGE_KEY = "ironforge-achievements";

export interface UnlockedAchievement {
  id: string;
  /** ISO timestamp. */
  unlockedAt: string;
  /** Has the user seen the toast notification? */
  seen: boolean;
}

export interface PhaseTimestamp {
  firstVisit?: number;
  completed?: number;
}

export interface AchievementsState {
  unlocked: UnlockedAchievement[];
  /** ISO dates the user has opened the app (YYYY-MM-DD). Last 90 kept. */
  visitDates: string[];
  /** Checklist completions counted during this active session (in-memory seeded). */
  sessionCompletedCount: number;
  /** First-visit / completion timestamps for speed-run tracking. */
  phaseTimestamps: Record<string, PhaseTimestamp>;
  /** True if the user has loaded /estimator (or equivalent) at least once. */
  usedEstimator: boolean;
}

const DEFAULT_STATE: AchievementsState = {
  unlocked: [],
  visitDates: [],
  sessionCompletedCount: 0,
  phaseTimestamps: {},
  usedEstimator: false,
};

function isValid(data: unknown): data is AchievementsState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.unlocked)) return false;
  if (
    !d.unlocked.every((u) => {
      if (typeof u !== "object" || u === null) return false;
      const x = u as Record<string, unknown>;
      return (
        typeof x.id === "string" &&
        typeof x.unlockedAt === "string" &&
        typeof x.seen === "boolean"
      );
    })
  )
    return false;
  if (!Array.isArray(d.visitDates)) return false;
  if (!d.visitDates.every((s) => typeof s === "string")) return false;
  if (typeof d.sessionCompletedCount !== "number") return false;
  if (typeof d.phaseTimestamps !== "object" || d.phaseTimestamps === null)
    return false;
  if (typeof d.usedEstimator !== "boolean") return false;
  return true;
}

export function loadAchievementsState(): AchievementsState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveAchievementsState(state: AchievementsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Return IDs of all unlocked achievements. */
export function unlockedIds(state: AchievementsState): string[] {
  return state.unlocked.map((u) => u.id);
}

export function recordUnlock(
  state: AchievementsState,
  id: string,
): AchievementsState {
  if (state.unlocked.some((u) => u.id === id)) return state;
  return {
    ...state,
    unlocked: [
      ...state.unlocked,
      { id, unlockedAt: new Date().toISOString(), seen: false },
    ],
  };
}

export function markSeen(
  state: AchievementsState,
  id: string,
): AchievementsState {
  return {
    ...state,
    unlocked: state.unlocked.map((u) =>
      u.id === id ? { ...u, seen: true } : u,
    ),
  };
}

/** Record today's visit; keep visitDates sorted, unique, max 90 entries. */
export function recordVisitToday(
  state: AchievementsState,
  now: Date = new Date(),
): AchievementsState {
  const today = toISODate(now);
  if (state.visitDates.includes(today)) return state;
  const nextDates = [...state.visitDates, today]
    .sort()
    .slice(-90);
  return { ...state, visitDates: nextDates };
}

/** Compute the current streak of consecutive days ending today. */
export function computeConsecutiveDays(
  state: AchievementsState,
  now: Date = new Date(),
): number {
  if (state.visitDates.length === 0) return 0;
  const set = new Set(state.visitDates);
  let streak = 0;
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  for (let i = 0; i < 90; i++) {
    if (set.has(toISODate(cursor))) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function recordPhaseFirstVisit(
  state: AchievementsState,
  phaseId: string,
  now: number = Date.now(),
): AchievementsState {
  const existing = state.phaseTimestamps[phaseId];
  if (existing?.firstVisit) return state;
  return {
    ...state,
    phaseTimestamps: {
      ...state.phaseTimestamps,
      [phaseId]: { ...existing, firstVisit: now },
    },
  };
}

export function recordPhaseCompleted(
  state: AchievementsState,
  phaseId: string,
  now: number = Date.now(),
): AchievementsState {
  const existing = state.phaseTimestamps[phaseId];
  if (existing?.completed) return state;
  return {
    ...state,
    phaseTimestamps: {
      ...state.phaseTimestamps,
      [phaseId]: { ...existing, completed: now },
    },
  };
}

export function incrementSessionCompletion(
  state: AchievementsState,
): AchievementsState {
  return {
    ...state,
    sessionCompletedCount: state.sessionCompletedCount + 1,
  };
}

/** Reset the per-session counter (call on a new session start if desired). */
export function resetSessionCounter(
  state: AchievementsState,
): AchievementsState {
  return { ...state, sessionCompletedCount: 0 };
}

export function markEstimatorUsed(
  state: AchievementsState,
): AchievementsState {
  if (state.usedEstimator) return state;
  return { ...state, usedEstimator: true };
}

function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate())
  );
}
