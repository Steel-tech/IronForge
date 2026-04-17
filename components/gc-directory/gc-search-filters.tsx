"use client";

import { Search, X } from "lucide-react";
import {
  ALL_PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  type ProjectType,
  type GcSize,
} from "@/content/gc-directory";
import { STATE_REGISTRY } from "@/content/state-registry";

export interface GcFilters {
  search: string;
  state: string | "";
  projectType: ProjectType | "";
  size: GcSize | "";
  unionPreferredOnly: boolean;
}

export const DEFAULT_GC_FILTERS: GcFilters = {
  search: "",
  state: "",
  projectType: "",
  size: "",
  unionPreferredOnly: false,
};

interface GcSearchFiltersProps {
  filters: GcFilters;
  onChange: (next: GcFilters) => void;
  resultCount: number;
}

const STATES = Object.values(STATE_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name),
);

const SIZES: { value: GcSize; label: string }[] = [
  { value: "national", label: "National" },
  { value: "regional", label: "Regional" },
  { value: "local", label: "Local" },
];

export function GcSearchFilters({
  filters,
  onChange,
  resultCount,
}: GcSearchFiltersProps) {
  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.state) {
    activeChips.push({
      label: `State: ${filters.state}`,
      clear: () => onChange({ ...filters, state: "" }),
    });
  }
  if (filters.projectType) {
    activeChips.push({
      label: `Type: ${PROJECT_TYPE_LABELS[filters.projectType]}`,
      clear: () => onChange({ ...filters, projectType: "" }),
    });
  }
  if (filters.size) {
    activeChips.push({
      label: `Size: ${filters.size}`,
      clear: () => onChange({ ...filters, size: "" }),
    });
  }
  if (filters.unionPreferredOnly) {
    activeChips.push({
      label: "Union preferred",
      clear: () => onChange({ ...filters, unionPreferredOnly: false }),
    });
  }

  return (
    <div className="rounded-lg border border-cyber-border bg-cyber-dark/50 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search GCs by name..."
            className="w-full rounded border border-cyber-border bg-cyber-dark px-8 py-2 font-mono text-xs text-text-primary placeholder-text-muted cyber-focus"
          />
        </div>

        {/* State */}
        <select
          value={filters.state}
          onChange={(e) => onChange({ ...filters, state: e.target.value })}
          className="rounded border border-cyber-border bg-cyber-dark px-3 py-2 font-mono text-xs text-text-primary cyber-focus appearance-none cursor-pointer"
        >
          <option value="">All states</option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>

        {/* Project Type */}
        <select
          value={filters.projectType}
          onChange={(e) =>
            onChange({
              ...filters,
              projectType: e.target.value as ProjectType | "",
            })
          }
          className="rounded border border-cyber-border bg-cyber-dark px-3 py-2 font-mono text-xs text-text-primary cyber-focus appearance-none cursor-pointer"
        >
          <option value="">All project types</option>
          {ALL_PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {PROJECT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>

        {/* Size */}
        <select
          value={filters.size}
          onChange={(e) =>
            onChange({ ...filters, size: e.target.value as GcSize | "" })
          }
          className="rounded border border-cyber-border bg-cyber-dark px-3 py-2 font-mono text-xs text-text-primary cyber-focus appearance-none cursor-pointer"
        >
          <option value="">Any size</option>
          {SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Union */}
        <label className="flex cursor-pointer items-center gap-2 rounded border border-cyber-border bg-cyber-surface/60 px-3 py-2 font-mono text-[11px] text-text-secondary transition-colors hover:border-neon-cyan/30">
          <input
            type="checkbox"
            checked={filters.unionPreferredOnly}
            onChange={(e) =>
              onChange({ ...filters, unionPreferredOnly: e.target.checked })
            }
            className="h-3 w-3 accent-[var(--color-neon-cyan)]"
          />
          Union only
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          {resultCount} match{resultCount === 1 ? "" : "es"}
        </span>
        {activeChips.map((chip) => (
          <button
            key={chip.label}
            onClick={chip.clear}
            className="inline-flex items-center gap-1 rounded border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-0.5 font-mono text-[10px] text-neon-cyan transition-colors hover:bg-neon-cyan/20"
          >
            {chip.label} <X className="h-3 w-3" />
          </button>
        ))}
        {activeChips.length > 0 || filters.search ? (
          <button
            onClick={() => onChange(DEFAULT_GC_FILTERS)}
            className="ml-auto font-mono text-[10px] uppercase tracking-wider text-text-muted transition-colors hover:text-neon-cyan"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}
