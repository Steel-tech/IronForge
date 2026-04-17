"use client";

import { ExternalLink, MapPin, Shield, Building2 } from "lucide-react";
import {
  PROJECT_TYPE_LABELS,
  type GeneralContractor,
} from "@/content/gc-directory";

interface GcCardProps {
  gc: GeneralContractor;
  userState?: string | null;
}

const SIZE_COLORS: Record<GeneralContractor["size"], string> = {
  national: "border-neon-cyan/40 text-neon-cyan",
  regional: "border-neon-magenta/40 text-neon-magenta",
  local: "border-neon-amber/40 text-neon-amber",
};

export function GcCard({ gc, userState }: GcCardProps) {
  const matchesUser = !!userState && gc.states.includes(userState);

  return (
    <article
      className={`group relative flex flex-col rounded-lg border bg-cyber-dark/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] ${
        matchesUser
          ? "border-neon-cyan/60 shadow-[0_0_18px_rgba(0,240,255,0.15)]"
          : "border-cyber-border hover:border-neon-cyan/40"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/0 to-transparent group-hover:via-neon-cyan/60 transition-all duration-300" />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-sm font-semibold text-text-primary group-hover:text-neon-cyan transition-colors">
            {gc.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-text-secondary">
            <MapPin className="h-3 w-3 text-neon-cyan/60" /> {gc.hq}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={`rounded border bg-cyber-surface/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${SIZE_COLORS[gc.size]}`}
          >
            {gc.size}
          </span>
          {matchesUser && (
            <span className="rounded border border-neon-cyan/50 bg-neon-cyan/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-neon-cyan">
              YOUR STATE
            </span>
          )}
        </div>
      </header>

      <p className="mt-3 text-[12px] text-text-secondary font-mono leading-relaxed line-clamp-3">
        {gc.description}
      </p>

      {/* Project type badges */}
      <div className="mt-3 flex flex-wrap gap-1">
        {gc.projectTypes.slice(0, 6).map((t) => (
          <span
            key={t}
            className="rounded border border-cyber-border bg-cyber-surface/60 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-text-secondary"
          >
            {PROJECT_TYPE_LABELS[t]}
          </span>
        ))}
        {gc.projectTypes.length > 6 && (
          <span className="font-mono text-[9px] text-text-muted">
            +{gc.projectTypes.length - 6}
          </span>
        )}
      </div>

      {/* Meta flags */}
      <div className="mt-3 flex flex-wrap gap-3 border-t border-cyber-border/50 pt-3 font-mono text-[10px] text-text-secondary">
        {gc.unionPreferred && (
          <span className="inline-flex items-center gap-1 text-neon-magenta">
            <Shield className="h-3 w-3" /> Union preferred
          </span>
        )}
        {gc.prequalRequired && (
          <span className="inline-flex items-center gap-1 text-neon-amber">
            <Building2 className="h-3 w-3" /> Prequal required
          </span>
        )}
      </div>

      {/* State chips (only show a summary when national) */}
      {gc.size !== "national" && (
        <div className="mt-3 flex flex-wrap gap-1">
          {gc.states.map((s) => (
            <span
              key={s}
              className={`rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-wider ${
                userState === s
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-cyber-border bg-cyber-surface/60 text-text-secondary"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {gc.size === "national" && (
        <div className="mt-3 font-mono text-[10px] text-text-muted">
          Active in all 50 states
        </div>
      )}

      {/* Links */}
      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-4 font-mono text-[11px]">
        <a
          href={gc.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-1 text-neon-cyan transition-colors hover:bg-neon-cyan/10"
        >
          <ExternalLink className="h-3 w-3" /> Website
        </a>
        {gc.subcontractorPortalUrl && (
          <a
            href={gc.subcontractorPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded border border-cyber-border bg-cyber-surface/50 px-2 py-1 text-text-secondary transition-colors hover:border-neon-magenta/50 hover:text-neon-magenta"
          >
            <ExternalLink className="h-3 w-3" /> Sub portal
          </a>
        )}
      </footer>
    </article>
  );
}
