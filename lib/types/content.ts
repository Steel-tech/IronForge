// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: Step[];
}

export interface Step {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  estimatedCost: CostRange;
  checklist: ChecklistItem[];
  resources: Resource[];
  tips: string[];
  warnings: string[];
  stateSpecific: boolean;
  aiContext: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  link?: string;
}

export interface Resource {
  title: string;
  url: string;
  description: string;
  type: "form" | "website" | "guide" | "phone" | "office";
}

export interface CostRange {
  min: number;
  max: number;
  notes: string;
}

/**
 * Provenance metadata for a state's regulatory data. Present and populated
 * means a human verified the figures against the cited source on `lastVerified`;
 * absent means the data is machine-generated and not independently verified,
 * which the UI must surface (see the legal disclaimer).
 */
export interface StateVerification {
  /** ISO date (YYYY-MM-DD) the data was last verified against the source. */
  lastVerified?: string;
  /** Primary authoritative source the figures were verified against. */
  sourceUrl?: string;
  /** When the cited regulation/fee took effect, if known. */
  effectiveDate?: string;
}
