"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { STATE_REGISTRY, type StateData } from "@/content/state-registry";
import { Sparkles, TrendingUp, TrendingDown, Award } from "lucide-react";

interface ComparisonSummaryProps {
  stateCodes: string[];
}

interface Analysis {
  observations: string[];
  superlatives: { label: string; state: StateData; reason: string }[];
  pros: Record<string, string[]>; // state code -> pros
  cons: Record<string, string[]>; // state code -> cons
}

function startupCost(s: StateData): { min: number; max: number } {
  const min = s.llcFilingFee + (s.hasStateLicense ? s.licensingFee.min : 0);
  const max =
    s.llcFilingFee +
    s.annualReportFee +
    (s.hasStateLicense ? s.licensingFee.max : 0);
  return { min, max };
}

function fmt(n: number): string {
  return `$${n.toLocaleString()}`;
}

function analyze(states: StateData[]): Analysis {
  const obs: string[] = [];
  const pros: Record<string, string[]> = {};
  const cons: Record<string, string[]> = {};
  const sup: Analysis["superlatives"] = [];

  for (const s of states) {
    pros[s.code] = [];
    cons[s.code] = [];
  }

  // Startup cost (min only for clean comparison)
  const costs = states.map((s) => ({ s, cost: startupCost(s) }));
  const minCost = costs.reduce((a, b) => (a.cost.min < b.cost.min ? a : b));
  const maxCost = costs.reduce((a, b) => (a.cost.max > b.cost.max ? a : b));

  obs.push(
    `${minCost.s.name} has the lowest startup cost at approximately ${fmt(minCost.cost.min)} (LLC + license fees).`,
  );
  if (minCost.s.code !== maxCost.s.code) {
    obs.push(
      `${maxCost.s.name} has the highest potential startup cost at up to ${fmt(maxCost.cost.max)}.`,
    );
  }
  sup.push({
    label: "Lowest Startup Cost",
    state: minCost.s,
    reason: `~${fmt(minCost.cost.min)} to get started`,
  });
  pros[minCost.s.code].push(
    `Lowest startup cost among compared states (~${fmt(minCost.cost.min)})`,
  );
  if (minCost.s.code !== maxCost.s.code) {
    cons[maxCost.s.code].push(
      `Highest startup cost of compared states (~up to ${fmt(maxCost.cost.max)})`,
    );
  }

  // Income tax
  const noIncomeTaxStates = states.filter((s) => !s.hasIncomeTax);
  if (noIncomeTaxStates.length > 0) {
    obs.push(
      `${noIncomeTaxStates
        .map((s) => s.name)
        .join(
          " and ",
        )} ${noIncomeTaxStates.length === 1 ? "has" : "have"} no state income tax — significant savings on personal and pass-through income.`,
    );
    for (const s of noIncomeTaxStates) {
      pros[s.code].push("No state income tax");
    }
  }
  const highIncomeTaxStates = states.filter(
    (s) =>
      s.hasIncomeTax &&
      (s.incomeTaxRate.includes("13") ||
        s.incomeTaxRate.includes("11") ||
        s.incomeTaxRate.includes("10")),
  );
  for (const s of highIncomeTaxStates) {
    cons[s.code].push(`High income tax (${s.incomeTaxRate})`);
  }

  // Sales tax
  const noSalesTax = states.filter((s) => !s.hasSalesTax);
  if (noSalesTax.length > 0) {
    obs.push(
      `${noSalesTax.map((s) => s.name).join(" and ")} ${noSalesTax.length === 1 ? "has" : "have"} no state sales tax — reduces cost of materials and supplies.`,
    );
    for (const s of noSalesTax) {
      pros[s.code].push("No state sales tax");
    }
  }

  // Licensing
  const licensedStates = states.filter((s) => s.hasStateLicense);
  const unlicensedStates = states.filter((s) => !s.hasStateLicense);
  if (licensedStates.length > 0 && unlicensedStates.length > 0) {
    obs.push(
      `${licensedStates.map((s) => s.name).join(", ")} require${licensedStates.length === 1 ? "s" : ""} a state contractor license; ${unlicensedStates.map((s) => s.name).join(" and ")} ${unlicensedStates.length === 1 ? "does" : "do"} not (licensing handled locally).`,
    );
  }
  for (const s of licensedStates) {
    cons[s.code].push(
      `State contractor license required${s.examRequired ? " (exam)" : ""}`,
    );
  }
  for (const s of unlicensedStates) {
    pros[s.code].push("No state-level contractor license required");
  }

  // Workers' comp
  const monoStates = states.filter((s) => s.wcType === "monopolistic");
  for (const s of monoStates) {
    obs.push(
      `${s.name} has monopolistic workers' comp — you MUST use the state fund (${s.wcAgency || "state fund"}). No private market.`,
    );
    cons[s.code].push("Monopolistic workers' comp — no private carrier option");
  }
  const privateStates = states.filter((s) => s.wcType === "private");
  for (const s of privateStates) {
    pros[s.code].push("Open private workers' comp market");
  }

  // Bonding
  const bondRequired = states.filter((s) => s.stateBondRequired);
  const noBond = states.filter((s) => !s.stateBondRequired);
  if (bondRequired.length > 0 && noBond.length > 0) {
    obs.push(
      `${bondRequired.map((s) => s.name).join(", ")} require${bondRequired.length === 1 ? "s" : ""} a state contractor bond; ${noBond.map((s) => s.name).join(" and ")} ${noBond.length === 1 ? "does" : "do"} not.`,
    );
  }
  for (const s of bondRequired) {
    cons[s.code].push("State contractor bond required");
  }
  for (const s of noBond) {
    pros[s.code].push("No state contractor bond required");
  }

  // Prevailing wage
  const pwStates = states.filter((s) => s.hasStatePrevailingWage);
  for (const s of pwStates) {
    obs.push(
      `${s.name} enforces state prevailing wage (threshold: ${s.prevailingWageThreshold || "varies"}) — good for union wages on public projects.`,
    );
    pros[s.code].push("State prevailing wage law favors union rates");
  }

  // Union coverage
  const unionStates = states
    .map((s) => ({ s, count: s.ironworkersLocals.length }))
    .filter((x) => x.count > 0);
  if (unionStates.length > 0) {
    const best = unionStates.reduce((a, b) => (a.count > b.count ? a : b));
    if (best.count > 1) {
      sup.push({
        label: "Best Union Coverage",
        state: best.s,
        reason: `${best.count} ironworkers locals`,
      });
      pros[best.s.code].push(
        `${best.count} ironworkers locals across the state`,
      );
    } else {
      sup.push({
        label: "Union Coverage",
        state: best.s,
        reason: `${best.count} ironworkers local`,
      });
    }
  }

  // Business-friendly superlative (low cost + few regulations)
  const friendlinessScores = states.map((s) => {
    let score = 0;
    if (!s.hasIncomeTax) score += 3;
    if (!s.hasSalesTax) score += 2;
    if (!s.hasStateLicense) score += 2;
    if (!s.stateBondRequired) score += 1;
    if (s.llcFilingFee < 100) score += 1;
    if (s.annualReportFee < 50) score += 1;
    if (s.wcType === "private") score += 1;
    return { s, score };
  });
  const friendliest = friendlinessScores.reduce((a, b) =>
    a.score > b.score ? a : b,
  );
  sup.push({
    label: "Most Business-Friendly",
    state: friendliest.s,
    reason: `Lowest regulatory + tax burden (score ${friendliest.score})`,
  });

  return { observations: obs, superlatives: sup, pros, cons };
}

export function ComparisonSummary({ stateCodes }: ComparisonSummaryProps) {
  const states = stateCodes
    .map((c) => STATE_REGISTRY[c])
    .filter((s): s is StateData => !!s);

  if (states.length < 2) return null;

  const analysis = analyze(states);

  return (
    <div className="space-y-6">
      {/* Superlatives / Best-For Tags */}
      <div className="bg-cyber-dark border border-cyber-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-amber/40 to-transparent" />
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-neon-amber" />
          <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
            Best For...
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.superlatives.map((sup, i) => (
            <div
              key={`${sup.label}-${i}`}
              className="bg-cyber-surface/60 border border-neon-amber/20 rounded-lg px-4 py-3 hover:border-neon-amber/40 transition-colors"
            >
              <div className="text-[9px] font-mono uppercase tracking-widest text-neon-amber mb-1">
                {sup.label}
              </div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xl">{sup.state.emoji}</span>
                <span className="text-sm font-mono font-bold text-text-primary">
                  {sup.state.name}
                </span>
              </div>
              <div className="text-[10px] font-mono text-text-muted">
                {sup.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Observations */}
      <div className="bg-cyber-dark border border-cyber-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
            Analysis
          </h2>
        </div>
        <ul className="space-y-2">
          {analysis.observations.map((obs, i) => (
            <li
              key={i}
              className="text-xs font-mono text-text-secondary leading-relaxed flex items-start gap-2"
            >
              <span className="text-neon-cyan mt-0.5">▸</span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pros / Cons Grid */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          states.length === 2
            ? "md:grid-cols-2"
            : states.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-1"
        }`}
      >
        {states.map((s) => {
          const pros = analysis.pros[s.code] ?? [];
          const cons = analysis.cons[s.code] ?? [];
          return (
            <div
              key={s.code}
              className="bg-cyber-dark border border-cyber-border rounded-xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                    {s.code}
                  </div>
                  <div className="text-sm font-mono font-bold text-neon-cyan text-glow-cyan">
                    {s.name}
                  </div>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neon-green">
                    Pros
                  </span>
                </div>
                {pros.length === 0 ? (
                  <div className="text-[10px] font-mono text-text-muted italic pl-5">
                    No standout advantages
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {pros.map((p, i) => (
                      <li
                        key={i}
                        className="text-[11px] font-mono text-text-secondary flex items-start gap-1.5"
                      >
                        <span className="text-neon-green">+</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Cons */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown className="w-3.5 h-3.5 text-neon-red" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neon-red">
                    Cons
                  </span>
                </div>
                {cons.length === 0 ? (
                  <div className="text-[10px] font-mono text-text-muted italic pl-5">
                    No major drawbacks
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {cons.map((c, i) => (
                      <li
                        key={i}
                        className="text-[11px] font-mono text-text-secondary flex items-start gap-1.5"
                      >
                        <span className="text-neon-red">−</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ComparisonSummary;
