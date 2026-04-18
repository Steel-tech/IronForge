"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { formatCurrency, formatCurrencyPrecise } from "@/lib/estimator/calculate";
import type { EstimateInput, EstimateResult } from "@/lib/types/estimator";
import { STATE_REGISTRY } from "@/content/state-registry";

interface Props {
  input: EstimateInput;
  result: EstimateResult;
}

export function EstimateResults({ input, result }: Props) {
  const { labor, materials, equipment, overhead, summary } = result;
  const stateName = input.state
    ? STATE_REGISTRY[input.state]?.name || input.state
    : "—";

  // Slice percentages for the stacked bar.
  const total = Math.max(1, summary.directCosts + summary.totalOverhead);
  const pctLabor = (labor.totalLabor / total) * 100;
  const pctMaterials = (materials.totalMaterials / total) * 100;
  const pctEquipment = (equipment.totalEquipment / total) * 100;
  const pctOverhead = (overhead.totalOverhead / total) * 100;

  return (
    <div className="space-y-6">
      {/* ═══════════ HEADER / TOTAL BID ═══════════ */}
      <section className="relative cyber-card rounded-lg p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-magenta/5 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase mb-2">
              // Total Bid Estimate
            </div>
            <div className="font-mono font-bold text-text-primary tracking-tight">
              <span className="text-5xl md:text-6xl text-neon-cyan text-glow-cyan">
                {formatCurrency(summary.totalBid)}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono text-text-secondary">
              {input.projectName || "Untitled Project"} • {stateName} •{" "}
              {input.projectType}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-right">
            <Metric
              label="Cost / Ton"
              value={
                summary.costPerTon > 0
                  ? formatCurrency(summary.costPerTon)
                  : "—"
              }
              color="cyan"
            />
            <Metric
              label="Cost / Sqft"
              value={
                summary.costPerSqft > 0
                  ? formatCurrencyPrecise(summary.costPerSqft)
                  : "—"
              }
              color="green"
            />
          </div>
        </div>

        {/* Stacked bar breakdown */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted uppercase tracking-wider">
            <span>Cost Distribution</span>
            <span>100%</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden border border-cyber-border bg-cyber-dark">
            <Bar width={pctLabor} color="bg-neon-cyan" glow="shadow-[0_0_12px_#00f0ff55]" />
            <Bar width={pctMaterials} color="bg-neon-green" glow="shadow-[0_0_12px_#00ff4155]" />
            <Bar width={pctEquipment} color="bg-neon-amber" glow="shadow-[0_0_12px_#ffaa0055]" />
            <Bar width={pctOverhead} color="bg-neon-magenta" glow="shadow-[0_0_12px_#ff00aa55]" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono">
            <Legend color="bg-neon-cyan" label="Labor" pct={pctLabor} />
            <Legend color="bg-neon-green" label="Materials" pct={pctMaterials} />
            <Legend color="bg-neon-amber" label="Equipment" pct={pctEquipment} />
            <Legend color="bg-neon-magenta" label="Overhead" pct={pctOverhead} />
          </div>
        </div>
      </section>

      {/* ═══════════ BREAKDOWNS ═══════════ */}
      <div className="grid md:grid-cols-2 gap-6">
        <BreakdownCard title="Labor" accent="cyan" total={labor.totalLabor}>
          <Line label="Straight-time hours" value={labor.straightTimeHours.toFixed(0)} />
          <Line label="Overtime hours (10%)" value={labor.overtimeHours.toFixed(0)} />
          <Line label="Journeyman wages" value={formatCurrency(labor.journeymanCost)} />
          <Line label="Foreman wages" value={formatCurrency(labor.foremanCost)} />
          <Line label="Burden (taxes, WC, benefits)" value={formatCurrency(labor.burdenRate)} />
        </BreakdownCard>

        <BreakdownCard title="Materials" accent="green" total={materials.totalMaterials}>
          <Line label="Bolts & connections" value={formatCurrency(materials.boltsConnections)} />
          <Line
            label="Welding consumables"
            value={formatCurrency(materials.weldingConsumables)}
          />
          <Line
            label="Decking material"
            value={formatCurrency(materials.deckingMaterial)}
          />
          <Line label="Miscellaneous" value={formatCurrency(materials.miscMaterials)} />
        </BreakdownCard>

        <BreakdownCard title="Equipment" accent="amber" total={equipment.totalEquipment}>
          <Line label="Crane rental" value={formatCurrency(equipment.craneCost)} />
          <Line label="Man-lift" value={formatCurrency(equipment.liftCost)} />
          <Line label="Welding equipment" value={formatCurrency(equipment.weldingEquipCost)} />
          <Line
            label="Small tools (2%)"
            value={formatCurrency(equipment.smallToolsAllowance)}
          />
        </BreakdownCard>

        <BreakdownCard title="Overhead" accent="magenta" total={overhead.totalOverhead}>
          <Line
            label="General conditions (8%)"
            value={formatCurrency(overhead.generalConditions)}
          />
          <Line label="Insurance (GL + WC)" value={formatCurrency(overhead.insurance)} />
          <Line label="Bonding (~2.5%)" value={formatCurrency(overhead.bonding)} />
        </BreakdownCard>
      </div>

      {/* ═══════════ FINAL MATH ═══════════ */}
      <section className="cyber-card rounded-lg p-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
        <h3 className="text-sm font-mono font-bold tracking-[0.2em] uppercase text-neon-cyan pb-3 mb-3 border-b border-cyber-border">
          ▸ Bid Composition
        </h3>
        <div className="space-y-2 font-mono text-sm">
          <MathLine label="Direct costs" value={formatCurrency(summary.directCosts)} />
          <MathLine label="+ Overhead" value={formatCurrency(summary.totalOverhead)} />
          <MathLine label="= Subtotal" value={formatCurrency(summary.subtotal)} bold />
          <MathLine label="+ Profit (10%)" value={formatCurrency(summary.profit)} />
          <MathLine label="+ Contingency (5%)" value={formatCurrency(summary.contingency)} />
          <div className="pt-3 border-t border-cyber-border flex items-center justify-between">
            <span className="text-text-secondary uppercase tracking-wider text-xs">
              Total Bid
            </span>
            <span className="text-neon-cyan text-glow-cyan font-bold text-xl">
              {formatCurrency(summary.totalBid)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════ PRIMITIVES ═══════════ */

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "cyan" | "green";
}) {
  return (
    <div>
      <div className="text-[10px] font-mono text-text-muted tracking-wider uppercase">
        {label}
      </div>
      <div
        className={`font-mono font-bold text-lg ${
          color === "cyan"
            ? "text-neon-cyan text-glow-cyan"
            : "text-neon-green text-glow-green"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Bar({
  width,
  color,
  glow,
}: {
  width: number;
  color: string;
  glow: string;
}) {
  if (width <= 0) return null;
  return (
    <div
      style={{ width: `${width}%` }}
      className={`${color} ${glow} transition-all`}
    />
  );
}

function Legend({
  color,
  label,
  pct,
}: {
  color: string;
  label: string;
  pct: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-muted">{pct.toFixed(1)}%</span>
    </div>
  );
}

function BreakdownCard({
  title,
  accent,
  total,
  children,
}: {
  title: string;
  accent: "cyan" | "green" | "amber" | "magenta";
  total: number;
  children: React.ReactNode;
}) {
  const accentClass =
    accent === "cyan"
      ? "text-neon-cyan text-glow-cyan border-neon-cyan/30"
      : accent === "green"
        ? "text-neon-green text-glow-green border-neon-green/30"
        : accent === "amber"
          ? "text-neon-amber text-glow-amber border-neon-amber/30"
          : "text-neon-magenta text-glow-magenta border-neon-magenta/30";

  const topBar =
    accent === "cyan"
      ? "via-neon-cyan"
      : accent === "green"
        ? "via-neon-green"
        : accent === "amber"
          ? "via-neon-amber"
          : "via-neon-magenta";

  return (
    <section className="cyber-card rounded-lg p-5 relative">
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${topBar}`}
      />
      <div className={`flex items-baseline justify-between pb-3 mb-3 border-b ${accentClass}`}>
        <h4 className={`text-xs font-mono font-bold tracking-[0.2em] uppercase ${accentClass}`}>
          ▸ {title}
        </h4>
        <span className={`font-mono font-bold text-sm ${accentClass}`}>
          {formatCurrency(total)}
        </span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between text-xs font-mono">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

function MathLine({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-text-secondary ${
          bold ? "font-bold text-text-primary" : ""
        }`}
      >
        {label}
      </span>
      <span
        className={`${
          bold ? "font-bold text-text-primary" : "text-text-secondary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
