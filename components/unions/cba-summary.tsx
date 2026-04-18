"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { FileText, Gavel, HardHat, Wallet, Clock, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Section {
  icon: LucideIcon;
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    icon: FileText,
    title: "What is a CBA?",
    body: "A Collective Bargaining Agreement is the contract negotiated between an ironworkers local (or district council) and a multi-employer association of signatory contractors. It is the law of the jobsite for signatory work: wages, benefits, hours, dispatch rules, jurisdiction.",
  },
  {
    icon: Wallet,
    title: "Wages & Fringes",
    body: "Look for the hourly wage schedule by classification (apprentice tiers, journeyman, foreman, GF). Fringes — Health & Welfare, Pension, Annuity, Training, LMCC — are paid on top of the taxable wage, usually straight-dollar per hour worked.",
  },
  {
    icon: Clock,
    title: "Hours & Overtime",
    body: "Standard is 8 hr/day, 40 hr/week. Overtime rates (1.5× or 2×) typically apply after 8 hours, on Saturdays, Sundays, and holidays. Shift differentials and show-up pay clauses vary — read them carefully.",
  },
  {
    icon: HardHat,
    title: "Working Conditions",
    body: "CBAs cover tools furnished, PPE, scaffolding and fall protection, travel/subsistence, parking, coffee breaks, and inclement-weather rules. Non-compliance is the fastest way to a grievance.",
  },
  {
    icon: Users,
    title: "Dispatch & Manning",
    body: "Most CBAs require you to call the hall to request workers. Ratios govern how many apprentices per journeyman and how many workers of your own you can bring on a job (\"key man\" clauses). Composite crews may apply on mixed-trade work.",
  },
  {
    icon: Gavel,
    title: "Grievance & Jurisdiction",
    body: "A grievance procedure escalates disputes (steward → business agent → joint committee → arbitration). Jurisdictional disputes over work assignment go to the Plan for Settlement of Jurisdictional Disputes in the Construction Industry.",
  },
];

export function CbaSummary() {
  return (
    <div className="rounded-lg border border-cyber-border bg-cyber-dark/60 p-5">
      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70">
          Plain-English primer
        </div>
        <h3 className="mt-1 font-mono text-lg font-semibold text-text-primary">
          READING YOUR{" "}
          <span className="text-neon-cyan text-glow-cyan">CBA</span>
        </h3>
        <p className="mt-1 text-xs text-text-secondary font-mono leading-relaxed">
          A general education map to the Collective Bargaining Agreement you
          sign when you become a signatory ironwork contractor. Your local&apos;s
          actual agreement governs — always read the current book.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded border border-cyber-border bg-cyber-surface/40 p-4 transition-colors hover:border-neon-cyan/30"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h4 className="font-mono text-xs font-semibold tracking-wider text-text-primary">
                {title.toUpperCase()}
              </h4>
            </div>
            <p className="mt-2 text-[12px] text-text-secondary font-mono leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded border border-neon-amber/40 bg-neon-amber/5 p-3">
        <div className="flex items-start gap-2">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-neon-amber">
            ⚠ PRO TIP
          </span>
        </div>
        <p className="mt-1 text-[12px] text-text-secondary font-mono leading-relaxed">
          Ask the local&apos;s business agent for the current wage &amp; fringe
          schedule (usually updated semi-annually) before bidding — outdated
          numbers eat profit fast.
        </p>
      </div>
    </div>
  );
}
