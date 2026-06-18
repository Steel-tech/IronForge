// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Progress export — turns a user's wizard progress into downloadable JSON (the
 * complete structured record) or CSV (a per-phase table for spreadsheets).
 * The builders are pure so they're testable; downloadTextFile is the only
 * browser-coupled piece.
 */

export interface ProgressExportPhase {
  id: string;
  title: string;
  totalSteps: number;
  visitedSteps: number;
  totalItems: number;
  completedItems: number;
  minCost: number;
  maxCost: number;
}

export interface ProgressExport {
  generatedAt: string;
  state: string;
  stateName: string;
  businessName: string;
  overallPercent: number;
  completedItems: number;
  totalItems: number;
  phasesComplete: number;
  totalPhases: number;
  startedAt: string;
  phases: ProgressExportPhase[];
}

export function toProgressJson(data: ProgressExport): string {
  return JSON.stringify(data, null, 2);
}

const CSV_HEADER = [
  "Phase",
  "Steps Visited",
  "Total Steps",
  "Items Completed",
  "Total Items",
  "Min Cost",
  "Max Cost",
];

function escapeCsv(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toProgressCsv(data: ProgressExport): string {
  const rows = data.phases.map((p) => [
    p.title,
    p.visitedSteps,
    p.totalSteps,
    p.completedItems,
    p.totalItems,
    p.minCost,
    p.maxCost,
  ]);
  return [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
}

/** Trigger a client-side download of text content. Browser-only. */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
