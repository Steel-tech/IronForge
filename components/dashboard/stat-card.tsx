"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { LucideIcon } from "lucide-react";

export type StatCardAccent = "cyan" | "magenta" | "green" | "amber" | "red";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: StatCardAccent;
}

const ACCENT_MAP: Record<
  StatCardAccent,
  {
    text: string;
    glow: string;
    border: string;
    bar: string;
    iconBg: string;
  }
> = {
  cyan: {
    text: "text-neon-cyan",
    glow: "text-glow-cyan",
    border: "hover:border-neon-cyan/40",
    bar: "from-transparent via-neon-cyan/40 to-transparent",
    iconBg: "bg-neon-cyan/5 border-neon-cyan/20",
  },
  magenta: {
    text: "text-neon-magenta",
    glow: "text-glow-magenta",
    border: "hover:border-neon-magenta/40",
    bar: "from-transparent via-neon-magenta/40 to-transparent",
    iconBg: "bg-neon-magenta/5 border-neon-magenta/20",
  },
  green: {
    text: "text-neon-green",
    glow: "text-glow-green",
    border: "hover:border-neon-green/40",
    bar: "from-transparent via-neon-green/40 to-transparent",
    iconBg: "bg-neon-green/5 border-neon-green/20",
  },
  amber: {
    text: "text-neon-amber",
    glow: "text-glow-amber",
    border: "hover:border-neon-amber/40",
    bar: "from-transparent via-neon-amber/40 to-transparent",
    iconBg: "bg-neon-amber/5 border-neon-amber/20",
  },
  red: {
    text: "text-neon-red",
    glow: "text-glow-red",
    border: "hover:border-neon-red/40",
    bar: "from-transparent via-neon-red/40 to-transparent",
    iconBg: "bg-neon-red/5 border-neon-red/20",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent = "cyan",
}: StatCardProps) {
  const style = ACCENT_MAP[accent];

  return (
    <div
      className={`relative bg-cyber-dark border border-cyber-border rounded-xl p-5 transition-all duration-300 ${style.border} overflow-hidden group`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${style.bar}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
            {label}
          </div>
          <div
            className={`text-2xl md:text-3xl font-mono font-bold ${style.text} ${style.glow} leading-none`}
          >
            {value}
          </div>
          {subtitle && (
            <div className="mt-2 text-[11px] font-mono text-text-secondary">
              {subtitle}
            </div>
          )}
        </div>
        <div
          className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${style.iconBg}`}
        >
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
