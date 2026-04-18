// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
export type VaultCategory =
  | "formation"
  | "licensing"
  | "bonding"
  | "insurance"
  | "certifications"
  | "union"
  | "legal"
  | "other";

export interface VaultDocument {
  id: string;
  name: string;
  category: VaultCategory;
  /** MIME type or file extension. */
  type: string;
  /** Size in bytes. */
  size: number;
  /** ISO timestamp when added to the vault. */
  addedAt: string;
  /** ISO date for expiration (e.g. for insurance COIs, certifications). */
  expiresAt?: string;
  notes?: string;
  /** Inline data URL — only populated for small files (<500KB). */
  dataUrl?: string;
}

export interface VaultState {
  version: number;
  documents: VaultDocument[];
}

export const CURRENT_VAULT_VERSION = 1;

export const DEFAULT_VAULT_STATE: VaultState = {
  version: CURRENT_VAULT_VERSION,
  documents: [],
};

export const CATEGORY_LABELS: Record<VaultCategory, string> = {
  formation: "Business Formation",
  licensing: "Licensing",
  bonding: "Bonding",
  insurance: "Insurance",
  certifications: "Certifications",
  union: "Union",
  legal: "Legal",
  other: "Other",
};

/** Rough keyword hints used to auto-suggest a category from a filename. */
export const CATEGORY_KEYWORDS: Record<VaultCategory, string[]> = {
  formation: [
    "articles",
    "operating",
    "agreement",
    "ein",
    "llc",
    "formation",
    "bylaws",
    "sosreceipt",
    "sos",
  ],
  licensing: [
    "license",
    "contractor",
    "lni",
    "cscl",
    "ccb",
    "trade",
    "registration",
  ],
  bonding: ["bond", "surety", "bondlet"],
  insurance: [
    "coi",
    "insurance",
    "liability",
    "auto",
    "umbrella",
    "gl",
    "wc",
    "workers",
  ],
  certifications: [
    "cert",
    "certification",
    "sdvosb",
    "wbe",
    "mbe",
    "dbe",
    "vetbiz",
    "vosb",
    "hubzone",
    "8a",
    "8(a)",
  ],
  union: ["cba", "signatory", "local", "jatf", "union", "trust"],
  legal: [
    "contract",
    "subcontract",
    "msa",
    "nda",
    "lien",
    "notice",
    "w9",
    "w-9",
  ],
  other: [],
};

export const INLINE_SIZE_LIMIT = 500 * 1024; // 500 KB
export const STORAGE_BUDGET = 5 * 1024 * 1024; // 5 MB (localStorage rough cap)

export function suggestCategory(filename: string): VaultCategory {
  const name = filename.toLowerCase();
  let best: VaultCategory = "other";
  let bestScore = 0;
  for (const category of Object.keys(CATEGORY_KEYWORDS) as VaultCategory[]) {
    if (category === "other") continue;
    const score = CATEGORY_KEYWORDS[category].reduce(
      (acc, kw) => (name.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }
  return best;
}
