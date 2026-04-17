"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type ComplianceEvent,
  type ComplianceCategory,
  type CompliancePriority,
  CATEGORY_LABELS,
  daysUntil,
  formatDaysUntil,
} from "@/lib/calendar/compliance-dates";
import { EventDetail } from "./event-detail";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";

const CATEGORY_BORDER: Record<ComplianceCategory, string> = {
  formation: "border-l-neon-cyan",
  licensing: "border-l-neon-blue",
  insurance: "border-l-neon-green",
  bonding: "border-l-neon-amber",
  tax: "border-l-neon-magenta",
  certification: "border-l-neon-purple",
  osha: "border-l-neon-red",
};

const CATEGORY_TEXT: Record<ComplianceCategory, string> = {
  formation: "text-neon-cyan",
  licensing: "text-neon-blue",
  insurance: "text-neon-green",
  bonding: "text-neon-amber",
  tax: "text-neon-magenta",
  certification: "text-neon-purple",
  osha: "text-neon-red",
};

const PRIORITY_LABEL: Record<CompliancePriority, string> = {
  critical: "CRITICAL",
  important: "IMPORTANT",
  info: "INFO",
};

const PRIORITY_TEXT: Record<CompliancePriority, string> = {
  critical: "text-neon-red",
  important: "text-neon-amber",
  info: "text-text-secondary",
};

interface EventListProps {
  events: ComplianceEvent[];
  onToggleComplete: (eventId: string) => void;
  emptyMessage?: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventList({
  events,
  onToggleComplete,
  emptyMessage = "No upcoming events.",
}: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className="cyber-card rounded-lg p-6 border border-cyber-border text-center font-mono text-xs text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const expanded = expandedId === event.id;
        const days = daysUntil(event.date);
        return (
          <div
            key={event.id}
            className={cn(
              "cyber-card rounded-lg border border-cyber-border border-l-4 overflow-hidden transition-all",
              CATEGORY_BORDER[event.category],
              event.completed && "opacity-60",
            )}
          >
            <div className="p-3 sm:p-4 flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleComplete(event.id)}
                className="mt-0.5 shrink-0 text-text-secondary hover:text-neon-green transition-colors"
                aria-label={
                  event.completed ? "Mark incomplete" : "Mark complete"
                }
              >
                {event.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-neon-green" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={cn(
                      "font-mono text-sm font-semibold truncate",
                      event.completed && "line-through text-text-muted",
                    )}
                  >
                    {event.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expanded ? null : event.id)
                    }
                    className="shrink-0 text-text-muted hover:text-neon-cyan transition-colors"
                    aria-label={expanded ? "Collapse" : "Expand"}
                    aria-expanded={expanded}
                  >
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono">
                  <span className="text-text-secondary">
                    {formatDate(event.date)}
                  </span>
                  <span
                    className={cn(
                      days < 0
                        ? "text-text-muted"
                        : days <= 7
                          ? "text-neon-red"
                          : days <= 30
                            ? "text-neon-amber"
                            : "text-text-secondary",
                    )}
                  >
                    {formatDaysUntil(event.date)}
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded border border-cyber-border uppercase tracking-wider text-[9px]",
                      CATEGORY_TEXT[event.category],
                    )}
                  >
                    {CATEGORY_LABELS[event.category]}
                  </span>
                  <span
                    className={cn(
                      "uppercase tracking-widest text-[9px]",
                      PRIORITY_TEXT[event.priority],
                    )}
                  >
                    ● {PRIORITY_LABEL[event.priority]}
                  </span>
                </div>
              </div>
            </div>

            {expanded && (
              <EventDetail
                event={event}
                onToggleComplete={() => onToggleComplete(event.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
