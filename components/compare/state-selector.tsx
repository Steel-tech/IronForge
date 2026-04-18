"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useMemo, useState } from "react";
import { ChevronDown, Plus, X, Search } from "lucide-react";
import { STATE_REGISTRY } from "@/content/state-registry";

const ALL_STATES = Object.values(STATE_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name),
);

interface StateSelectorProps {
  selected: string[];
  onChange: (codes: string[]) => void;
  max?: number;
}

export function StateSelector({
  selected,
  onChange,
  max = 3,
}: StateSelectorProps) {
  // Which slot index is currently searching
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const slots = useMemo(() => {
    const arr: (string | null)[] = [...selected];
    while (arr.length < max) arr.push(null);
    return arr;
  }, [selected, max]);

  const filteredStates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_STATES.filter((s) => {
      if (selected.includes(s.code)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
    });
  }, [search, selected]);

  function pickState(slotIdx: number, code: string) {
    const next = [...selected];
    next[slotIdx] = code;
    // compact to remove any nulls/undefined and dedupe
    const cleaned = next.filter((c): c is string => !!c);
    onChange(cleaned);
    setOpenSlot(null);
    setSearch("");
  }

  function removeSlot(slotIdx: number) {
    const next = selected.filter((_, i) => i !== slotIdx);
    onChange(next);
  }

  function openSelector(slotIdx: number) {
    setOpenSlot(slotIdx);
    setSearch("");
  }

  return (
    <div className="bg-cyber-dark border border-cyber-border rounded-xl p-4 md:p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
          Select States to Compare
        </h2>
        <span className="text-[10px] font-mono text-text-muted">
          {selected.length}/{max} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slots.map((code, idx) => {
          const state = code ? STATE_REGISTRY[code] : null;
          const isOpen = openSlot === idx;
          const isAddSlot = !state;
          const disabled = isAddSlot && idx > selected.length;

          return (
            <div key={idx} className="relative">
              {state ? (
                <div className="flex items-center gap-3 bg-cyber-surface border border-neon-cyan/30 rounded-lg px-4 py-3">
                  <span className="text-2xl">{state.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono font-semibold text-neon-cyan tracking-wide">
                      {state.code}
                    </div>
                    <div className="text-[11px] font-mono text-text-primary truncate">
                      {state.name}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSlot(idx)}
                    aria-label={`Remove ${state.name}`}
                    className="p-1.5 rounded-md text-text-muted hover:text-neon-red hover:bg-cyber-dark/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => !disabled && openSelector(idx)}
                  disabled={disabled}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all ${
                    disabled
                      ? "border-cyber-border/60 text-text-muted cursor-not-allowed opacity-50"
                      : "border-cyber-border hover:border-neon-cyan/40 text-text-secondary hover:text-neon-cyan"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {idx < selected.length
                      ? "Change State"
                      : `Add State ${idx + 1}`}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* Dropdown search panel */}
              {isOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-cyber-darker border border-neon-cyan/30 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.15)] overflow-hidden">
                  <div className="p-2 border-b border-cyber-border bg-cyber-dark">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                      <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search states..."
                        className="w-full pl-8 pr-2 py-2 rounded-md bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-xs cyber-focus transition-all"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin">
                    {filteredStates.length === 0 ? (
                      <div className="text-xs font-mono text-text-muted p-4 text-center">
                        No states available.
                      </div>
                    ) : (
                      filteredStates.map((s) => (
                        <button
                          key={s.code}
                          onClick={() => pickState(idx, s.code)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors"
                        >
                          <span className="text-lg">{s.emoji}</span>
                          <span className="text-[11px] font-mono font-bold text-text-primary w-8">
                            {s.code}
                          </span>
                          <span className="text-xs font-mono text-text-secondary flex-1 truncate">
                            {s.name}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-cyber-border bg-cyber-dark flex justify-end">
                    <button
                      onClick={() => setOpenSlot(null)}
                      className="text-[10px] font-mono uppercase tracking-wider text-text-muted hover:text-neon-cyan px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-[10px] font-mono text-text-muted mt-3 text-center">
          Pick 2–3 states above to see a side-by-side comparison.
        </p>
      )}
    </div>
  );
}

export default StateSelector;
