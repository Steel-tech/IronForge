"use client";

import type { Step } from "@/lib/types/content";
import { Checklist } from "./checklist";
import { CostCard } from "./cost-card";
import { ResourceLink } from "./resource-link";

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
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-sm text-forge-600 font-medium">{phaseTitle}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-iron-900">
            {step.title}
          </h1>
        </div>

        {/* Description */}
        <div className="prose prose-iron max-w-none">
          <p className="text-iron-700 text-lg leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Cost & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CostCard
            icon="💰"
            label="Estimated Cost"
            value={
              step.estimatedCost.min === step.estimatedCost.max
                ? step.estimatedCost.min === 0
                  ? "Free"
                  : `$${step.estimatedCost.min.toLocaleString()}`
                : `$${step.estimatedCost.min.toLocaleString()} - $${step.estimatedCost.max.toLocaleString()}`
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
        <div>
          <h2 className="text-lg font-semibold text-iron-900 mb-4">
            ✅ Action Items
          </h2>
          <Checklist
            items={step.checklist}
            completedItems={completedItems}
            onToggle={onToggleItem}
          />
        </div>

        {/* Resources */}
        {step.resources.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-iron-900 mb-4">
              📎 Resources & Links
            </h2>
            <div className="space-y-3">
              {step.resources.map((resource) => (
                <ResourceLink key={resource.url} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {step.tips.length > 0 && (
          <div className="bg-forge-50 border border-forge-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-forge-800 mb-3">
              💡 Pro Tips
            </h2>
            <ul className="space-y-2">
              {step.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-iron-700">
                  <span className="text-forge-500 mt-1 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {step.warnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-red-800 mb-3">
              ⚠️ Watch Out
            </h2>
            <ul className="space-y-2">
              {step.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2 text-red-700">
                  <span className="text-red-500 mt-1 shrink-0">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-iron-200">
          {hasPrev ? (
            <button
              onClick={onPrev}
              className="px-5 py-2.5 text-iron-600 hover:text-iron-800 hover:bg-iron-100 rounded-lg transition-colors"
            >
              ← Previous Step
            </button>
          ) : (
            <div />
          )}
          {hasNext ? (
            <button
              onClick={onNext}
              className="px-5 py-2.5 bg-forge-600 text-white rounded-lg font-medium hover:bg-forge-700 transition-colors"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/wizard/summary")}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🎉 View Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
