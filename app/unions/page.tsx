"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { STATE_REGISTRY } from "@/content/state-registry";
import { loadUserState } from "@/lib/store/user-profile";
import { UnionMap } from "@/components/unions/union-map";
import { UnionCard } from "@/components/unions/union-card";
import { TrustFundCalculator } from "@/components/unions/trust-fund-calculator";
import { CbaSummary } from "@/components/unions/cba-summary";
import { TronGrid } from "@/components/ui/tron-grid";
import { getLocalsForState } from "@/lib/unions/union-data";

const ALL_STATES = Object.values(STATE_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function UnionsPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Unions — IronForge";
    const s = loadUserState();
    if (s.profile.state) setSelectedState(s.profile.state);
  }, []);

  const stateLocals = useMemo(
    () => (selectedState ? getLocalsForState(selectedState) : []),
    [selectedState],
  );

  const filteredStates = useMemo(() => {
    if (!query.trim()) return ALL_STATES;
    const q = query.toLowerCase();
    return ALL_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [query]);

  const stateData = selectedState ? STATE_REGISTRY[selectedState] : null;

  return (
    <div className="relative min-h-screen overflow-hidden tron-grid">
      <TronGrid />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs text-text-muted transition-colors hover:text-neon-cyan"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> BACK TO HOME
          </Link>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neon-cyan/70">
            TOOL · UNIONS
          </span>
        </header>

        <section className="mb-6">
          <h1 className="font-mono text-3xl font-bold text-text-primary md:text-4xl">
            IRONWORKERS{" "}
            <span className="text-neon-cyan text-glow-cyan">UNIONS</span>
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-sm text-text-secondary leading-relaxed">
            Every ironworkers local in the United States, mapped by region.
            Pick your state to see your local — then explore trust fund math
            and a plain-English CBA primer.
          </p>
        </section>

        {/* State selector */}
        <section className="mb-6 rounded-lg border border-cyber-border bg-cyber-dark/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70">
                Your state
              </div>
              <div className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
                {stateData
                  ? `${stateData.emoji} ${stateData.name}`
                  : "Select a state to focus the map"}
              </div>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search states..."
                className="w-full rounded bg-cyber-dark px-8 py-1.5 font-mono text-xs text-text-primary border border-cyber-border cyber-focus"
              />
            </div>
          </div>
          <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto scrollbar-thin">
            {filteredStates.map((s) => (
              <button
                key={s.code}
                onClick={() => setSelectedState(s.code)}
                className={`inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[11px] transition-colors ${
                  selectedState === s.code
                    ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                    : "border-cyber-border bg-cyber-surface/60 text-text-secondary hover:border-neon-cyan/40 hover:text-neon-cyan"
                }`}
              >
                <span>{s.emoji}</span>
                {s.code}
              </button>
            ))}
          </div>
        </section>

        {/* Your state's locals */}
        {stateData && stateLocals.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-mono text-lg font-semibold text-text-primary">
                {stateData.emoji} {stateData.name.toUpperCase()}{" "}
                <span className="text-neon-cyan">· LOCALS</span>
              </h2>
              <span className="font-mono text-[10px] text-text-muted">
                {stateLocals.length} local
                {stateLocals.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stateLocals.map((local, i) => (
                <UnionCard
                  key={`${local.number}-${local.city}-${i}`}
                  local={local}
                  highlighted
                />
              ))}
            </div>
            {stateData.unionNotes && (
              <p className="mt-3 rounded border border-cyber-border bg-cyber-surface/40 p-3 font-mono text-[12px] text-text-secondary leading-relaxed">
                <span className="text-text-muted">State notes: </span>
                {stateData.unionNotes}
              </p>
            )}
          </section>
        )}

        {/* Regional map */}
        <section className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-mono text-lg font-semibold text-text-primary">
              REGIONAL{" "}
              <span className="text-neon-cyan text-glow-cyan">MAP</span>
            </h2>
            <span className="font-mono text-[10px] text-text-muted">
              click a region to expand
            </span>
          </div>
          <UnionMap highlightState={selectedState} />
        </section>

        {/* Trust fund + CBA side by side on desktop */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          <TrustFundCalculator />
          <CbaSummary />
        </section>
      </div>
    </div>
  );
}
