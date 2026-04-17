"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComplianceEvent } from "@/lib/calendar/compliance-dates";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface EventDetailProps {
  event: ComplianceEvent;
  onToggleComplete: () => void;
}

/**
 * Category-specific action guidance — short, practical next steps
 * shown when a compliance event is expanded.
 */
function getActionItems(event: ComplianceEvent): string[] {
  switch (event.category) {
    case "formation":
      return [
        "Log in to your Secretary of State online portal.",
        "Confirm registered agent and principal address are current.",
        "Pay the filing fee (credit card or ACH).",
        "Save a PDF copy of the confirmation for your records.",
      ];
    case "tax":
      return [
        "Review year-to-date net income and estimate liability.",
        "Use IRS Direct Pay, EFTPS, or your accounting software.",
        "Confirm state estimated tax payment (if your state has income tax).",
        "File confirmation numbers in your records.",
      ];
    case "insurance":
      return [
        "Request updated quotes 30 days before expiration.",
        "Compare coverage limits and deductibles, not just price.",
        "Confirm additional insured endorsements are transferred.",
        "Save new certificates of insurance (COIs) to share with GCs.",
      ];
    case "bonding":
      return [
        "Contact your surety agent 45-60 days before renewal.",
        "Provide updated financials if requested.",
        "Confirm bond amount still meets state + project requirements.",
        "Post the new bond with the licensing authority.",
      ];
    case "licensing":
      return [
        "Check continuing-education requirements (if any).",
        "Confirm bond, insurance, and financial statements are current.",
        "Submit renewal application and fee before expiration.",
        "Save the new license/registration PDF.",
      ];
    case "osha":
      return [
        "Gather your OSHA 300 log and 300A summary for the year.",
        "Post Form 300A Feb 1 – Apr 30 in a visible common area.",
        "Electronically submit 300A to OSHA if you have 20+ employees in construction.",
        "Refresh OSHA 10/30 cards as needed.",
      ];
    case "certification":
      return [
        "Log in to the certifying portal (SAM.gov, VetCert, state program, etc.).",
        "Update ownership, financials, and point-of-contact info.",
        "Upload refreshed supporting documents (tax returns, licenses).",
        "Save confirmation of recertification.",
      ];
    default:
      return [];
  }
}

const PHASE_LABELS: Record<string, string> = {
  "business-formation": "Business Formation",
  "contractor-licensing": "Contractor Licensing",
  "surety-bonding": "Surety Bonding",
  insurance: "Insurance Coverage",
  certifications: "Certifications & Set-Asides",
  "union-signatory": "Union Signatory Contractor",
  "legal-federal": "Legal & Federal Contracting",
};

export function EventDetail({ event, onToggleComplete }: EventDetailProps) {
  const actions = getActionItems(event);

  return (
    <div className="border-t border-cyber-border bg-cyber-darker/50 p-4 sm:p-5 space-y-4">
      <p className="text-sm text-text-secondary leading-relaxed">
        {event.description}
      </p>

      {actions.length > 0 && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
            Action Items
          </h4>
          <ul className="space-y-1.5">
            {actions.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-text-primary font-mono"
              >
                <span className="text-neon-cyan mt-0.5">▸</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={onToggleComplete}
          className={cn(
            "btn-neon-cyan px-3 py-2 rounded font-mono text-xs uppercase tracking-widest flex items-center gap-2",
            event.completed && "btn-neon-magenta",
          )}
        >
          {event.completed ? (
            <>
              <Circle className="w-3.5 h-3.5" /> Mark Incomplete
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
            </>
          )}
        </button>

        {event.phaseId && PHASE_LABELS[event.phaseId] && (
          <Link
            href={`/?jump=${event.phaseId}`}
            className="btn-neon-cyan px-3 py-2 rounded font-mono text-xs uppercase tracking-widest flex items-center gap-2"
          >
            Go to {PHASE_LABELS[event.phaseId]}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
