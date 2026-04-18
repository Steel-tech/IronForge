"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { Fragment } from "react";
import { STATE_REGISTRY, type StateData } from "@/content/state-registry";
import { Check, X, Minus } from "lucide-react";

interface ComparisonTableProps {
  stateCodes: string[];
}

type CellTone = "good" | "bad" | "neutral" | "none";

interface ValueCell {
  content: React.ReactNode;
  tone?: CellTone;
}

interface RowSpec {
  label: string;
  help?: string;
  getCell: (s: StateData) => ValueCell;
}

interface Section {
  title: string;
  rows: RowSpec[];
}

function fmtCurrency(n: number): string {
  if (!n && n !== 0) return "—";
  return `$${n.toLocaleString()}`;
}

function feeRangeCell(
  min: number,
  max: number,
  fallback = "—",
): ValueCell {
  if (!min && !max) return { content: fallback, tone: "neutral" };
  const content = min === max ? fmtCurrency(min) : `${fmtCurrency(min)}–${fmtCurrency(max)}`;
  return { content, tone: "neutral" };
}

function YesNoIcon({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="inline-flex items-center gap-1 text-neon-red">
      <Check className="w-3.5 h-3.5" /> YES
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-neon-green">
      <X className="w-3.5 h-3.5" /> NO
    </span>
  );
}

function YesNoGood({ yes, goodWhen }: { yes: boolean; goodWhen: "yes" | "no" }) {
  const isGood = (yes && goodWhen === "yes") || (!yes && goodWhen === "no");
  const color = isGood ? "text-neon-green" : "text-neon-red";
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      {yes ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      {yes ? "YES" : "NO"}
    </span>
  );
}

// Build sections
const SECTIONS: Section[] = [
  {
    title: "Business Formation",
    rows: [
      {
        label: "LLC Filing Fee",
        getCell: (s) => {
          const tone: CellTone =
            s.llcFilingFee <= 75
              ? "good"
              : s.llcFilingFee >= 300
                ? "bad"
                : "neutral";
          return { content: fmtCurrency(s.llcFilingFee), tone };
        },
      },
      {
        label: "Annual Report Fee",
        getCell: (s) => {
          const tone: CellTone =
            s.annualReportFee === 0
              ? "good"
              : s.annualReportFee >= 200
                ? "bad"
                : "neutral";
          return {
            content:
              s.annualReportFee === 0
                ? "NONE"
                : fmtCurrency(s.annualReportFee),
            tone,
          };
        },
      },
      {
        label: "State Income Tax",
        getCell: (s) => ({
          content: s.incomeTaxRate,
          tone: !s.hasIncomeTax
            ? "good"
            : s.incomeTaxRate.includes("13")
              ? "bad"
              : "neutral",
        }),
      },
      {
        label: "Sales Tax",
        getCell: (s) => ({
          content: s.hasSalesTax ? s.salesTaxDetails : "No state sales tax",
          tone: !s.hasSalesTax ? "good" : "neutral",
        }),
      },
    ],
  },
  {
    title: "Licensing",
    rows: [
      {
        label: "Contractor License Required",
        getCell: (s) => ({
          content: (
            <div className="space-y-1">
              <YesNoGood yes={s.hasStateLicense} goodWhen="no" />
              {s.hasStateLicense && s.licensingAgency && (
                <div className="text-[10px] text-text-muted">
                  {s.licensingAgency}
                </div>
              )}
            </div>
          ),
          tone: "none",
        }),
      },
      {
        label: "License Fee",
        getCell: (s) => {
          if (!s.hasStateLicense) return { content: "N/A", tone: "good" };
          return feeRangeCell(s.licensingFee.min, s.licensingFee.max);
        },
      },
      {
        label: "Exam Required",
        getCell: (s) => ({
          content: <YesNoGood yes={s.examRequired} goodWhen="no" />,
          tone: "none",
        }),
      },
      {
        label: "Prevailing Wage Law",
        getCell: (s) => ({
          content: (
            <div className="space-y-1">
              <YesNoIcon yes={s.hasStatePrevailingWage} />
              {s.hasStatePrevailingWage && s.prevailingWageThreshold && (
                <div className="text-[10px] text-text-muted">
                  Threshold: {s.prevailingWageThreshold}
                </div>
              )}
            </div>
          ),
          tone: "none",
        }),
      },
    ],
  },
  {
    title: "Insurance",
    rows: [
      {
        label: "Workers' Comp Type",
        getCell: (s) => {
          const tone: CellTone =
            s.wcType === "monopolistic"
              ? "bad"
              : s.wcType === "competitive"
                ? "neutral"
                : "good";
          return {
            content: (
              <span className="uppercase font-semibold">{s.wcType}</span>
            ),
            tone,
          };
        },
      },
      {
        label: "WC Agency / State Fund",
        getCell: (s) => ({
          content: s.wcAgency || "—",
          tone: "neutral",
        }),
      },
    ],
  },
  {
    title: "Bonding",
    rows: [
      {
        label: "State Bond Required",
        getCell: (s) => ({
          content: <YesNoGood yes={s.stateBondRequired} goodWhen="no" />,
          tone: "none",
        }),
      },
      {
        label: "Bond Amount",
        getCell: (s) => ({
          content: s.stateBondAmount || (s.stateBondRequired ? "Varies" : "N/A"),
          tone: !s.stateBondRequired ? "good" : "neutral",
        }),
      },
    ],
  },
  {
    title: "Union",
    rows: [
      {
        label: "Ironworkers Local(s)",
        getCell: (s) => ({
          content: s.ironworkersLocals.length ? (
            <ul className="space-y-1.5">
              {s.ironworkersLocals.map((local) => (
                <li key={local.number} className="text-[11px] leading-tight">
                  <div className="text-text-primary font-semibold">
                    Local {local.number}
                  </div>
                  <div className="text-text-muted">
                    {local.city}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            "None"
          ),
          tone: s.ironworkersLocals.length > 1 ? "good" : "neutral",
        }),
      },
      {
        label: "District Council",
        getCell: (s) => ({
          content: s.districtCouncil || "—",
          tone: "neutral",
        }),
      },
    ],
  },
  {
    title: "Certifications",
    rows: [
      {
        label: "State Cert Program",
        getCell: (s) => ({
          content: s.stateCertProgram || "—",
          tone: "neutral",
        }),
      },
      {
        label: "Programs Available",
        getCell: (s) => ({
          content: s.stateCertCategories || "—",
          tone: s.stateCertCategories ? "good" : "neutral",
        }),
      },
    ],
  },
  {
    title: "Tax Highlights",
    rows: [
      {
        label: "No Income Tax?",
        getCell: (s) => ({
          content: <YesNoGood yes={!s.hasIncomeTax} goodWhen="yes" />,
          tone: "none",
        }),
      },
      {
        label: "No Sales Tax?",
        getCell: (s) => ({
          content: <YesNoGood yes={!s.hasSalesTax} goodWhen="yes" />,
          tone: "none",
        }),
      },
    ],
  },
];

function toneClass(tone: CellTone | undefined): string {
  switch (tone) {
    case "good":
      return "text-neon-green";
    case "bad":
      return "text-neon-red";
    case "neutral":
      return "text-text-primary";
    default:
      return "text-text-primary";
  }
}

export function ComparisonTable({ stateCodes }: ComparisonTableProps) {
  const states = stateCodes
    .map((c) => STATE_REGISTRY[c])
    .filter((s): s is StateData => !!s);

  if (states.length < 2) {
    return (
      <div className="bg-cyber-dark border border-cyber-border rounded-xl p-10 text-center">
        <Minus className="w-6 h-6 text-text-muted mx-auto mb-3" />
        <div className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Select at least 2 states to compare
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono comparison-table">
          <thead>
            <tr className="border-b border-cyber-border bg-cyber-surface/40">
              <th className="text-left px-5 py-4 w-[240px] min-w-[200px]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Attribute
                </span>
              </th>
              {states.map((s) => (
                <th
                  key={s.code}
                  className="text-left px-5 py-4 min-w-[220px] border-l border-cyber-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.emoji}</span>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        {s.code}
                      </div>
                      <div className="text-sm font-mono font-bold text-neon-cyan text-glow-cyan">
                        {s.name}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => (
              <Fragment key={section.title}>
                {/* Section header */}
                <tr className="bg-cyber-darker border-y border-cyber-border">
                  <td
                    colSpan={states.length + 1}
                    className="px-5 py-2.5 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-neon-cyan"
                  >
                    ▸ {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr
                    key={`${section.title}-${row.label}`}
                    className="border-b border-cyber-border/40 hover:bg-cyber-surface/20 transition-colors"
                  >
                    <td className="px-5 py-3 text-[11px] uppercase tracking-wider text-text-secondary align-top">
                      {row.label}
                    </td>
                    {states.map((s) => {
                      const cell = row.getCell(s);
                      return (
                        <td
                          key={s.code}
                          className={`px-5 py-3 border-l border-cyber-border/40 align-top ${toneClass(cell.tone)}`}
                        >
                          <div className="text-xs leading-relaxed">
                            {cell.content}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;
