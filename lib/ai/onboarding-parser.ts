// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { STATE_REGISTRY } from "@/content/state-registry";

/**
 * Onboarding response parsers.
 * Simple keyword-based extraction — no AI needed. We just need to turn
 * the user's free-form answer into a single field on UserProfile.
 */

export interface ParseResult<T> {
  ok: boolean;
  value?: T;
  reason?: string;
}

// ── State ────────────────────────────────────────────────────

const STATE_ALIASES: Record<string, string> = {};
for (const [code, data] of Object.entries(STATE_REGISTRY)) {
  STATE_ALIASES[code.toLowerCase()] = code;
  STATE_ALIASES[data.name.toLowerCase()] = code;
}
// Common variants / slang
Object.assign(STATE_ALIASES, {
  "wash": "WA",
  "washington state": "WA",
  "cali": "CA",
  "calif": "CA",
  "mass": "MA",
  "penn": "PA",
  "penna": "PA",
  "n.y.": "NY",
  "n.j.": "NJ",
  "d.c.": "DC", // will fall through to not-found
  "nyc": "NY",
});

export function parseState(input: string): ParseResult<string> {
  const raw = input.trim().toLowerCase().replace(/[.,!?]/g, "");
  if (!raw) return { ok: false, reason: "Empty response" };

  // Direct alias match (try longer phrases first)
  const sorted = Object.keys(STATE_ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of sorted) {
    // Match as whole word / phrase
    const pattern = new RegExp(`(^|\\s|,)${escapeRegex(alias)}(\\s|,|$)`, "i");
    if (pattern.test(` ${raw} `)) {
      const code = STATE_ALIASES[alias];
      if (code && STATE_REGISTRY[code]) {
        return { ok: true, value: code };
      }
    }
  }

  return {
    ok: false,
    reason:
      "I couldn't pin down which state. Can you give me the full state name (like \"Washington\" or \"Texas\")?",
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── Experience ───────────────────────────────────────────────

export function parseExperience(input: string): ParseResult<string> {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, reason: "Empty response" };

  // Explicit ranges
  if (/\b(10\+|ten\+|over 10|more than 10|15|20|25|30)\b/.test(raw))
    return { ok: true, value: "10+" };
  if (/\b(5-10|5 to 10|six|seven|eight|nine|5|6|7|8|9)\s*(year|yr|yrs)?/.test(raw))
    return { ok: true, value: "5-10" };
  if (/\b(3-5|3 to 5|three|four|3|4)\s*(year|yr|yrs)?/.test(raw))
    return { ok: true, value: "3-5" };
  if (
    /\b(0-2|zero|none|just starting|new|beginner|apprentice|one|two|1|2)\s*(year|yr|yrs)?/.test(
      raw
    ) ||
    /\bno experience\b/.test(raw)
  )
    return { ok: true, value: "0-2" };

  // Extract a raw number
  const match = raw.match(/(\d+)\s*(?:year|yr)?/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n >= 10) return { ok: true, value: "10+" };
    if (n >= 5) return { ok: true, value: "5-10" };
    if (n >= 3) return { ok: true, value: "3-5" };
    if (n >= 0) return { ok: true, value: "0-2" };
  }

  return {
    ok: false,
    reason:
      "How many years — roughly? 0-2, 3-5, 5-10, or 10+ is fine.",
  };
}

// ── Yes/No ───────────────────────────────────────────────────

const YES_PATTERNS =
  /\b(yes|yeah|yep|yup|yea|ya|sure|correct|right|affirmative|definitely|absolutely|of course|i am|i do|true)\b/i;
const NO_PATTERNS =
  /\b(no|nope|nah|not really|negative|false|i('| a)?m not|not a|i don'?t|neither)\b/i;

export function parseYesNo(input: string): ParseResult<boolean> {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, reason: "Empty response" };

  // Check NO first because "not a veteran" contains "veteran"
  if (NO_PATTERNS.test(raw)) return { ok: true, value: false };
  if (YES_PATTERNS.test(raw)) return { ok: true, value: true };

  return {
    ok: false,
    reason: "Just a yes or no works — which is it?",
  };
}

// ── Veteran (combined veteran + disability) ──────────────────

export interface VeteranStatus {
  isVeteran: boolean;
  isDisabledVeteran: boolean;
}

/**
 * Parses answers like:
 *   "yes, disabled 30%" → veteran + disabled
 *   "yes veteran no disability" → veteran, not disabled
 *   "no" → neither
 *   "yes" → veteran, ask follow-up for disability
 */
export function parseVeteran(input: string): ParseResult<VeteranStatus> {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, reason: "Empty response" };

  const hasDisability =
    /\b(disabl|service-?connected|sc\b|sdvosb|percent|%|rating|compensable)\b/.test(
      raw
    );
  const noVeteran =
    /\b(no|not a veteran|not a vet|nope|negative|civilian|never served)\b/.test(
      raw
    ) && !/\byes\b/.test(raw);

  if (noVeteran) {
    return { ok: true, value: { isVeteran: false, isDisabledVeteran: false } };
  }

  const yesVeteran =
    /\b(yes|yeah|yep|vet|veteran|served|army|navy|marine|air force|coast guard|space force|military)\b/.test(
      raw
    );

  if (yesVeteran) {
    // If they explicitly said "no disability" treat as not disabled
    const noDisability = /\b(no|not)\s+(disabl|service|sc|rating)/.test(raw);
    return {
      ok: true,
      value: {
        isVeteran: true,
        isDisabledVeteran: hasDisability && !noDisability,
      },
    };
  }

  return {
    ok: false,
    reason:
      "Just let me know: are you a veteran? And if so, do you have a service-connected disability?",
  };
}

// ── Business name ────────────────────────────────────────────

const SKIP_NAME_PATTERNS =
  /^(skip|pass|none|n\/a|na|later|not yet|no name|don'?t know|undecided|haven'?t decided|no idea|idk|nope|no)\.?$/i;

export function parseBusinessName(input: string): ParseResult<string> {
  const raw = input.trim();
  if (!raw) return { ok: true, value: "" };
  if (SKIP_NAME_PATTERNS.test(raw)) return { ok: true, value: "" };
  if (raw.length > 200) {
    return {
      ok: false,
      reason: "That's a long one — keep it under 200 characters.",
    };
  }
  // Strip surrounding quotes
  const cleaned = raw.replace(/^["'`]|["'`]$/g, "").trim();
  return { ok: true, value: cleaned };
}

// ── Confirmation ─────────────────────────────────────────────

export function parseConfirmation(input: string): ParseResult<boolean> {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, reason: "Empty response" };

  if (
    /\b(yes|yeah|yep|looks good|looks right|let'?s go|ready|confirm|correct|good|go|launch|start|perfect|great)\b/.test(
      raw
    )
  ) {
    return { ok: true, value: true };
  }
  if (
    /\b(no|nope|wait|change|edit|wrong|incorrect|hold on|not quite|back)\b/.test(
      raw
    )
  ) {
    return { ok: true, value: false };
  }
  return {
    ok: false,
    reason: "Say \"let's go\" to launch, or \"wait\" to go back and change something.",
  };
}
