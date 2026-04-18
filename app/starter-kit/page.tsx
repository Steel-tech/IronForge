"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Printer, Package, BookOpen, CheckSquare, MapPin, ListOrdered, Calculator } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { TronGrid } from "@/components/ui/tron-grid";
import { StarterKitContent } from "@/components/starter-kit/starter-kit-content";
import { loadUserState } from "@/lib/store/user-profile";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";

export default function StarterKitPage() {
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    document.title = "Starter Kit | IronForge";
    setUserState(loadUserState());
    setHydrated(true);
  }, []);

  const stateCode = userState.profile.state;
  const stateData = stateCode ? STATE_REGISTRY[stateCode] : null;

  function handleGenerate() {
    setPreviewMode(true);
    // Delay slightly so content mounts before print dialog
    setTimeout(() => {
      if (typeof window !== "undefined") window.print();
    }, 150);
  }

  return (
    <div className="min-h-screen relative">
      <TronGrid />

      {/* ═══ Header (hidden in print) ═══ */}
      <header className="no-print relative z-10 border-b border-cyber-border bg-cyber-black/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-muted hover:text-neon-cyan font-mono text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> HOME
          </Link>
          <div className="flex items-center gap-2">
            <IBeamIcon className="w-5 h-5 text-neon-amber" />
            <h1 className="font-mono font-bold text-sm tracking-wider text-text-primary">
              STARTER{" "}
              <span className="text-neon-amber text-glow-amber">KIT</span>{" "}
              <span className="text-text-muted">GENERATOR</span>
            </h1>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!hydrated}
            className="py-2.5 px-4 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-solid inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            GENERATE &amp; PRINT
          </button>
        </div>
      </header>

      {/* ═══ Splash / preview selector ═══ */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {!previewMode && (
          <div className="no-print space-y-6 animate-fade-in-up">
            {/* Hero */}
            <div className="cyber-card rounded-xl p-8 relative neon-top-cyan overflow-hidden">
              <div className="flex items-start gap-4">
                <Package className="w-10 h-10 text-neon-amber shrink-0" />
                <div>
                  <h2 className="font-mono text-2xl font-bold text-text-primary tracking-tight">
                    PRINTABLE{" "}
                    <span className="text-neon-amber text-glow-amber">
                      STARTER BINDER
                    </span>
                  </h2>
                  <p className="text-sm text-text-secondary mt-2 max-w-xl">
                    Generate a complete, printable business-startup binder tailored
                    to{" "}
                    {stateData ? (
                      <span className="text-neon-cyan font-mono">
                        {stateData.emoji} {stateData.name}
                      </span>
                    ) : (
                      <Link
                        href="/"
                        className="text-neon-cyan underline underline-offset-2"
                      >
                        your state
                      </Link>
                    )}
                    . Covers every phase, checklist, resource, and cost
                    estimate — ready for a three-ring binder.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: BookOpen, label: "Cover page + table of contents", color: "cyan" },
                  { icon: CheckSquare, label: "All 7 phase checklists", color: "green" },
                  { icon: MapPin, label: "State quick-reference card", color: "magenta" },
                  { icon: ListOrdered, label: "Resource directory with URLs", color: "amber" },
                  { icon: Calculator, label: "Cost summary across phases", color: "cyan" },
                  { icon: Printer, label: "Print-ready formatting", color: "green" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const colorClass =
                    item.color === "cyan"
                      ? "text-neon-cyan"
                      : item.color === "magenta"
                        ? "text-neon-magenta"
                        : item.color === "green"
                          ? "text-neon-green"
                          : "text-neon-amber";
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark/40 animate-fade-in-up stagger-${(i % 6) + 1}`}
                    >
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                      <span className="font-mono text-xs text-text-secondary">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={!hydrated}
                  className="py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-solid inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  GENERATE &amp; PRINT STARTER KIT
                </button>
                <button
                  onClick={() => setPreviewMode(true)}
                  className="py-3 px-6 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-cyan"
                >
                  PREVIEW ON-SCREEN
                </button>
              </div>

              {!userState.profile.state && (
                <p className="mt-4 text-[11px] font-mono text-neon-amber">
                  ▸ No state selected yet — kit will default to Washington. Set
                  your state on the home page for localized content.
                </p>
              )}
            </div>
          </div>
        )}

        {(previewMode || !hydrated) && hydrated && (
          <div
            className={previewMode ? "animate-fade-in" : "no-print"}
            style={{ marginTop: "1rem" }}
          >
            <div className="no-print mb-4 flex items-center justify-between">
              <button
                onClick={() => setPreviewMode(false)}
                className="text-text-muted hover:text-neon-cyan font-mono text-xs inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> BACK TO GENERATOR
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="py-2 px-4 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-solid inline-flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                PRINT NOW
              </button>
            </div>
            <div className="starter-kit-wrapper">
              <StarterKitContent userState={userState} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
