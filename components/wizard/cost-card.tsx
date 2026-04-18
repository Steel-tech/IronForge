"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface CostCardProps {
  icon: string;
  label: string;
  value: string;
  note?: string;
}

export function CostCard({ icon, label, value, note }: CostCardProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(34, 211, 238, 0.18)"
      radius={280}
      className="relative bg-cyber-dark border border-cyber-border rounded-xl p-4 transition-all hover:border-neon-cyan/20"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="flex items-center gap-2 text-xs text-text-muted font-mono mb-1.5 uppercase tracking-wider">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-lg font-mono font-bold text-neon-cyan text-glow-cyan">
        {value}
      </div>
      {note && (
        <div className="text-[11px] text-text-muted font-mono mt-1.5">
          {note}
        </div>
      )}
    </SpotlightCard>
  );
}
