"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import Link from "next/link";
import { ArrowRight, Check, CircleDashed, Loader2 } from "lucide-react";

export type PhaseStatus = "not-started" | "in-progress" | "complete";

interface PhaseCardProps {
  index: number;
  phaseId: string;
  title: string;
  description?: string;
  stepId: string;
  totalSteps: number;
  visitedSteps: number;
  totalItems: number;
  completedItems: number;
}

function getStatus(
  visited: number,
  total: number,
  itemsDone: number,
  itemsTotal: number,
): PhaseStatus {
  if (total === 0) return "not-started";
  if (visited === total && (itemsTotal === 0 || itemsDone === itemsTotal))
    return "complete";
  if (visited > 0 || itemsDone > 0) return "in-progress";
  return "not-started";
}

export function PhaseCard({
  index,
  phaseId,
  title,
  description,
  stepId,
  totalSteps,
  visitedSteps,
  totalItems,
  completedItems,
}: PhaseCardProps) {
  const status = getStatus(visitedSteps, totalSteps, completedItems, totalItems);
  const percent =
    totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : totalSteps > 0
        ? Math.round((visitedSteps / totalSteps) * 100)
        : 0;

  const statusStyles: Record<
    PhaseStatus,
    {
      border: string;
      text: string;
      glow: string;
      bar: string;
      Icon: typeof Check;
      barBg: string;
    }
  > = {
    "not-started": {
      border: "border-cyber-border hover:border-cyber-border-bright",
      text: "text-text-muted",
      glow: "",
      bar: "bg-cyber-border-bright",
      Icon: CircleDashed,
      barBg: "bg-cyber-surface",
    },
    "in-progress": {
      border: "border-neon-cyan/30 hover:border-neon-cyan/60",
      text: "text-neon-cyan",
      glow: "text-glow-cyan",
      bar: "neon-progress-bar",
      Icon: Loader2,
      barBg: "bg-cyber-surface",
    },
    complete: {
      border: "border-neon-green/40 hover:border-neon-green/70",
      text: "text-neon-green",
      glow: "text-glow-green",
      bar: "bg-neon-green",
      Icon: Check,
      barBg: "bg-cyber-surface",
    },
  };

  const s = statusStyles[status];
  const Icon = s.Icon;

  return (
    <Link
      href={`/wizard/${phaseId}/${stepId}`}
      className={`group block relative bg-cyber-dark rounded-xl p-5 border ${s.border} transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-neon-cyan shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-sm font-mono font-semibold text-text-primary uppercase tracking-wide truncate">
            {title}
          </h3>
        </div>
        <div
          className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${s.text}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {description && (
        <p className="text-[11px] font-mono text-text-muted mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Progress bar */}
      <div className={`w-full h-1.5 ${s.barBg} rounded-full overflow-hidden mb-2`}>
        <div
          className={`${s.bar} h-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className={`${s.text} ${s.glow}`}>
          {status === "complete"
            ? "COMPLETE"
            : status === "in-progress"
              ? `${percent}%`
              : "NOT STARTED"}
        </div>
        <div className="text-text-muted tabular-nums">
          {visitedSteps}/{totalSteps} steps · {completedItems}/{totalItems} items
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-text-muted group-hover:text-neon-cyan transition-colors">
        <span className="uppercase tracking-wider">Open Phase</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

export default PhaseCard;
