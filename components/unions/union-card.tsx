"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { ExternalLink, MapPin, Phone } from "lucide-react";
import type { OrganizedLocal } from "@/lib/unions/union-data";

interface UnionCardProps {
  local: OrganizedLocal;
  /** When true, highlight as matching the user's selected state. */
  highlighted?: boolean;
}

export function UnionCard({ local, highlighted }: UnionCardProps) {
  return (
    <article
      className={`group relative rounded-lg border bg-cyber-dark/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] ${
        highlighted
          ? "border-neon-cyan/60 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          : "border-cyber-border hover:border-neon-cyan/40"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/0 to-transparent group-hover:via-neon-cyan/60 transition-all duration-300" />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan/70">
            Local {local.number || "—"}
          </div>
          <h3 className="mt-1 truncate font-mono text-sm font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
            {local.name}
          </h3>
          {local.city && (
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-text-secondary font-mono">
              <MapPin className="h-3 w-3 text-neon-cyan/60" /> {local.city}
            </div>
          )}
        </div>
        {highlighted && (
          <span className="shrink-0 rounded border border-neon-cyan/50 bg-neon-cyan/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-neon-cyan">
            YOUR STATE
          </span>
        )}
      </header>

      {local.jurisdiction && (
        <p className="mt-3 text-[11px] text-text-secondary font-mono leading-relaxed">
          <span className="text-text-muted">Jurisdiction: </span>
          {local.jurisdiction}
        </p>
      )}

      {local.districtCouncil && (
        <p className="mt-1.5 text-[11px] text-text-secondary font-mono leading-relaxed">
          <span className="text-text-muted">District Council: </span>
          {local.districtCouncil}
        </p>
      )}

      {local.states.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {local.states.map((s) => (
            <span
              key={s}
              className="rounded border border-cyber-border bg-cyber-surface/60 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-text-secondary"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-cyber-border/50 pt-3 text-[11px] font-mono">
        {local.phone && (
          <a
            href={`tel:${local.phone.replace(/[^+\d]/g, "")}`}
            className="inline-flex items-center gap-1 rounded border border-cyber-border bg-cyber-surface/50 px-2 py-1 text-text-secondary transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <Phone className="h-3 w-3" /> {local.phone}
          </a>
        )}
        {local.url && (
          <a
            href={local.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-1 text-neon-cyan transition-colors hover:bg-neon-cyan/10"
          >
            <ExternalLink className="h-3 w-3" /> Website
          </a>
        )}
      </footer>
    </article>
  );
}
