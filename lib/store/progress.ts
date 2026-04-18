"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { WizardProgress, StepProgress } from "@/lib/types/wizard";

export function getStepProgress(
  progress: WizardProgress,
  phaseId: string,
  stepId: string
): StepProgress {
  return progress[phaseId]?.[stepId] ?? { visited: false, completedChecklist: [] };
}

export function toggleChecklistItem(
  progress: WizardProgress,
  phaseId: string,
  stepId: string,
  itemId: string
): WizardProgress {
  const current = getStepProgress(progress, phaseId, stepId);
  const completed = current.completedChecklist.includes(itemId)
    ? current.completedChecklist.filter((id) => id !== itemId)
    : [...current.completedChecklist, itemId];

  return {
    ...progress,
    [phaseId]: {
      ...progress[phaseId],
      [stepId]: {
        visited: true,
        completedChecklist: completed,
      },
    },
  };
}

export function markStepVisited(
  progress: WizardProgress,
  phaseId: string,
  stepId: string
): WizardProgress {
  const current = getStepProgress(progress, phaseId, stepId);
  if (current.visited) return progress;

  return {
    ...progress,
    [phaseId]: {
      ...progress[phaseId],
      [stepId]: {
        ...current,
        visited: true,
      },
    },
  };
}

export function getPhaseCompletionPercent(
  progress: WizardProgress,
  phaseId: string,
  totalSteps: number
): number {
  const phaseProgress = progress[phaseId];
  if (!phaseProgress || totalSteps === 0) return 0;
  const visitedSteps = Object.values(phaseProgress).filter((s) => s.visited).length;
  return Math.round((visitedSteps / totalSteps) * 100);
}
