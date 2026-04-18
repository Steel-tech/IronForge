"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Nudge dismissal persistence. Stores dismissed nudge IDs and the last
 * visit timestamp the nudge engine uses for "haven't visited in N days".
 */

const STORAGE_KEY = "ironforge-nudges";

export interface NudgeStoreState {
  dismissedIds: string[];
  /** ISO timestamp of the user's last visit prior to the current one. */
  lastVisitISO: string | null;
  /** Tracks per-day completion counts: { "YYYY-MM-DD": n }. Pruned to 14 days. */
  dailyCompletions: Record<string, number>;
}

const DEFAULT_STATE: NudgeStoreState = {
  dismissedIds: [],
  lastVisitISO: null,
  dailyCompletions: {},
};

function isValid(data: unknown): data is NudgeStoreState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.dismissedIds)) return false;
  if (!d.dismissedIds.every((s) => typeof s === "string")) return false;
  if (d.lastVisitISO !== null && typeof d.lastVisitISO !== "string")
    return false;
  if (
    typeof d.dailyCompletions !== "object" ||
    d.dailyCompletions === null
  )
    return false;
  return true;
}

export function loadNudgeState(): NudgeStoreState {
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

export function saveNudgeState(state: NudgeStoreState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function dismissNudge(
  state: NudgeStoreState,
  id: string,
): NudgeStoreState {
  if (state.dismissedIds.includes(id)) return state;
  return { ...state, dismissedIds: [...state.dismissedIds, id] };
}

/**
 * Update last visit. Returns the PREVIOUS lastVisitISO so the UI can
 * feed it to the nudge engine before we overwrite with the current time.
 */
export function touchLastVisit(state: NudgeStoreState): {
  next: NudgeStoreState;
  previous: string | null;
} {
  return {
    next: { ...state, lastVisitISO: new Date().toISOString() },
    previous: state.lastVisitISO,
  };
}

function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate())
  );
}

export function incrementTodayCompletion(
  state: NudgeStoreState,
  now: Date = new Date(),
): NudgeStoreState {
  const today = toISODate(now);
  const pruned = pruneOldDays(state.dailyCompletions);
  return {
    ...state,
    dailyCompletions: {
      ...pruned,
      [today]: (pruned[today] ?? 0) + 1,
    },
  };
}

export function getTodayCompletionCount(
  state: NudgeStoreState,
  now: Date = new Date(),
): number {
  return state.dailyCompletions[toISODate(now)] ?? 0;
}

function pruneOldDays(
  map: Record<string, number>,
): Record<string, number> {
  const keys = Object.keys(map).sort();
  if (keys.length <= 14) return map;
  const keep = keys.slice(-14);
  const out: Record<string, number> = {};
  for (const k of keep) out[k] = map[k];
  return out;
}
