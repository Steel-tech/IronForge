"use client";

import { useMemo, useState } from "react";
import { TRUST_FUND_DEFAULTS } from "@/lib/unions/union-data";

interface TrustFundRow {
  key: keyof typeof TRUST_FUND_DEFAULTS;
  label: string;
  helper: string;
  typicalRange: string;
}

const ROWS: TrustFundRow[] = [
  {
    key: "baseWage",
    label: "Base journeyman wage",
    helper: "Hourly taxable wage before fringes.",
    typicalRange: "$30 – $55 /hr",
  },
  {
    key: "healthWelfare",
    label: "Health & Welfare",
    helper: "Medical/dental trust contribution.",
    typicalRange: "$12 – $18 /hr",
  },
  {
    key: "pension",
    label: "Pension",
    helper: "Defined-benefit pension fund.",
    typicalRange: "$8 – $15 /hr",
  },
  {
    key: "annuity",
    label: "Annuity / 401(k)",
    helper: "Defined-contribution retirement.",
    typicalRange: "$5 – $10 /hr",
  },
  {
    key: "training",
    label: "JATF / Training",
    helper: "Apprenticeship & upgrade training.",
    typicalRange: "$0.50 – $1.50 /hr",
  },
  {
    key: "other",
    label: "Other (vacation, LMCC, etc.)",
    helper: "Vacation savings, industry funds.",
    typicalRange: "$0 – $5 /hr",
  },
];

type Values = Record<keyof typeof TRUST_FUND_DEFAULTS, number>;

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function TrustFundCalculator() {
  const [values, setValues] = useState<Values>({ ...TRUST_FUND_DEFAULTS });

  const totals = useMemo(() => {
    const fringes =
      values.healthWelfare +
      values.pension +
      values.annuity +
      values.training +
      values.other;
    const totalHourly = values.baseWage + fringes;
    return {
      fringes,
      totalHourly,
      daily: totalHourly * 8,
      weekly: totalHourly * 40,
      monthly: totalHourly * 40 * 4.33,
    };
  }, [values]);

  return (
    <div className="rounded-lg border border-cyber-border bg-cyber-dark/60 p-5">
      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70">
          Payroll calculator
        </div>
        <h3 className="mt-1 font-mono text-lg font-semibold text-text-primary">
          TRUST FUND BURDEN{" "}
          <span className="text-neon-cyan text-glow-cyan">/ HOUR</span>
        </h3>
        <p className="mt-1 text-xs text-text-secondary font-mono leading-relaxed">
          What you&apos;ll owe per hour for every journeyman on your payroll.
          Adjust the inputs with numbers from your local&apos;s CBA.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {ROWS.map((row) => (
          <label
            key={row.key}
            className="block rounded border border-cyber-border bg-cyber-surface/40 p-3 transition-colors hover:border-neon-cyan/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-text-primary">
                {row.label}
              </span>
              <span className="font-mono text-[10px] text-text-muted">
                {row.typicalRange}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary font-mono">
              {row.helper}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-mono text-sm text-neon-cyan">$</span>
              <input
                type="number"
                min={0}
                step={0.25}
                value={Number.isFinite(values[row.key]) ? values[row.key] : 0}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [row.key]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full rounded border border-cyber-border bg-cyber-dark px-2 py-1.5 font-mono text-sm text-text-primary cyber-focus"
              />
              <span className="font-mono text-[10px] text-text-muted">/hr</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-neon-cyan/40 bg-neon-cyan/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Stat label="Fringes /hr" value={fmt(totals.fringes)} accent="amber" />
          <Stat
            label="Total /hr"
            value={fmt(totals.totalHourly)}
            accent="cyan"
            emphasize
          />
          <Stat label="Daily (8hr)" value={fmt(totals.daily)} accent="green" />
          <Stat label="Weekly (40hr)" value={fmt(totals.weekly)} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-neon-cyan/20 pt-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            Monthly (~173 hr)
          </span>
          <span className="font-mono text-lg font-semibold text-neon-cyan text-glow-cyan">
            {fmt(totals.monthly)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-text-muted font-mono leading-relaxed">
        Estimates only. Your local&apos;s trust fund schedule and CBA control
        the actual amounts owed. Defaults are rough industry midpoints.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  emphasize,
}: {
  label: string;
  value: string;
  accent?: "cyan" | "amber" | "green";
  emphasize?: boolean;
}) {
  const color =
    accent === "cyan"
      ? "text-neon-cyan text-glow-cyan"
      : accent === "amber"
        ? "text-neon-amber"
        : accent === "green"
          ? "text-neon-green"
          : "text-text-primary";
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </div>
      <div
        className={`mt-0.5 font-mono ${emphasize ? "text-xl" : "text-base"} font-semibold ${color}`}
      >
        {value}
      </div>
    </div>
  );
}
