"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadUserState } from "@/lib/store/user-profile";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import Link from "next/link";

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
    <div className="min-h-screen bg-iron-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">⚒️</div>
          <h1 className="text-3xl font-bold text-iron-900 mb-2">
            Iron<span className="text-forge-600">Forge</span> Progress Summary
          </h1>
          <p className="text-iron-600">
            {userState.profile.state === "WA" ? "Washington" : "Oregon"} •{" "}
            {userState.profile.businessName || "Your Ironwork Business"}
          </p>
          <div className="mt-4 inline-flex items-center gap-3 bg-white border border-iron-200 rounded-full px-6 py-2">
            <span className="text-sm text-iron-600">Overall Progress</span>
            <span className="text-lg font-bold text-forge-600">
              {overallPercent}%
            </span>
            <span className="text-sm text-iron-400">
              ({completedItems}/{totalItems} items)
            </span>
          </div>
        </div>

        {/* Phase summaries */}
        <div className="space-y-6">
          {phaseSummaries.map((phase) => {
            const phasePercent =
              phase.total > 0
                ? Math.round((phase.completed / phase.total) * 100)
                : 0;

            return (
              <div
                key={phase.id}
                className="bg-white border border-iron-200 rounded-xl overflow-hidden"
              >
                <div className="p-5 border-b border-iron-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-iron-900">
                    {phase.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-iron-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forge-500 rounded-full transition-all"
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>
                    <span className="text-sm text-iron-500">
                      {phase.completed}/{phase.total}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-iron-50">
                  {phase.steps.map((step) => (
                    <div key={step.id} className="p-4">
                      <Link
                        href={`/wizard/${phase.id}/${step.id}`}
                        className="flex items-center justify-between mb-2 hover:text-forge-600"
                      >
                        <span className="text-sm font-medium text-iron-800">
                          {step.visited ? "✓" : "○"} {step.title}
                        </span>
                        <span className="text-xs text-iron-400">
                          {step.completed}/{step.total}
                        </span>
                      </Link>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-5">
                        {step.items.map((item) => (
                          <div
                            key={item.id}
                            className={`text-xs flex items-center gap-1.5 ${
                              item.done ? "text-green-600" : "text-iron-400"
                            }`}
                          >
                            <span>{item.done ? "✅" : "⬜"}</span>
                            <span className="truncate">{item.label}</span>
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
            className="inline-block px-6 py-3 bg-forge-600 text-white rounded-lg font-medium hover:bg-forge-700 transition-colors"
          >
            ← Back to Wizard
          </Link>
          <div>
            <button
              onClick={() => window.print()}
              className="text-iron-500 hover:text-iron-700 text-sm underline"
            >
              🖨️ Print this checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
