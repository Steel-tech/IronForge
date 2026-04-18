"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  type Achievement,
  RARITY_STYLES,
} from "@/lib/achievements/definitions";
import { X } from "lucide-react";

interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
  /** Auto-dismiss after this many ms (default 5000). */
  durationMs?: number;
}

/**
 * Slides in from the top-right. Auto-dismisses after `durationMs`.
 * Used inside a fixed-position stack managed by AchievementToastStack.
 */
export function AchievementToast({
  achievement,
  onDismiss,
  durationMs = 5000,
}: AchievementToastProps) {
  const [leaving, setLeaving] = useState(false);
  const style = RARITY_STYLES[achievement.rarity];

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), durationMs - 300);
    const t2 = setTimeout(() => onDismiss(), durationMs);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [durationMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "w-80 max-w-[calc(100vw-2rem)] bg-cyber-dark border rounded-lg p-4 font-mono",
        "transition-all duration-300",
        style.border,
        style.glow,
        leaving
          ? "opacity-0 translate-x-8"
          : "opacity-100 translate-x-0 animate-slide-in",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 w-12 h-12 rounded flex items-center justify-center text-2xl bg-cyber-darker border",
            style.border,
          )}
        >
          {achievement.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-[9px] uppercase tracking-widest font-semibold",
                style.text,
              )}
            >
              Achievement Unlocked · {style.label}
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 text-text-muted hover:text-neon-cyan"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h4
            className={cn(
              "mt-0.5 text-sm font-bold truncate",
              style.text,
            )}
          >
            {achievement.title}
          </h4>
          <p className="mt-1 text-[11px] text-text-secondary leading-snug">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ToastStackProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToastStack({
  achievements,
  onDismiss,
}: ToastStackProps) {
  if (achievements.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-auto">
      {achievements.map((a) => (
        <AchievementToast
          key={a.id}
          achievement={a}
          onDismiss={() => onDismiss(a.id)}
        />
      ))}
    </div>
  );
}
