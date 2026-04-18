"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, RefreshCw } from "lucide-react";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { TronGrid } from "@/components/ui/tron-grid";
import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { EstimatorForm } from "@/components/estimator/estimator-form";
import { EstimateResults } from "@/components/estimator/estimate-results";
import { EstimatePdf } from "@/components/estimator/estimate-pdf";
import { calculateEstimate } from "@/lib/estimator/calculate";
import {
  DEFAULT_ESTIMATE_INPUT,
  type EstimateInput,
} from "@/lib/types/estimator";

const STORAGE_KEY = "ironforge:estimator:input";

export default function EstimatorPage() {
  const [input, setInput] = useState<EstimateInput>(DEFAULT_ESTIMATE_INPUT);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<EstimateInput>;
        setInput({ ...DEFAULT_ESTIMATE_INPUT, ...parsed });
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    } catch {
      /* noop */
    }
  }, [input, hydrated]);

  useEffect(() => {
    document.title = "IronForge — Estimating Calculator";
  }, []);

  const result = useMemo(() => calculateEstimate(input), [input]);

  function handleReset() {
    if (confirm("Clear all estimator inputs?")) {
      setInput(DEFAULT_ESTIMATE_INPUT);
    }
  }

  return (
    <div className="estimator-page min-h-screen relative overflow-hidden tron-grid bg-cyber-black">
      {/* Background effects */}
      <div className="no-print">
        <MatrixRain opacity={0.05} speed={0.6} />
        <TronGrid />
      </div>

      {/* Header */}
      <header className="no-print relative z-10 border-b border-cyber-border bg-cyber-darker/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-muted hover:text-neon-cyan text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span className="h-4 w-px bg-cyber-border" />
            <div className="flex items-center gap-2">
              <IBeamIcon className="w-5 h-5 text-neon-cyan animate-neon-pulse" />
              <span className="font-mono font-bold text-text-primary text-sm tracking-wide">
                IRON<span className="text-neon-cyan">FORGE</span>
                <span className="text-text-muted"> / ESTIMATOR</span>
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-text-muted hover:text-neon-amber transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
            <Link
              href="/"
              className="text-[11px] font-mono uppercase tracking-wider text-text-muted hover:text-neon-cyan transition-colors"
            >
              ← Back to Wizard
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Title */}
        <div className="no-print text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5">
            <Calculator className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.3em]">
              Steel Erection // Bid Engine
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight">
            <span className="text-text-primary">ESTIMATING </span>
            <span className="text-neon-cyan text-glow-cyan">CALCULATOR</span>
          </h1>
          <p className="text-sm md:text-base text-text-secondary font-mono max-w-2xl mx-auto">
            Enter project scope, labor, and equipment data. Get an
            industry-realistic bid in real time — with burden rates, prevailing
            wage, bonding, and contingency folded in.
          </p>
        </div>

        {/* Layout: form + live results */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="no-print lg:col-span-2 space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-text-muted">
                ▸ Input Parameters
              </h2>
              <span className="text-[10px] font-mono text-neon-green">
                ● LIVE
              </span>
            </div>
            <EstimatorForm input={input} onChange={setInput} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="no-print flex items-baseline justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-text-muted">
                ▸ Bid Output
              </h2>
              <EstimatePdf input={input} result={result} />
            </div>
            <EstimateResults input={input} result={result} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print relative z-10 border-t border-cyber-border mt-16 py-6 text-center">
        <p className="text-[11px] font-mono text-text-muted tracking-wider">
          [ BALLPARK ESTIMATE • VERIFY WITH CURRENT WAGE & MATERIAL PRICING ]
        </p>
      </footer>
    </div>
  );
}
