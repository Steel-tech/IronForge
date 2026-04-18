"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { ChecklistItem } from "@/lib/types/content";
import { Check, ExternalLink } from "lucide-react";
import { ClickSpark } from "@/components/ui/click-spark";

interface ChecklistProps {
  items: ChecklistItem[];
  completedItems: string[];
  onToggle: (itemId: string) => void;
}

export function Checklist({ items, completedItems, onToggle }: ChecklistProps) {
  return (
    <div role="list" aria-label="Checklist" className="space-y-2">
      {items.map((item) => {
        const completed = completedItems.includes(item.id);
        const checkboxLabel = `${completed ? "Uncheck" : "Check"}: ${item.label}${item.description ? ` — ${item.description}` : ""}`;
        return (
          <ClickSpark
            key={item.id}
            role="listitem"
            sparkColor="var(--color-neon-green, #22c55e)"
            sparkCount={12}
            shouldSpark={() => !completed}
            className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer group ${
              completed
                ? "bg-neon-green/5 border-neon-green/20 neon-border-green"
                : "bg-cyber-dark/50 border-cyber-border hover:border-neon-cyan/30"
            }`}
            onClick={() => onToggle(item.id)}
          >
            <div className="mt-0.5">
              <div
                role="checkbox"
                aria-checked={completed}
                aria-label={checkboxLabel}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle(item.id);
                  }
                }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cyber-focus ${
                  completed
                    ? "bg-neon-green/20 border-neon-green text-neon-green"
                    : "border-cyber-border-bright group-hover:border-neon-cyan/50"
                }`}
              >
                {completed && <Check className="w-3 h-3" />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm font-mono ${
                    completed
                      ? "text-neon-green line-through opacity-70"
                      : "text-text-primary"
                  }`}
                >
                  {item.label}
                  {item.required && (
                    <span className="text-neon-red ml-1 text-xs">*</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neon-blue hover:text-neon-cyan mt-1.5 inline-flex items-center gap-1 font-mono transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" /> Open link
                </a>
              )}
            </div>
          </ClickSpark>
        );
      })}
    </div>
  );
}
