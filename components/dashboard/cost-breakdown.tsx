"use client";

import Link from "next/link";
import { DollarSign } from "lucide-react";

export interface CostRow {
  phaseId: string;
  phaseTitle: string;
  min: number;
  max: number;
  stepsCount: number;
  visitedSteps: number;
  firstStepId: string;
}

interface CostBreakdownProps {
  rows: CostRow[];
}

function fmt(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${n.toLocaleString()}`;
}

function statusLabel(visited: number, total: number): {
  text: string;
  color: string;
} {
  if (total === 0) return { text: "—", color: "text-text-muted" };
  if (visited === 0) return { text: "PENDING", color: "text-text-muted" };
  if (visited >= total) return { text: "COMPLETE", color: "text-neon-green" };
  return { text: "IN PROGRESS", color: "text-neon-amber" };
}

export function CostBreakdown({ rows }: CostBreakdownProps) {
  const totalMin = rows.reduce((sum, r) => sum + r.min, 0);
  const totalMax = rows.reduce((sum, r) => sum + r.max, 0);

  return (
    <div className="bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      {/* Header */}
      <div className="px-5 py-4 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-neon-green" />
          <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
            Cost Breakdown
          </h2>
        </div>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
          Estimated Startup Investment
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-text-muted border-b border-cyber-border/60">
              <th className="text-left px-5 py-2.5 font-medium">Phase</th>
              <th className="text-right px-3 py-2.5 font-medium">Min</th>
              <th className="text-right px-3 py-2.5 font-medium">Max</th>
              <th className="text-right px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            {rows.map((row, i) => {
              const status = statusLabel(row.visitedSteps, row.stepsCount);
              return (
                <tr
                  key={row.phaseId}
                  className="hover:bg-cyber-surface/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/wizard/${row.phaseId}/${row.firstStepId}`}
                      className="text-text-secondary hover:text-neon-cyan transition-colors flex items-center gap-2"
                    >
                      <span className="text-neon-cyan/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{row.phaseTitle}</span>
                    </Link>
                  </td>
                  <td className="text-right px-3 py-3 text-neon-cyan tabular-nums">
                    {fmt(row.min)}
                  </td>
                  <td className="text-right px-3 py-3 text-neon-cyan tabular-nums">
                    {fmt(row.max)}
                  </td>
                  <td
                    className={`text-right px-5 py-3 text-[10px] tracking-wider ${status.color}`}
                  >
                    {status.text}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-neon-cyan/20 bg-cyber-surface/40">
              <td className="px-5 py-3.5 text-[11px] uppercase tracking-widest text-text-primary font-semibold">
                Total Estimate
              </td>
              <td className="text-right px-3 py-3.5 text-neon-green text-glow-green tabular-nums font-semibold">
                {fmt(totalMin)}
              </td>
              <td className="text-right px-3 py-3.5 text-neon-green text-glow-green tabular-nums font-semibold">
                {fmt(totalMax)}
              </td>
              <td className="text-right px-5 py-3.5 text-[10px] text-text-muted tracking-wider">
                RANGE
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="px-5 py-2.5 text-[10px] font-mono text-text-muted border-t border-cyber-border/60 bg-cyber-darker/40">
        Estimates sourced from state registry + phase content. Actual costs
        vary by project and region.
      </div>
    </div>
  );
}

export default CostBreakdown;
