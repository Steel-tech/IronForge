"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadUserState } from "@/lib/store/user-profile";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";
import Link from "next/link";
import { ArrowLeft, Printer, Check, Circle } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";

export default function SummaryPage() {
  const router = useRouter();
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const state = loadUserState();
    if (!state.profile.state) {
      router.push("/");
      return;
    }
    setUserState(state);
    setLoaded(true);
  }, [router]);

  if (!loaded || !userState.profile.state) return null;

  const stateCode = userState.profile.state as StateCode;
  let totalItems = 0;
  let completedItems = 0;

  const phaseSummaries = PHASE_DEFINITIONS.map((phaseDef) => {
    const phase = getPhaseContent(phaseDef.id, stateCode);
    let phaseTotal = 0;
    let phaseCompleted = 0;

    const stepSummaries = phase.steps.map((step) => {
      const stepProgress = userState.progress[phaseDef.id]?.[step.id];
      const completed = stepProgress?.completedChecklist ?? [];
      const total = step.checklist.length;

      phaseTotal += total;
      phaseCompleted += completed.length;
      totalItems += total;
      completedItems += completed.length;

      return {
        id: step.id,
        title: step.title,
        total,
        completed: completed.length,
        visited: stepProgress?.visited ?? false,
        items: step.checklist.map((item) => ({
          ...item,
          done: completed.includes(item.id),
        })),
      };
    });

    return {
      id: phaseDef.id,
      title: phaseDef.title,
      total: phaseTotal,
      completed: phaseCompleted,
      steps: stepSummaries,
    };
  });

  const overallPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-cyber-black tron-grid">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <IBeamIcon className="w-10 h-10 text-neon-cyan animate-neon-pulse" />
          </div>
          <h1 className="text-3xl font-mono font-bold text-text-primary mb-2">
            IRON<span className="text-neon-cyan text-glow-cyan">FORGE</span>{" "}
            <span className="text-text-secondary">STATUS</span>
          </h1>
          <p className="text-text-muted font-mono text-sm">
            {userState.profile.state && STATE_REGISTRY[userState.profile.state]
              ? `${STATE_REGISTRY[userState.profile.state].emoji} ${STATE_REGISTRY[userState.profile.state].name.toUpperCase()}`
              : userState.profile.state}{" "}
            • {userState.profile.businessName || "IRONWORK CONTRACTOR"}
          </p>

          {/* Overall progress */}
          <div className="mt-6 inline-flex items-center gap-4 bg-cyber-dark border border-cyber-border rounded-full px-6 py-3">
            <span className="text-xs text-text-muted font-mono uppercase tracking-wider">
              Mission Progress
            </span>
            <span className="text-xl font-mono font-bold text-neon-cyan text-glow-cyan">
              {overallPercent}%
            </span>
            <span className="text-xs text-text-muted font-mono">
              ({completedItems}/{totalItems})
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full h-2 bg-cyber-surface rounded-full overflow-hidden">
              <div
                className="neon-progress-bar h-full"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase summaries */}
        <div className="space-y-6">
          {phaseSummaries.map((phase, phaseIdx) => {
            const phasePercent =
              phase.total > 0
                ? Math.round((phase.completed / phase.total) * 100)
                : 0;

            return (
              <div
                key={phase.id}
                className={`bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden animate-fade-in-up stagger-${Math.min(phaseIdx + 1, 6)}`}
              >
                <div className="p-5 border-b border-cyber-border/50 flex items-center justify-between relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
                  <h2 className="text-sm font-mono font-semibold text-text-primary uppercase tracking-wider">
                    <span className="text-neon-cyan mr-2">
                      {String(phaseIdx + 1).padStart(2, "0")}
                    </span>
                    {phase.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                      <div
                        className="neon-progress-bar h-full"
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-mono">
                      {phase.completed}/{phase.total}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-cyber-border/30">
                  {phase.steps.map((step) => (
                    <div key={step.id} className="p-4">
                      <Link
                        href={`/wizard/${phase.id}/${step.id}`}
                        className="flex items-center justify-between mb-2 hover:text-neon-cyan transition-colors group"
                      >
                        <span className="text-xs font-mono font-medium text-text-secondary group-hover:text-neon-cyan flex items-center gap-2">
                          {step.visited ? (
                            <Check className="w-3 h-3 text-neon-green" />
                          ) : (
                            <Circle className="w-3 h-3 text-text-muted" />
                          )}
                          {step.title}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {step.completed}/{step.total}
                        </span>
                      </Link>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-5">
                        {step.items.map((item) => (
                          <div
                            key={item.id}
                            className={`text-[11px] font-mono flex items-center gap-1.5 ${
                              item.done
                                ? "text-neon-green/70"
                                : "text-text-muted"
                            }`}
                          >
                            <span>
                              {item.done ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Circle className="w-2.5 h-2.5" />
                              )}
                            </span>
                            <span className={`truncate ${item.done ? "line-through" : ""}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-10 text-center space-y-4">
          <Link
            href={`/wizard/${userState.currentPhase}/${userState.currentStep}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-solid"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO FORGE
          </Link>
          <div>
            <button
              onClick={() => window.print()}
              className="text-text-muted hover:text-neon-cyan text-xs font-mono underline transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
