"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileText,
  Shield,
  Wallet,
  HardHat,
  ClipboardList,
  Users,
  Presentation,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { loadUserState } from "@/lib/store/user-profile";

interface PrequalItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Heuristic: is it reasonable that a wizard-advanced user already has this? */
  impliedBy?: "any" | "insurance" | "bonding";
}

const ITEMS: PrequalItem[] = [
  {
    id: "financials",
    title: "Reviewed financial statements (3 years)",
    description:
      "CPA-reviewed or audited balance sheet, P&L, and cash flow for the last 3 fiscal years. Startups: use personal financials + opening balance sheet.",
    icon: Wallet,
  },
  {
    id: "emr",
    title: "EMR letter (Experience Modification Rate) < 1.0",
    description:
      "Get the latest EMR letter from your workers' comp carrier. Most large GCs require < 1.0; some require < 0.9.",
    icon: AlertTriangle,
  },
  {
    id: "coi",
    title: "Insurance COI meeting GC minimums",
    description:
      "Typical requirements: $2M GL per occurrence / $4M aggregate, $1M auto, $1M WC, $5M+ umbrella. Add the GC as additional insured.",
    icon: Shield,
    impliedBy: "insurance",
  },
  {
    id: "bonding",
    title: "Bonding capacity letter",
    description:
      "From your surety: single-job and aggregate capacity. Most GCs want capacity ≥ your largest expected subcontract + 25%.",
    icon: FileText,
    impliedBy: "bonding",
  },
  {
    id: "safety",
    title: "Written safety program + OSHA training records",
    description:
      "Site-specific safety plan, fall protection plan, JHAs/AHAs, OSHA 10/30 training records, toolbox talk log, substance-abuse policy.",
    icon: HardHat,
  },
  {
    id: "osha",
    title: "OSHA 300/300A logs (last 3 years)",
    description:
      "Injury and illness logs. Zero-incident is ideal; if not, be ready to explain trends and corrective actions.",
    icon: ClipboardList,
  },
  {
    id: "references",
    title: "Project references (3-5 similar jobs)",
    description:
      "Contact info for project managers at past GCs / owners. Include scope, contract value, duration, and schedule performance.",
    icon: Users,
  },
  {
    id: "capability",
    title: "Capability statement / company overview",
    description:
      "One-pager or slide deck: who you are, scope of self-performed work, crew size, certifications (MBE/WBE/SDVOSB), equipment list.",
    icon: Presentation,
  },
];

const STORAGE_KEY = "ironforge-prequal-checklist";

export function GcPrequalChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [profileHints, setProfileHints] = useState<{
    hasProfile: boolean;
  }>({ hasProfile: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    const s = loadUserState();
    setProfileHints({ hasProfile: !!s.profile.state });
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const total = ITEMS.length;
  const done = ITEMS.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="rounded-lg border border-cyber-border bg-cyber-dark/60 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70">
            Prequalification
          </div>
          <h3 className="mt-1 font-mono text-lg font-semibold text-text-primary">
            GC PREQUAL{" "}
            <span className="text-neon-cyan text-glow-cyan">CHECKLIST</span>
          </h3>
          <p className="mt-1 max-w-lg text-xs text-text-secondary font-mono leading-relaxed">
            Most large GCs require the same core package before you can bid.
            Assemble this once, keep it updated, and paste it into every portal.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-2xl font-semibold text-neon-cyan text-glow-cyan">
            {pct}%
          </div>
          <div className="font-mono text-[10px] tracking-wider text-text-muted">
            {done} / {total} COMPLETE
          </div>
        </div>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-cyber-surface">
        <div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className={`flex w-full items-start gap-3 rounded border p-3 text-left transition-all ${
                  isChecked
                    ? "border-neon-green/40 bg-neon-green/5"
                    : "border-cyber-border bg-cyber-surface/40 hover:border-neon-cyan/30"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="h-4 w-4 text-neon-green" />
                  ) : (
                    <Circle className="h-4 w-4 text-text-muted" />
                  )}
                </div>
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isChecked ? "text-neon-green" : "text-neon-cyan/60"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-mono text-xs font-semibold ${
                      isChecked ? "text-neon-green" : "text-text-primary"
                    }`}
                  >
                    {item.title}
                  </div>
                  <p className="mt-1 text-[11px] text-text-secondary font-mono leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {profileHints.hasProfile && (
        <p className="mt-3 rounded border border-neon-cyan/30 bg-neon-cyan/5 p-2 font-mono text-[11px] text-neon-cyan/80">
          💡 Tip: the wizard&apos;s Bonding and Insurance phases produce the
          letters and COIs most GCs ask for on this list.
        </p>
      )}
    </div>
  );
}
