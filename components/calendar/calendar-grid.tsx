"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  type ComplianceEvent,
  type ComplianceCategory,
  getEventsForDay,
} from "@/lib/calendar/compliance-dates";

/** Explicit mapping — Tailwind v4 needs full class literals to be discovered. */
const CATEGORY_DOT_CLASS: Record<ComplianceCategory, string> = {
  formation: "bg-neon-cyan",
  licensing: "bg-neon-blue",
  insurance: "bg-neon-green",
  bonding: "bg-neon-amber",
  tax: "bg-neon-magenta",
  certification: "bg-neon-purple",
  osha: "bg-neon-red",
};

interface CalendarGridProps {
  month: number; // 0-11
  year: number;
  events: ComplianceEvent[];
  selectedDay: Date | null;
  onSelectDay: (day: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarGrid({
  month,
  year,
  events,
  selectedDay,
  onSelectDay,
}: CalendarGridProps) {
  const today = useMemo(() => new Date(), []);

  // Compute the grid: always 6 rows × 7 cols = 42 cells
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0=Sun

    const out: { date: Date; inMonth: boolean }[] = [];
    // Leading days from prev month
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      out.push({ date: d, inMonth: false });
    }
    // Current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: new Date(year, month, d), inMonth: true });
    }
    // Trailing to fill 42 cells
    while (out.length < 42) {
      const last = out[out.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      out.push({ date: next, inMonth: false });
    }
    return out;
  }, [month, year]);

  return (
    <div className="cyber-card rounded-lg p-3 sm:p-4 border border-cyber-border">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-[10px] sm:text-xs font-mono uppercase text-text-muted text-center tracking-widest py-1"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, inMonth }) => {
          const dayEvents = getEventsForDay(events, date);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDay && isSameDay(date, selectedDay);
          const hasCritical = dayEvents.some((e) => e.priority === "critical");

          // Unique categories represented today
          const uniqueCats = Array.from(
            new Set(dayEvents.map((e) => e.category)),
          );

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDay(date)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-start p-1 sm:p-1.5 rounded-md border text-xs font-mono transition-all",
                "bg-cyber-darker hover:bg-cyber-surface",
                inMonth
                  ? "text-text-primary border-cyber-border"
                  : "text-text-muted border-transparent opacity-50",
                isToday &&
                  "border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]",
                isSelected &&
                  !isToday &&
                  "border-neon-cyan/60 bg-cyber-surface",
                hasCritical && !isToday &&
                  "shadow-[inset_0_0_10px_rgba(255,0,64,0.15)] border-neon-red/30",
              )}
            >
              <span className="text-[11px] sm:text-xs">{date.getDate()}</span>

              {/* Event dots */}
              {uniqueCats.length > 0 && (
                <div className="mt-auto flex gap-0.5 flex-wrap justify-center">
                  {uniqueCats.slice(0, 4).map((cat) => (
                    <span
                      key={cat}
                      className={cn(
                        "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full",
                        CATEGORY_DOT_CLASS[cat],
                      )}
                      style={{
                        boxShadow: `0 0 4px currentColor`,
                      }}
                    />
                  ))}
                  {uniqueCats.length > 4 && (
                    <span className="text-[8px] text-text-muted">
                      +{uniqueCats.length - 4}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
