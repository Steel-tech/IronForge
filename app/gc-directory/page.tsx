"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GC_DIRECTORY } from "@/content/gc-directory";
import { loadUserState } from "@/lib/store/user-profile";
import { TronGrid } from "@/components/ui/tron-grid";
import {
  GcSearchFilters,
  DEFAULT_GC_FILTERS,
  type GcFilters,
} from "@/components/gc-directory/gc-search-filters";
import { GcCard } from "@/components/gc-directory/gc-card";
import { GcPrequalChecklist } from "@/components/gc-directory/gc-prequal-checklist";

export default function GcDirectoryPage() {
  const [filters, setFilters] = useState<GcFilters>(DEFAULT_GC_FILTERS);
  const [userState, setUserState] = useState<string | null>(null);

  useEffect(() => {
    document.title = "GC Directory — IronForge";
    const s = loadUserState();
    if (s.profile.state) {
      setUserState(s.profile.state);
      setFilters((prev) => ({ ...prev, state: s.profile.state ?? "" }));
    }
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return GC_DIRECTORY.filter((gc) => {
      if (q && !gc.name.toLowerCase().includes(q)) return false;
      if (filters.state && !gc.states.includes(filters.state)) return false;
      if (
        filters.projectType &&
        !gc.projectTypes.includes(filters.projectType)
      )
        return false;
      if (filters.size && gc.size !== filters.size) return false;
      if (filters.unionPreferredOnly && !gc.unionPreferred) return false;
      return true;
    }).sort((a, b) => {
      // Bring user-state matches to the front.
      if (userState) {
        const am = a.states.includes(userState);
        const bm = b.states.includes(userState);
        if (am && !bm) return -1;
        if (!am && bm) return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [filters, userState]);

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
            TOOL · GC DIRECTORY
          </span>
        </header>

        <section className="mb-6">
          <h1 className="font-mono text-3xl font-bold text-text-primary md:text-4xl">
            GENERAL{" "}
            <span className="text-neon-cyan text-glow-cyan">CONTRACTORS</span>
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-sm text-text-secondary leading-relaxed">
            Major GCs that routinely hire ironwork subcontractors. Filter by
            state, project type, or union preference to shortlist your targets.
          </p>
        </section>

        <section className="mb-4">
          <GcSearchFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />
        </section>

        {/* Grid of results */}
        <section className="mb-10">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-cyber-border bg-cyber-dark/50 p-10 text-center font-mono text-sm text-text-muted">
              No GCs match these filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((gc) => (
                <GcCard key={gc.name} gc={gc} userState={userState} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <GcPrequalChecklist />
        </section>
      </div>
    </div>
  );
}
