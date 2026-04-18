"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, HardDriveDownload } from "lucide-react";
import {
  estimateStorageUsage,
  loadVault,
  removeDocument,
  updateDocument,
} from "@/lib/store/vault";
import {
  CATEGORY_LABELS,
  STORAGE_BUDGET,
  type VaultCategory,
  type VaultDocument,
  type VaultState,
} from "@/lib/types/vault";
import { TronGrid } from "@/components/ui/tron-grid";
import { VaultCategories } from "@/components/vault/vault-categories";
import { DocumentUpload } from "@/components/vault/document-upload";
import { DocumentCard } from "@/components/vault/document-card";
import { ExpirationAlerts } from "@/components/vault/expiration-alerts";

export default function VaultPage() {
  const [vault, setVault] = useState<VaultState>({
    version: 1,
    documents: [],
  });
  const [active, setActive] = useState<VaultCategory | "all">("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "Vault — IronForge";
    setVault(loadVault());
    setMounted(true);
  }, []);

  function refresh() {
    setVault(loadVault());
  }

  function onUpdate(id: string) {
    return (patch: Partial<VaultDocument>) => {
      setVault(updateDocument(id, patch));
    };
  }

  function onDelete(id: string) {
    return () => {
      setVault(removeDocument(id));
    };
  }

  const filtered = useMemo(() => {
    if (active === "all") return vault.documents;
    return vault.documents.filter((d) => d.category === active);
  }, [vault.documents, active]);

  const usage = useMemo(() => estimateStorageUsage(vault), [vault]);
  const usagePct = Math.min(100, Math.round((usage / STORAGE_BUDGET) * 100));

  return (
    <div className="relative min-h-screen overflow-hidden tron-grid">
      <TronGrid />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs text-text-muted transition-colors hover:text-neon-cyan"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> BACK TO HOME
          </Link>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neon-cyan/70">
            TOOL · DOCUMENT VAULT
          </span>
        </header>

        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl font-bold text-text-primary md:text-4xl">
              DOCUMENT{" "}
              <span className="text-neon-cyan text-glow-cyan">VAULT</span>
            </h1>
            <p className="mt-2 max-w-2xl font-mono text-sm text-text-secondary leading-relaxed">
              Keep your formation, licensing, bonding, insurance, and union
              paperwork in one place. Files are stored locally in your browser.
            </p>
          </div>
          <div className="rounded-lg border border-cyber-border bg-cyber-dark/60 p-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              <HardDriveDownload className="h-3 w-3 text-neon-cyan" /> LOCAL
              STORAGE
            </div>
            <div className="mt-1 font-mono text-xs text-text-primary">
              {(usage / 1024).toFixed(0)} KB / {(STORAGE_BUDGET / (1024 * 1024)).toFixed(0)} MB
            </div>
            <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-cyber-surface">
              <div
                className={`h-full transition-all ${
                  usagePct > 80
                    ? "bg-neon-red"
                    : usagePct > 60
                      ? "bg-neon-amber"
                      : "bg-neon-cyan"
                }`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            {usagePct > 80 && (
              <div className="mt-1 font-mono text-[10px] text-neon-red">
                Approaching storage limit.
              </div>
            )}
          </div>
        </section>

        {mounted && vault.documents.length > 0 && (
          <section className="mb-4">
            <ExpirationAlerts documents={vault.documents} />
          </section>
        )}

        <section className="mb-4">
          <DocumentUpload onAdded={refresh} />
        </section>

        <section className="mb-4">
          <VaultCategories
            documents={vault.documents}
            active={active}
            onChange={setActive}
          />
        </section>

        <section className="mb-12">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-cyber-border bg-cyber-dark/50 p-10 text-center font-mono text-sm text-text-muted">
              {active === "all"
                ? "No documents yet. Upload to get started."
                : `No documents in "${CATEGORY_LABELS[active]}".`}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doc) => (
                <div key={doc.id} id={`doc-${doc.id}`}>
                  <DocumentCard
                    doc={doc}
                    onUpdate={onUpdate(doc.id)}
                    onDelete={onDelete(doc.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
