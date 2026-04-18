"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { WizardProgress } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Circle, GitCompare } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";

interface ProgressSidebarProps {
  currentPhaseId: string;
  currentStepId: string;
  userState: StateCode;
  progress: WizardProgress;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ProgressSidebar({
  currentPhaseId,
  currentStepId,
  userState,
  progress,
  collapsed,
  onToggle,
}: ProgressSidebarProps) {
  return (
    <aside
      role="navigation"
      aria-label="Wizard progress"
      className={`bg-cyber-darker border-r border-cyber-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-14" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-cyber-border flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <IBeamIcon className="w-5 h-5 text-neon-cyan group-hover:animate-neon-pulse" />
            <span className="font-mono font-bold text-text-primary text-sm tracking-wide">
              IRON<span className="text-neon-cyan">FORGE</span>
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 text-text-muted hover:text-neon-cyan rounded transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand progress sidebar" : "Collapse progress sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {PHASE_DEFINITIONS.map((phaseDef, phaseIndex) => {
          const phaseContent = getPhaseContent(phaseDef.id, userState);
          const isCurrentPhase = phaseDef.id === currentPhaseId;
          const phaseProgress = progress[phaseDef.id] ?? {};
          const visitedSteps = Object.values(phaseProgress).filter(
            (s) => s.visited
          ).length;
          const totalSteps = phaseContent.steps.length;
          const isComplete = visitedSteps === totalSteps && totalSteps > 0;

          return (
            <div key={phaseDef.id}>
              {/* Phase header */}
              <div
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  isCurrentPhase
                    ? "bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {collapsed ? (
                  <span
                    className={`text-xs font-bold mx-auto font-mono ${
                      isComplete
                        ? "text-neon-green text-glow-green"
                        : isCurrentPhase
                          ? "text-neon-cyan text-glow-cyan"
                          : "text-text-muted"
                    }`}
                  >
                    {isComplete ? "✓" : `${String(phaseIndex + 1).padStart(2, "0")}`}
                  </span>
                ) : (
                  <>
                    <span
                      className={`w-6 text-center text-[10px] font-mono ${
                        isComplete
                          ? "text-neon-green text-glow-green"
                          : visitedSteps > 0
                            ? "text-neon-amber"
                            : "text-text-muted"
                      }`}
                    >
                      {isComplete ? "✓" : visitedSteps > 0 ? "◆" : "○"}
                    </span>
                    <span className="flex-1 truncate tracking-wide uppercase">
                      {phaseDef.title}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {visitedSteps}/{totalSteps}
                    </span>
                  </>
                )}
              </div>

              {/* Steps */}
              {!collapsed && isCurrentPhase && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-cyber-border pl-3">
                  {phaseContent.steps.map((step) => {
                    const isCurrentStep = step.id === currentStepId;
                    const stepProgress = phaseProgress[step.id];
                    const visited = stepProgress?.visited ?? false;

                    return (
                      <Link
                        key={step.id}
                        href={`/wizard/${phaseDef.id}/${step.id}`}
                        aria-current={isCurrentStep ? "step" : undefined}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-all ${
                          isCurrentStep
                            ? "bg-neon-cyan/10 text-neon-cyan border-l-2 border-neon-cyan -ml-[13px] pl-[14px]"
                            : visited
                              ? "text-text-secondary hover:text-text-primary hover:bg-cyber-surface/50"
                              : "text-text-muted hover:text-text-secondary hover:bg-cyber-surface/30"
                        }`}
                      >
                        {isCurrentStep ? (
                          <IBeamIcon className="w-3 h-3 shrink-0" />
                        ) : visited ? (
                          <Check className="w-3 h-3 text-neon-green shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate">{step.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-cyber-border space-y-2">
          <Link
            href="/estimator"
            className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-mono text-text-muted hover:text-neon-magenta hover:bg-neon-magenta/5 transition-colors uppercase tracking-wider"
          >
            <span className="text-neon-magenta">⚡</span>
            <span>Estimator</span>
            <span className="ml-auto text-text-muted/60">→</span>
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-mono text-text-muted hover:text-neon-green hover:bg-neon-green/5 transition-colors uppercase tracking-wider"
          >
            <GitCompare className="w-3 h-3 text-neon-green" />
            <span>Compare States</span>
            <span className="ml-auto text-text-muted/60">→</span>
          </Link>
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
            <span>
              {STATE_REGISTRY[userState]
                ? `${STATE_REGISTRY[userState].emoji} ${STATE_REGISTRY[userState].name.toUpperCase()}`
                : userState}
            </span>
            <Link
              href="/"
              className="hover:text-neon-cyan transition-colors uppercase tracking-wider"
            >
              Change
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
