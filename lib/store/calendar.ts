"use client";

/**
 * Calendar persistence store.
 * Stores business start date + completed event IDs + dismissed nudges in
 * localStorage key `ironforge-calendar`.
 */

const STORAGE_KEY = "ironforge-calendar";

export interface CalendarState {
  /** ISO string of user-selected business start date (or null to use today). */
  startDate: string | null;
  /** Event IDs that the user has marked complete. */
  completedEventIds: string[];
}

const DEFAULT_CALENDAR_STATE: CalendarState = {
  startDate: null,
  completedEventIds: [],
};

function isValidCalendarState(data: unknown): data is CalendarState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d.startDate !== null && typeof d.startDate !== "string") return false;
  if (!Array.isArray(d.completedEventIds)) return false;
  if (!d.completedEventIds.every((s) => typeof s === "string")) return false;
  return true;
}

export function loadCalendarState(): CalendarState {
  if (typeof window === "undefined") return { ...DEFAULT_CALENDAR_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CALENDAR_STATE };
    const parsed = JSON.parse(raw);
    return isValidCalendarState(parsed)
      ? parsed
      : { ...DEFAULT_CALENDAR_STATE };
  } catch {
    return { ...DEFAULT_CALENDAR_STATE };
  }
}

export function saveCalendarState(state: CalendarState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function toggleEventCompleted(
  state: CalendarState,
  eventId: string,
): CalendarState {
  const has = state.completedEventIds.includes(eventId);
  return {
    ...state,
    completedEventIds: has
      ? state.completedEventIds.filter((id) => id !== eventId)
      : [...state.completedEventIds, eventId],
  };
}

export function setBusinessStartDate(
  state: CalendarState,
  date: Date | null,
): CalendarState {
  return {
    ...state,
    startDate: date ? date.toISOString() : null,
  };
}

export function getEffectiveStartDate(state: CalendarState): Date {
  if (state.startDate) {
    const d = new Date(state.startDate);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}
