"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompare, Printer } from "lucide-react";

import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { StateSelector } from "@/components/compare/state-selector";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { STATE_REGISTRY } from "@/content/state-registry";

const LS_KEY = "ironforge_compare_states";

function loadSelected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c): c is string => typeof c === "string" && /^[A-Z]{2}$/.test(c))
      .filter((c) => !!STATE_REGISTRY[c])
      .slice(0, 3);
  } catch {
    return [];
  }
}

function saveSelected(codes: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(codes));
  } catch {
    // ignore
  }
}

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSelected(loadSelected());
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.title = "IronForge — State Comparison";
  }, []);

  useEffect(() => {
    if (loaded) saveSelected(selected);
  }, [selected, loaded]);

  const hasEnough = selected.length >= 2;

  return (
    <div className="min-h-screen bg-cyber-black tron-grid">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-neon-cyan text-xs font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> HOME
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/wizard/summary"
              className="text-[10px] font-mono uppercase tracking-wider text-text-muted hover:text-neon-cyan transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-3">
            <IBeamIcon className="w-9 h-9 text-neon-magenta animate-neon-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-text-primary mb-2">
            STATE{" "}
            <span className="text-neon-magenta text-glow-magenta">
              COMPARISON
            </span>
          </h1>
          <p className="text-text-muted font-mono text-xs max-w-xl mx-auto">
            Compare licensing, taxes, bonding, insurance, and union coverage
            across up to 3 states side-by-side.
          </p>
        </div>

        {/* Selector */}
        <div className="mb-6 animate-fade-in-up stagger-1 print:hidden">
          <StateSelector
            selected={selected}
            onChange={setSelected}
            max={3}
          />
        </div>

        {/* Print header (only visible in print) */}
        <div className="hidden print:block mb-6">
          <h1 className="text-lg font-mono font-bold">
            IronForge — State Comparison
          </h1>
          {selected.length > 0 && (
            <p className="text-xs">
              Comparing:{" "}
              {selected
                .map((c) => STATE_REGISTRY[c]?.name ?? c)
                .join(" vs. ")}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="mb-8 animate-fade-in-up stagger-2">
          <ComparisonTable stateCodes={selected} />
        </div>

        {/* Summary */}
        {hasEnough && (
          <div className="mb-10 animate-fade-in-up stagger-3">
            <ComparisonSummary stateCodes={selected} />
          </div>
        )}

        {/* Actions */}
        {hasEnough && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cyber-border/60 print:hidden">
            <Link
              href="/wizard/summary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-cyan"
            >
              <GitCompare className="w-4 h-4" /> BACK TO DASHBOARD
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-magenta"
            >
              <Printer className="w-4 h-4" /> PRINT COMPARISON
            </button>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .tron-grid::before,
          .matrix-rain-container,
          .tron-floor {
            display: none !important;
          }
          .bg-cyber-black,
          .bg-cyber-dark,
          .bg-cyber-darker,
          .bg-cyber-surface\\/60,
          .bg-cyber-surface\\/40,
          .bg-cyber-surface\\/20 {
            background: white !important;
          }
          .text-text-primary,
          .text-text-secondary,
          .text-text-muted,
          .text-neon-cyan,
          .text-neon-magenta,
          .text-neon-amber,
          .text-neon-green,
          .text-neon-red {
            color: black !important;
            text-shadow: none !important;
          }
          .border-cyber-border,
          .border-cyber-border\\/40,
          .border-cyber-border\\/60,
          .border-neon-cyan\\/30,
          .border-neon-cyan\\/20,
          .border-neon-amber\\/20 {
            border-color: #999 !important;
          }
          .comparison-table th,
          .comparison-table td {
            border: 1px solid #999 !important;
          }
          .text-glow-cyan,
          .text-glow-magenta,
          .text-glow-amber,
          .text-glow-green,
          .text-glow-red {
            text-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
