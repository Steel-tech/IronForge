"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import {
  type CapStatementData,
  DEFAULT_CAP_STATEMENT,
} from "@/lib/types/cap-statement";

const STORAGE_KEY = "ironforge-cap-statement";

export function loadCapStatement(): CapStatementData {
  if (typeof window === "undefined") return DEFAULT_CAP_STATEMENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CAP_STATEMENT;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_CAP_STATEMENT;
    // Shallow merge to tolerate schema additions
    return {
      ...DEFAULT_CAP_STATEMENT,
      ...parsed,
      certifications: {
        ...DEFAULT_CAP_STATEMENT.certifications,
        ...(parsed.certifications ?? {}),
      },
      pastProjects:
        Array.isArray(parsed.pastProjects) && parsed.pastProjects.length > 0
          ? parsed.pastProjects
          : DEFAULT_CAP_STATEMENT.pastProjects,
    };
  } catch {
    return DEFAULT_CAP_STATEMENT;
  }
}

export function saveCapStatement(data: CapStatementData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function clearCapStatement(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
