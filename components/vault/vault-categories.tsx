"use client";

import {
  CATEGORY_LABELS,
  type VaultCategory,
  type VaultDocument,
} from "@/lib/types/vault";
import {
  Archive,
  Building2,
  FileCheck2,
  FileText,
  Scale,
  Shield,
  Stamp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<VaultCategory | "all", LucideIcon> = {
  all: Archive,
  formation: Building2,
  licensing: Stamp,
  bonding: Wallet,
  insurance: Shield,
  certifications: FileCheck2,
  union: Users,
  legal: Scale,
  other: FileText,
};

interface VaultCategoriesProps {
  documents: VaultDocument[];
  active: VaultCategory | "all";
  onChange: (cat: VaultCategory | "all") => void;
}

const ORDER: (VaultCategory | "all")[] = [
  "all",
  "formation",
  "licensing",
  "bonding",
  "insurance",
  "certifications",
  "union",
  "legal",
  "other",
];

export function VaultCategories({
  documents,
  active,
  onChange,
}: VaultCategoriesProps) {
  const counts: Record<string, number> = { all: documents.length };
  for (const d of documents) {
    counts[d.category] = (counts[d.category] ?? 0) + 1;
  }

  return (
    <nav className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
      {ORDER.map((key) => {
        const Icon = ICONS[key];
        const label = key === "all" ? "All" : CATEGORY_LABELS[key];
        const count = counts[key] ?? 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`group relative flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all ${
              isActive
                ? "border-neon-cyan/60 bg-neon-cyan/5 shadow-[0_0_18px_rgba(0,240,255,0.15)]"
                : "border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/40"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                isActive ? "text-neon-cyan" : "text-text-secondary"
              }`}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                isActive ? "text-neon-cyan" : "text-text-secondary"
              }`}
            >
              {label}
            </span>
            <span
              className={`rounded border px-1.5 font-mono text-[9px] ${
                isActive
                  ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                  : "border-cyber-border bg-cyber-surface/60 text-text-muted"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
