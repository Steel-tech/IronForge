"use client";

import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { WizardProgress } from "@/lib/types/wizard";
import Link from "next/link";

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
      className={`bg-white border-r border-iron-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-14" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-iron-100 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚒️</span>
            <span className="font-bold text-iron-900">
              Iron<span className="text-forge-600">Forge</span>
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1 text-iron-400 hover:text-iron-600 rounded"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {PHASE_DEFINITIONS.map((phaseDef, phaseIndex) => {
          const phaseContent = getPhaseContent(phaseDef.id, userState);
          const isCurrentPhase = phaseDef.id === currentPhaseId;
          const phaseProgress = progress[phaseDef.id] ?? {};
          const visitedSteps = Object.values(phaseProgress).filter((s) => s.visited).length;
          const totalSteps = phaseContent.steps.length;
          const isComplete = visitedSteps === totalSteps && totalSteps > 0;

          return (
            <div key={phaseDef.id}>
              {/* Phase header */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isCurrentPhase
                    ? "bg-forge-50 text-forge-700"
                    : "text-iron-600"
                }`}
              >
                {collapsed ? (
                  <span className="text-xs font-bold mx-auto">
                    {isComplete ? "✅" : `${phaseIndex + 1}`}
                  </span>
                ) : (
                  <>
                    <span className="w-5 text-center text-xs">
                      {isComplete ? "✅" : visitedSteps > 0 ? "🔶" : "⬜"}
                    </span>
                    <span className="flex-1 truncate">{phaseDef.title}</span>
                    <span className="text-xs text-iron-400">
                      {visitedSteps}/{totalSteps}
                    </span>
                  </>
                )}
              </div>

              {/* Steps (only show for current phase or if not collapsed) */}
              {!collapsed && isCurrentPhase && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {phaseContent.steps.map((step) => {
                    const isCurrentStep = step.id === currentStepId;
                    const stepProgress = phaseProgress[step.id];
                    const visited = stepProgress?.visited ?? false;

                    return (
                      <Link
                        key={step.id}
                        href={`/wizard/${phaseDef.id}/${step.id}`}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                          isCurrentStep
                            ? "bg-forge-100 text-forge-800 font-medium"
                            : visited
                              ? "text-iron-600 hover:bg-iron-50"
                              : "text-iron-400 hover:bg-iron-50 hover:text-iron-600"
                        }`}
                      >
                        <span className="w-4 text-center text-xs">
                          {isCurrentStep ? "→" : visited ? "✓" : "○"}
                        </span>
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
        <div className="p-3 border-t border-iron-100 text-xs text-iron-400">
          <div className="flex items-center justify-between">
            <span>{userState === "WA" ? "🌲 Washington" : "🏔️ Oregon"}</span>
            <Link href="/" className="hover:text-iron-600">
              Change
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
