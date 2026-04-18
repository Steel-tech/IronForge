"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import {
  CURRENT_VAULT_VERSION,
  DEFAULT_VAULT_STATE,
  type VaultDocument,
  type VaultState,
} from "@/lib/types/vault";

const STORAGE_KEY = "ironforge-vault";

function isValidState(data: unknown): data is VaultState {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== "number") return false;
  if (!Array.isArray(d.documents)) return false;
  return true;
}

export function loadVault(): VaultState {
  if (typeof window === "undefined") return DEFAULT_VAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) return DEFAULT_VAULT_STATE;
    // Forward compatibility: drop unexpected fields by rebuilding.
    return {
      version: CURRENT_VAULT_VERSION,
      documents: parsed.documents.filter(isValidDoc),
    };
  } catch {
    return DEFAULT_VAULT_STATE;
  }
}

function isValidDoc(d: unknown): d is VaultDocument {
  if (typeof d !== "object" || d === null) return false;
  const r = d as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.category === "string" &&
    typeof r.type === "string" &&
    typeof r.size === "number" &&
    typeof r.addedAt === "string"
  );
}

export function saveVault(state: VaultState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch {
    return false;
  }
}

export function addDocument(doc: VaultDocument): VaultState {
  const current = loadVault();
  const next: VaultState = {
    ...current,
    documents: [doc, ...current.documents],
  };
  saveVault(next);
  return next;
}

export function updateDocument(
  id: string,
  patch: Partial<VaultDocument>,
): VaultState {
  const current = loadVault();
  const next: VaultState = {
    ...current,
    documents: current.documents.map((d) =>
      d.id === id ? { ...d, ...patch, id: d.id } : d,
    ),
  };
  saveVault(next);
  return next;
}

export function removeDocument(id: string): VaultState {
  const current = loadVault();
  const next: VaultState = {
    ...current,
    documents: current.documents.filter((d) => d.id !== id),
  };
  saveVault(next);
  return next;
}

export function estimateStorageUsage(state: VaultState): number {
  try {
    return new Blob([JSON.stringify(state)]).size;
  } catch {
    return JSON.stringify(state).length;
  }
}

export function generateDocId(): string {
  // Use crypto.randomUUID where available; fall back to a short random id.
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `doc-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
