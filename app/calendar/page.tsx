"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadUserState } from "@/lib/store/user-profile";
import {
  loadCalendarState,
  saveCalendarState,
  toggleEventCompleted,
  setBusinessStartDate,
  getEffectiveStartDate,
  type CalendarState,
} from "@/lib/store/calendar";
import {
  generateComplianceEvents,
  getUpcomingEvents,
  getEventsForDay,
  CATEGORY_LABELS,
  type ComplianceCategory,
  type ComplianceEvent,
} from "@/lib/calendar/compliance-dates";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { EventList } from "@/components/calendar/event-list";
import { CalendarExport } from "@/components/calendar/calendar-export";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/types/wizard";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LEGEND: { cat: ComplianceCategory; dot: string; text: string }[] = [
  { cat: "formation",     dot: "bg-neon-cyan",    text: "text-neon-cyan" },
  { cat: "licensing",     dot: "bg-neon-blue",    text: "text-neon-blue" },
  { cat: "insurance",     dot: "bg-neon-green",   text: "text-neon-green" },
  { cat: "bonding",       dot: "bg-neon-amber",   text: "text-neon-amber" },
  { cat: "tax",           dot: "bg-neon-magenta", text: "text-neon-magenta" },
  { cat: "certification", dot: "bg-neon-purple",  text: "text-neon-purple" },
  { cat: "osha",          dot: "bg-neon-red",     text: "text-neon-red" },
];

export default function CalendarPage() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [calendarState, setCalendarState] = useState<CalendarState>({
    startDate: null,
    completedEventIds: [],
  });

  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Load state
  useEffect(() => {
    const user = loadUserState();
    setProfile(user.profile);
    setCalendarState(loadCalendarState());
    setLoaded(true);
  }, []);

  const startDate = useMemo(
    () => getEffectiveStartDate(calendarState),
    [calendarState],
  );

  const events = useMemo<ComplianceEvent[]>(() => {
    if (!loaded) return [];
    return generateComplianceEvents({
      startDate,
      horizonYears: 3,
      completedIds: calendarState.completedEventIds,
      profile,
    });
  }, [loaded, startDate, calendarState.completedEventIds, profile]);

  const upcoming = useMemo(
    () => getUpcomingEvents(events, 30, today),
    [events, today],
  );

  const eventsForSelectedDay = useMemo(
    () => (selectedDay ? getEventsForDay(events, selectedDay) : []),
    [events, selectedDay],
  );

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleJumpToToday() {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    setSelectedDay(today);
  }

  function handleToggleComplete(eventId: string) {
    const next = toggleEventCompleted(calendarState, eventId);
    setCalendarState(next);
    saveCalendarState(next);
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const d = val ? new Date(val) : null;
    const next = setBusinessStartDate(
      calendarState,
      d && !isNaN(d.getTime()) ? d : null,
    );
    setCalendarState(next);
    saveCalendarState(next);
  }

  const startDateInput = calendarState.startDate
    ? calendarState.startDate.slice(0, 10)
    : "";

  return (
    <div className="min-h-screen bg-cyber-black tron-grid text-text-primary">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-neon-cyan transition-colors mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Back to base
            </Link>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-neon-cyan text-glow-cyan flex items-center gap-3">
              <CalendarDays className="w-7 h-7" />
              Compliance Calendar
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary font-mono">
              Deadlines, renewals, and regulatory obligations — tailored to{" "}
              {profile.state ?? "your profile"}.
            </p>
          </div>

          <CalendarExport events={events} />
        </div>

        {/* Business start date input */}
        <div className="mb-6 cyber-card rounded-lg border border-cyber-border p-4">
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Business Start Date
            </span>
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <input
                type="date"
                value={startDateInput}
                onChange={handleStartDateChange}
                className="bg-cyber-darker border border-cyber-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-neon-cyan cyber-focus"
              />
              <span className="text-[11px] font-mono text-text-secondary">
                {calendarState.startDate
                  ? `Using ${startDate.toLocaleDateString()} as anchor for annual events.`
                  : "Using today as the anchor (saved locally — set your actual start date for better deadlines)."}
              </span>
            </div>
          </label>
        </div>

        {/* Calendar + sidebar */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            {/* Month nav */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="btn-neon-cyan px-2 py-1.5 rounded font-mono"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-lg sm:text-xl text-text-primary">
                  {MONTHS[viewMonth]} {viewYear}
                </h2>
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="text-[10px] font-mono uppercase tracking-widest text-text-muted hover:text-neon-cyan transition-colors"
                >
                  Today
                </button>
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="btn-neon-cyan px-2 py-1.5 rounded font-mono"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <CalendarGrid
              month={viewMonth}
              year={viewYear}
              events={events}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />

            {/* Legend */}
            <div className="mt-4 cyber-card rounded-lg border border-cyber-border p-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Legend
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {LEGEND.map(({ cat, dot, text }) => (
                  <div
                    key={cat}
                    className="flex items-center gap-1.5 text-[11px] font-mono"
                  >
                    <span
                      className={cn("w-2 h-2 rounded-full", dot)}
                      style={{ boxShadow: "0 0 4px currentColor" }}
                    />
                    <span className={text}>{CATEGORY_LABELS[cat]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected day events */}
            {selectedDay && (
              <div className="mt-6">
                <h3 className="font-mono text-sm text-neon-cyan mb-2">
                  Events on{" "}
                  {selectedDay.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <EventList
                  events={eventsForSelectedDay}
                  onToggleComplete={handleToggleComplete}
                  emptyMessage="No events on this day."
                />
              </div>
            )}
          </div>

          {/* Upcoming events sidebar */}
          <div>
            <h2 className="font-mono text-sm uppercase tracking-widest text-neon-cyan mb-3">
              Next 30 Days
            </h2>
            <EventList
              events={upcoming}
              onToggleComplete={handleToggleComplete}
              emptyMessage="Nothing due in the next 30 days."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
