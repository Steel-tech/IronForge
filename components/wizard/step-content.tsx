"use client";

import type { Step } from "@/lib/types/content";
import { Checklist } from "./checklist";
import { CostCard } from "./cost-card";
import { ResourceLink } from "./resource-link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Link2,
  Trophy,
} from "lucide-react";

interface StepContentProps {
  step: Step;
  phaseTitle: string;
  completedItems: string[];
  onToggleItem: (itemId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function StepContent({
  step,
  phaseTitle,
  completedItems,
  onToggleItem,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: StepContentProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-cyber-black">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-3 animate-fade-in-up">
          <div className="text-xs text-neon-cyan font-mono tracking-widest uppercase">
            {phaseTitle}
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-text-primary">
            {step.title}
          </h1>
          <div className="h-px bg-gradient-to-r from-neon-cyan/40 via-neon-cyan/10 to-transparent" />
        </div>

        {/* Description */}
        <div className="animate-fade-in-up stagger-1">
          <p className="text-text-secondary text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Cost & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-2">
          <CostCard
            icon="💰"
            label="Estimated Cost"
            value={
              step.estimatedCost.min === step.estimatedCost.max
                ? step.estimatedCost.min === 0
                  ? "Free"
                  : `$${step.estimatedCost.min.toLocaleString()}`
                : `$${step.estimatedCost.min.toLocaleString()} – $${step.estimatedCost.max.toLocaleString()}`
            }
            note={step.estimatedCost.notes}
          />
          <CostCard
            icon="⏱"
            label="Estimated Time"
            value={step.estimatedTime}
          />
        </div>

        {/* Checklist */}
        <div className="animate-fade-in-up stagger-3">
          <h2 className="text-sm font-mono font-semibold text-neon-green mb-4 tracking-wider uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Action Items
          </h2>
          <Checklist
            items={step.checklist}
            completedItems={completedItems}
            onToggle={onToggleItem}
          />
        </div>

        {/* Resources */}
        {step.resources.length > 0 && (
          <div className="animate-fade-in-up stagger-4">
            <h2 className="text-sm font-mono font-semibold text-neon-blue mb-4 tracking-wider uppercase flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Resources & Links
            </h2>
            <div className="space-y-2">
              {step.resources.map((resource) => (
                <ResourceLink key={resource.url} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {step.tips.length > 0 && (
          <div className="relative bg-neon-amber/5 border border-neon-amber/20 rounded-xl p-5 animate-fade-in-up stagger-5">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-amber/40 to-transparent" />
            <h2 className="text-sm font-mono font-semibold text-neon-amber mb-3 tracking-wider uppercase flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Pro Tips
            </h2>
            <ul className="space-y-2">
              {step.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-text-secondary text-sm"
                >
                  <span className="text-neon-amber mt-0.5 shrink-0 text-xs">▸</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {step.warnings.length > 0 && (
          <div className="relative bg-neon-red/5 border border-neon-red/20 rounded-xl p-5 animate-fade-in-up stagger-6">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-red/40 to-transparent" />
            <h2 className="text-sm font-mono font-semibold text-neon-red mb-3 tracking-wider uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Watch Out
            </h2>
            <ul className="space-y-2">
              {step.warnings.map((warning, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-text-secondary text-sm"
                >
                  <span className="text-neon-red mt-0.5 shrink-0 text-xs">▸</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-cyber-border">
          {hasPrev ? (
            <button
              onClick={onPrev}
              className="px-4 py-2.5 text-text-muted hover:text-neon-cyan font-mono text-sm rounded-lg transition-all inline-flex items-center gap-1.5 hover:bg-cyber-surface/50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}
          {hasNext ? (
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-solid inline-flex items-center gap-1.5"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/wizard/summary")}
              className="px-5 py-2.5 rounded-lg font-mono font-semibold text-sm tracking-wide inline-flex items-center gap-1.5 bg-gradient-to-r from-neon-cyan to-neon-green text-cyber-black border border-neon-green"
              style={{
                boxShadow:
                  "0 0 15px rgba(0, 255, 65, 0.3), 0 0 30px rgba(0, 240, 255, 0.15)",
              }}
            >
              <Trophy className="w-4 h-4" /> View Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
