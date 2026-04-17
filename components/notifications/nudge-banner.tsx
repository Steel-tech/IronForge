"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Nudge, NudgeType } from "@/lib/notifications/nudge-engine";

interface NudgeBannerProps {
  nudge: Nudge & { renderedMessage: string };
  onDismiss: () => void;
}

const TYPE_BORDER: Record<NudgeType, string> = {
  encouragement: "border-l-neon-green",
  tip: "border-l-neon-amber",
  reminder: "border-l-neon-cyan",
  milestone: "border-l-neon-magenta",
};

const TYPE_TEXT: Record<NudgeType, string> = {
  encouragement: "text-neon-green",
  tip: "text-neon-amber",
  reminder: "text-neon-cyan",
  milestone: "text-neon-magenta",
};

export function NudgeBanner({ nudge, onDismiss }: NudgeBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "cyber-card border border-cyber-border border-l-4 rounded-lg px-4 py-3 flex items-start gap-3",
        TYPE_BORDER[nudge.type],
      )}
    >
      <span
        aria-hidden
        className={cn("text-lg leading-none mt-0.5", TYPE_TEXT[nudge.type])}
      >
        {nudge.icon}
      </span>
      <p className="flex-1 text-xs sm:text-sm font-mono text-text-primary leading-snug">
        {nudge.renderedMessage}
      </p>
      {nudge.dismissable && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-text-muted hover:text-neon-cyan transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
