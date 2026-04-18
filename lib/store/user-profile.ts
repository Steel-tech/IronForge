"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { type UserState, DEFAULT_STATE } from "@/lib/types/wizard";

const STORAGE_KEY = "ironforge_user_state";

function isValidUserState(data: unknown): data is UserState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  // Validate profile
  if (typeof d.profile !== "object" || d.profile === null) return false;
  const p = d.profile as Record<string, unknown>;
  if (p.state !== null && (typeof p.state !== "string" || !/^[A-Z]{2}$/.test(p.state))) return false;
  if (typeof p.isVeteran !== "boolean") return false;
  if (typeof p.isDisabledVeteran !== "boolean") return false;
  if (typeof p.isMinority !== "boolean") return false;
  if (typeof p.isWomanOwned !== "boolean") return false;
  if (typeof p.businessName !== "string" || p.businessName.length > 200) return false;
  if (typeof p.tradeExperience !== "string" || p.tradeExperience.length > 50) return false;

  // Validate navigation fields
  if (typeof d.currentPhase !== "string" || !/^[a-z-]+$/.test(d.currentPhase)) return false;
  if (typeof d.currentStep !== "string" || !/^[a-z-]+$/.test(d.currentStep)) return false;
  if (typeof d.startedAt !== "string") return false;
  if (typeof d.progress !== "object" || d.progress === null) return false;

  return true;
}

export function loadUserState(): UserState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return isValidUserState(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export function clearUserState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
