"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { TronGrid } from "@/components/ui/tron-grid";
import { CapStatementForm } from "@/components/capability/cap-statement-form";
import { CapStatementPreview } from "@/components/capability/cap-statement-preview";
import { CapStatementExport } from "@/components/capability/cap-statement-export";
import {
  type CapStatementData,
  DEFAULT_CAP_STATEMENT,
} from "@/lib/types/cap-statement";
import { loadCapStatement, saveCapStatement } from "@/lib/store/cap-statement";
import { loadUserState } from "@/lib/store/user-profile";

export default function CapabilityStatementPage() {
  const [data, setData] = useState<CapStatementData>(DEFAULT_CAP_STATEMENT);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage and pre-fill from user profile
  useEffect(() => {
    document.title = "Capability Statement | IronForge";
    const stored = loadCapStatement();
    const userState = loadUserState();

    // Pre-fill from user profile if cap statement is empty/default
    const prefilled: CapStatementData = {
      ...stored,
      companyName:
        stored.companyName || userState.profile.businessName || "",
      state: stored.state || userState.profile.state || "",
      certifications: {
        ...stored.certifications,
        SDVOSB:
          stored.certifications.SDVOSB ||
          (userState.profile.isDisabledVeteran ?? false),
        MBE: stored.certifications.MBE || (userState.profile.isMinority ?? false),
        WBE: stored.certifications.WBE || (userState.profile.isWomanOwned ?? false),
        WOSB:
          stored.certifications.WOSB || (userState.profile.isWomanOwned ?? false),
      },
    };
    setData(prefilled);
    setHydrated(true);
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCapStatement(data);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated]);

  return (
    <div className="min-h-screen relative">
      <TronGrid />

      {/* ═══ Header (hidden in print) ═══ */}
      <header className="no-print relative z-10 border-b border-cyber-border bg-cyber-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-muted hover:text-neon-cyan font-mono text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> HOME
          </Link>
          <div className="flex items-center gap-2">
            <IBeamIcon className="w-5 h-5 text-neon-cyan" />
            <h1 className="font-mono font-bold text-sm tracking-wider text-text-primary">
              CAPABILITY{" "}
              <span className="text-neon-cyan text-glow-cyan">STATEMENT</span>{" "}
              <span className="text-text-muted">BUILDER</span>
            </h1>
          </div>
          <CapStatementExport />
        </div>
      </header>

      {/* ═══ Main content ═══ */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Form */}
          <div className="no-print space-y-4">
            <div className="cyber-card rounded-lg p-4 border-l-2 border-neon-cyan">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-green animate-neon-pulse" />
                <span className="font-mono text-[10px] text-neon-green tracking-wider uppercase">
                  Auto-Saving
                </span>
              </div>
              <p className="font-mono text-[11px] text-text-secondary">
                Fill in the sections below. Your capability statement updates live
                on the right and saves to your browser automatically.
              </p>
            </div>
            <CapStatementForm data={data} onChange={setData} />
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="no-print mb-2 flex items-center gap-2">
              <span className="font-mono text-[10px] text-neon-magenta tracking-wider uppercase">
                ▸ LIVE PREVIEW
              </span>
              <span className="text-text-muted font-mono text-[10px]">
                — prints as PDF
              </span>
            </div>
            <CapStatementPreview data={data} />
          </div>
        </div>
      </main>

      {/* ═══ Print-only styles ═══ */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            background: #fff !important;
            color: #0f172a !important;
          }
          .no-print,
          header,
          nav,
          .tron-floor,
          .matrix-rain-container,
          .scanlines::after {
            display: none !important;
          }
          .cap-preview {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          main {
            padding: 0 !important;
            max-width: none !important;
          }
          .grid {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
