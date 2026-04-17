"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, ChevronDown, ChevronUp, MessageSquare, X } from "lucide-react";
import type { UserProfile } from "@/lib/types/wizard";
import {
  getRelevantTips,
  renderTipMessage,
  type CoachTip,
} from "@/lib/ai/phase-coach";

const DISMISS_STORAGE_KEY = "ironforge_coach_dismissed";
const MAX_VISIBLE = 2;

interface CoachTipProps {
  phaseId: string;
  stepId?: string;
  profile: UserProfile;
  /**
   * Optional callback invoked when the user clicks "more tips" — the
   * wizard can hand off the request to the AI chat panel. Receives a
   * prewritten question.
   */
  onAskChat?: (question: string) => void;
}

function loadDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function saveDismissed(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage full — not critical
  }
}

export function CoachTip({
  phaseId,
  stepId,
  profile,
  onAskChat,
}: CoachTipProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setDismissed(loadDismissed());
  }, []);

  const tips = useMemo(
    () =>
      getRelevantTips({
        phaseId,
        stepId,
        profile,
        dismissedIds: dismissed,
      }),
    [phaseId, stepId, profile, dismissed]
  );

  if (tips.length === 0) return null;

  const visible: CoachTip[] = tips.slice(0, MAX_VISIBLE);

  function handleDismiss(id: string) {
    const next = [...dismissed, id];
    setDismissed(next);
    saveDismissed(next);
  }

  function handleAskMore() {
    if (!onAskChat) return;
    onAskChat(
      `Give me more proactive tips and watch-outs for this step based on my profile. Be specific to my state and situation.`
    );
  }

  return (
    <div className="relative bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl overflow-hidden animate-fade-in-up">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
      {/* Left neon border — hallmark of the Coach card */}
      <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-cyan/50 to-transparent" />

      <div className="p-5 pl-6">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between gap-3 group"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              🤖
            </span>
            <Brain className="w-4 h-4 text-neon-cyan" />
            <h2 className="text-sm font-mono font-semibold text-neon-cyan tracking-wider uppercase">
              AI Coach
            </h2>
            <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border">
              {visible.length}
              {tips.length > visible.length ? `/${tips.length}` : ""}
            </span>
          </div>
          <div className="text-text-muted group-hover:text-neon-cyan transition-colors">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="mt-4 space-y-3">
            {visible.map((tip) => (
              <div
                key={tip.id}
                className="group relative bg-cyber-dark/50 border border-cyber-border rounded-lg p-3 pr-8 hover:border-neon-cyan/30 transition-colors"
              >
                <p className="text-sm text-text-secondary leading-relaxed">
                  {renderTipMessage(tip.message, profile)
                    .split("**")
                    .map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-text-primary font-semibold">
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                </p>
                <button
                  type="button"
                  onClick={() => handleDismiss(tip.id)}
                  aria-label="Dismiss this tip"
                  className="absolute top-2 right-2 p-1 text-text-muted hover:text-neon-red rounded transition-colors opacity-60 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {onAskChat && (
              <button
                type="button"
                onClick={handleAskMore}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neon-magenta/30 bg-neon-magenta/5 text-neon-magenta hover:bg-neon-magenta/10 hover:border-neon-magenta/60 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                More tips from mentor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
