"use client";

import { AlertTriangle } from "lucide-react";
import type { VaultDocument } from "@/lib/types/vault";

interface ExpirationAlertsProps {
  documents: VaultDocument[];
}

interface Bucket {
  label: string;
  tone: "danger" | "warn" | "expired";
  items: VaultDocument[];
}

export function ExpirationAlerts({ documents }: ExpirationAlertsProps) {
  const now = Date.now();
  const thirty = 30 * 86_400_000;
  const seven = 7 * 86_400_000;

  const expired: VaultDocument[] = [];
  const danger: VaultDocument[] = []; // < 7d
  const warn: VaultDocument[] = []; // < 30d

  for (const d of documents) {
    if (!d.expiresAt) continue;
    const exp = new Date(d.expiresAt).getTime();
    if (Number.isNaN(exp)) continue;
    const delta = exp - now;
    if (delta < 0) expired.push(d);
    else if (delta < seven) danger.push(d);
    else if (delta < thirty) warn.push(d);
  }

  const buckets: Bucket[] = (
    [
      { label: "Expired", tone: "expired", items: expired },
      { label: "Expiring in <7 days", tone: "danger", items: danger },
      { label: "Expiring in <30 days", tone: "warn", items: warn },
    ] satisfies Bucket[]
  ).filter((b) => b.items.length > 0);

  if (buckets.length === 0) return null;

  const totalCount = expired.length + danger.length + warn.length;

  return (
    <div className="rounded-lg border border-neon-amber/40 bg-neon-amber/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon-amber/50 bg-neon-amber/10 text-neon-amber">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-xs font-semibold tracking-wider text-neon-amber">
            {totalCount} DOCUMENT{totalCount === 1 ? "" : "S"} NEED ATTENTION
          </div>
          <div className="mt-1 font-mono text-[11px] text-text-secondary">
            Renew or archive expiring items to keep your vault audit-ready.
          </div>

          <div className="mt-3 space-y-2">
            {buckets.map((b) => (
              <div key={b.label}>
                <div
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    b.tone === "expired" || b.tone === "danger"
                      ? "text-neon-red"
                      : "text-neon-amber"
                  }`}
                >
                  {b.label} · {b.items.length}
                </div>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {b.items.map((d) => (
                    <li key={d.id}>
                      <a
                        href={`#doc-${d.id}`}
                        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                          b.tone === "expired"
                            ? "border-neon-red/60 bg-neon-red/10 text-neon-red hover:bg-neon-red/20"
                            : b.tone === "danger"
                              ? "border-neon-red/50 bg-neon-red/5 text-neon-red hover:bg-neon-red/10"
                              : "border-neon-amber/50 bg-neon-amber/5 text-neon-amber hover:bg-neon-amber/10"
                        }`}
                      >
                        {d.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
