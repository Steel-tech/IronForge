"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { ShieldAlert } from "lucide-react";
import { getStateVerification } from "@/content/state-registry";

interface LegalDisclaimerProps {
  /** Two-letter state code from the user's profile, if known. */
  stateCode?: string | null;
}

/** Format an ISO date (YYYY-MM-DD) without UTC timezone drift. */
function formatVerifiedDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Persistent, non-dismissable legal notice shown on state-facing content.
 * Surfaces whether the state's regulatory data was human-verified (with the
 * date) or is machine-generated and unverified.
 */
export function LegalDisclaimer({ stateCode }: LegalDisclaimerProps) {
  const v = stateCode ? getStateVerification(stateCode) : null;
  const agency = v?.stateName ?? "your state";

  return (
    <div
      role="note"
      aria-label="Legal disclaimer"
      className="flex items-start gap-2.5 rounded-lg border border-neon-amber/25 bg-neon-amber/5 px-3.5 py-2.5 text-xs leading-relaxed"
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-neon-amber" />
      <div className="space-y-1 text-text-secondary">
        <p>
          <span className="font-semibold text-neon-amber">Not legal advice.</span>{" "}
          Fees, rules, and links change — verify with the official {agency}{" "}
          agency before acting.
        </p>
        {v &&
          (v.verified ? (
            <p className="text-text-muted">
              Last verified {formatVerifiedDate(v.lastVerified)}.
              {v.sourceUrl && (
                <>
                  {" "}
                  <a
                    href={v.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:underline"
                  >
                    Source
                  </a>
                </>
              )}
            </p>
          ) : (
            <p className="text-text-muted">
              Auto-generated for {v.stateName} — not independently verified.
              {v.sourceUrl && (
                <>
                  {" "}
                  <a
                    href={v.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:underline"
                  >
                    Confirm with the state agency
                  </a>
                </>
              )}
            </p>
          ))}
      </div>
    </div>
  );
}
