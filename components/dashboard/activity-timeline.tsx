"use client";

import { Flag, Activity, Zap, Target, Calendar } from "lucide-react";

export type TimelineEventType =
  | "start"
  | "phase-visit"
  | "activity"
  | "projection"
  | "today";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  subtitle?: string;
  timestamp?: string; // ISO string if known
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

const TYPE_STYLE: Record<
  TimelineEventType,
  { color: string; Icon: typeof Flag; label: string }
> = {
  start: { color: "text-neon-magenta", Icon: Flag, label: "START" },
  "phase-visit": { color: "text-neon-cyan", Icon: Target, label: "PHASE" },
  activity: { color: "text-neon-green", Icon: Activity, label: "ACTIVITY" },
  today: { color: "text-neon-amber", Icon: Zap, label: "TODAY" },
  projection: { color: "text-text-muted", Icon: Calendar, label: "ETA" },
};

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diff = now - then;
  const sec = Math.floor(diff / 1000);
  if (sec < 0) {
    // future
    const absSec = Math.abs(sec);
    if (absSec < 86400) return "Today";
    const days = Math.round(absSec / 86400);
    return `in ${days} day${days === 1 ? "" : "s"}`;
  }
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day === 0) return "Today";
  if (day === 1) return "Yesterday";
  if (day < 30) return `${day} days ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} year${yr === 1 ? "" : "s"} ago`;
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <div className="bg-cyber-dark border border-cyber-border rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />

      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-neon-magenta" />
        <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
          Mission Timeline
        </h2>
      </div>

      {events.length === 0 ? (
        <div className="text-xs font-mono text-text-muted py-6 text-center">
          No activity recorded yet.
        </div>
      ) : (
        <ol className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-magenta/30 via-cyber-border-bright to-transparent" />

          {events.map((event) => {
            const style = TYPE_STYLE[event.type];
            const Icon = style.Icon;
            const rel = relativeTime(event.timestamp);

            return (
              <li
                key={event.id}
                className="relative pl-8 pb-5 last:pb-0 group"
              >
                {/* Dot */}
                <div className="absolute left-0 top-0.5">
                  <div
                    className={`w-6 h-6 rounded-full bg-cyber-dark border-2 flex items-center justify-center transition-all ${
                      event.type === "today"
                        ? "border-neon-amber glow-amber"
                        : event.type === "start"
                          ? "border-neon-magenta"
                          : event.type === "phase-visit"
                            ? "border-neon-cyan/50"
                            : event.type === "activity"
                              ? "border-neon-green/50"
                              : "border-cyber-border-bright"
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${style.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[9px] font-mono uppercase tracking-widest ${style.color}`}
                      >
                        {style.label}
                      </span>
                      {rel && (
                        <span className="text-[9px] font-mono text-text-muted">
                          · {rel}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-text-primary truncate">
                      {event.title}
                    </div>
                    {event.subtitle && (
                      <div className="text-[10px] font-mono text-text-muted mt-0.5">
                        {event.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default ActivityTimeline;
