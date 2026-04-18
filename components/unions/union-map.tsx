"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useMemo, useState } from "react";
import { UnionCard } from "./union-card";
import {
  getRegionalGroups,
  type RegionUnionGroup,
  type Region,
} from "@/lib/unions/union-data";
import { ChevronDown, ChevronUp } from "lucide-react";

interface UnionMapProps {
  /** If set, the region containing this state opens expanded by default. */
  highlightState?: string | null;
}

/**
 * A lightweight "regional map" — no mapping library. Shows ironworkers locals
 * grouped by US region, with expandable sections and per-state breakdown.
 */
export function UnionMap({ highlightState }: UnionMapProps) {
  const groups = useMemo(() => getRegionalGroups(), []);

  const initiallyOpen = useMemo<Region | null>(() => {
    if (!highlightState) return null;
    const hit = groups.find((g) =>
      g.states.some((s) => s.code === highlightState),
    );
    return hit?.region ?? null;
  }, [groups, highlightState]);

  const [open, setOpen] = useState<Region | null>(initiallyOpen);

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <RegionSection
          key={group.region}
          group={group}
          expanded={open === group.region}
          onToggle={() =>
            setOpen((cur) => (cur === group.region ? null : group.region))
          }
          highlightState={highlightState}
        />
      ))}
    </div>
  );
}

interface RegionSectionProps {
  group: RegionUnionGroup;
  expanded: boolean;
  onToggle: () => void;
  highlightState?: string | null;
}

function RegionSection({
  group,
  expanded,
  onToggle,
  highlightState,
}: RegionSectionProps) {
  const hasMatch = highlightState
    ? group.states.some((s) => s.code === highlightState)
    : false;

  return (
    <section
      className={`rounded-lg border bg-cyber-dark/50 transition-all ${
        hasMatch
          ? "border-neon-cyan/40"
          : expanded
            ? "border-cyber-border-bright"
            : "border-cyber-border"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-neon-cyan/70">
            REGION
          </span>
          <span className="font-mono text-sm font-semibold text-text-primary">
            {group.region}
          </span>
          <span className="rounded border border-cyber-border bg-cyber-surface/60 px-2 py-0.5 font-mono text-[10px] text-text-secondary">
            {group.locals.length} locals · {group.states.length} states
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-cyber-border/50 p-4 space-y-4">
          {/* State chips */}
          <div className="flex flex-wrap gap-1.5">
            {group.states.map((s) => (
              <span
                key={s.code}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] tracking-wider ${
                  highlightState === s.code
                    ? "border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                    : "border border-cyber-border bg-cyber-surface/60 text-text-secondary"
                }`}
              >
                <span>{s.emoji}</span>
                {s.code}
              </span>
            ))}
          </div>

          {/* Locals */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.locals.map((local) => (
              <UnionCard
                key={`${group.region}-${local.number}-${local.city}`}
                local={local}
                highlighted={
                  !!highlightState && local.states.includes(highlightState)
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
