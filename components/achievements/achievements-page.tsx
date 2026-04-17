"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACHIEVEMENTS,
  RARITY_STYLES,
  type Achievement,
  type AchievementRarity,
} from "@/lib/achievements/definitions";
import {
  loadAchievementsState,
  type AchievementsState,
} from "@/lib/store/achievements";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const RARITY_FILTER_ORDER: AchievementRarity[] = [
  "common",
  "rare",
  "epic",
  "legendary",
];

export function AchievementsPage() {
  const [loaded, setLoaded] = useState(false);
  const [achState, setAchState] = useState<AchievementsState | null>(null);

  useEffect(() => {
    setAchState(loadAchievementsState());
    setLoaded(true);
  }, []);

  const unlockedMap = useMemo(() => {
    const m = new Map<
      string,
      { unlockedAt: string; seen: boolean }
    >();
    if (achState) {
      for (const u of achState.unlocked) {
        m.set(u.id, { unlockedAt: u.unlockedAt, seen: u.seen });
      }
    }
    return m;
  }, [achState]);

  const total = ACHIEVEMENTS.length;
  const unlockedCount = unlockedMap.size;
  const progressPct = total > 0 ? (unlockedCount / total) * 100 : 0;

  // Group by rarity for display
  const grouped = useMemo(() => {
    const g: Record<AchievementRarity, Achievement[]> = {
      common: [],
      rare: [],
      epic: [],
      legendary: [],
    };
    for (const a of ACHIEVEMENTS) g[a.rarity].push(a);
    return g;
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black tron-grid text-text-primary">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-neon-cyan transition-colors mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to base
          </Link>
          <h1 className="font-mono text-2xl sm:text-3xl font-bold text-neon-amber text-glow-amber flex items-center gap-3">
            <Trophy className="w-7 h-7" />
            Achievements
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary font-mono">
            Unlock badges as you complete your contractor setup.
          </p>
        </div>

        {/* Progress */}
        <div className="cyber-card rounded-lg border border-cyber-border p-4 mb-8">
          <div className="flex items-center justify-between mb-2 font-mono text-sm">
            <span className="text-text-secondary uppercase tracking-widest text-[10px]">
              Progress
            </span>
            <span className="text-neon-cyan text-glow-cyan">
              {unlockedCount} / {total} Unlocked
            </span>
          </div>
          <div className="h-2 bg-cyber-darker rounded-full overflow-hidden border border-cyber-border">
            <div
              className="neon-progress-bar h-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Grid by rarity */}
        {loaded &&
          RARITY_FILTER_ORDER.map((rarity) => {
            const items = grouped[rarity];
            if (items.length === 0) return null;
            const style = RARITY_STYLES[rarity];
            return (
              <section key={rarity} className="mb-8">
                <h2
                  className={cn(
                    "font-mono text-xs uppercase tracking-widest mb-3",
                    style.text,
                  )}
                >
                  {style.label} · {items.length}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => {
                    const unlocked = unlockedMap.get(a.id);
                    return (
                      <AchievementCard
                        key={a.id}
                        achievement={a}
                        unlockedAt={unlocked?.unlockedAt ?? null}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}

        {!loaded && (
          <div className="text-text-muted font-mono text-xs">
            Loading achievements…
          </div>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  achievement: Achievement;
  unlockedAt: string | null;
}

function AchievementCard({ achievement, unlockedAt }: CardProps) {
  const unlocked = !!unlockedAt;
  const style = RARITY_STYLES[achievement.rarity];

  return (
    <div
      className={cn(
        "cyber-card rounded-lg p-4 border transition-all font-mono",
        unlocked ? style.border : "border-cyber-border opacity-50",
        unlocked && style.glow,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 w-14 h-14 rounded flex items-center justify-center text-3xl bg-cyber-darker border",
            unlocked ? style.border : "border-cyber-border",
            !unlocked && "grayscale",
          )}
        >
          {unlocked ? achievement.icon : <Lock className="w-5 h-5 text-text-muted" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[9px] uppercase tracking-widest",
                unlocked ? style.text : "text-text-muted",
              )}
            >
              {style.label}
            </span>
          </div>
          <h3
            className={cn(
              "text-sm font-bold mt-0.5",
              unlocked ? style.text : "text-text-secondary",
            )}
          >
            {unlocked ? achievement.title : "???"}
          </h3>
          <p className="mt-1 text-[11px] text-text-secondary leading-snug">
            {unlocked ? achievement.description : "Keep playing to unlock."}
          </p>
          {unlocked && unlockedAt && (
            <p className="mt-2 text-[10px] text-text-muted">
              Unlocked {formatDate(unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
