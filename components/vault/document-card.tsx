"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useState } from "react";
import {
  Download,
  FileImage,
  FileText,
  FileType,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  type VaultCategory,
  type VaultDocument,
} from "@/lib/types/vault";

interface DocumentCardProps {
  doc: VaultDocument;
  onUpdate: (patch: Partial<VaultDocument>) => void;
  onDelete: () => void;
}

const CATEGORY_OPTIONS: VaultCategory[] = [
  "formation",
  "licensing",
  "bonding",
  "insurance",
  "certifications",
  "union",
  "legal",
  "other",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function typeIcon(doc: VaultDocument) {
  const t = (doc.type || "").toLowerCase();
  const name = doc.name.toLowerCase();
  if (t.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name))
    return FileImage;
  if (t === "application/pdf" || name.endsWith(".pdf")) return FileType;
  return FileText;
}

function expirationStatus(expiresAt?: string): {
  tone: "none" | "ok" | "warn" | "danger" | "expired";
  label: string;
} {
  if (!expiresAt) return { tone: "none", label: "" };
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  if (Number.isNaN(exp)) return { tone: "none", label: "" };
  const days = Math.round((exp - now) / 86_400_000);
  if (days < 0) return { tone: "expired", label: `Expired ${-days}d ago` };
  if (days < 7) return { tone: "danger", label: `${days}d left` };
  if (days < 30) return { tone: "warn", label: `${days}d left` };
  return { tone: "ok", label: `${days}d left` };
}

export function DocumentCard({ doc, onUpdate, onDelete }: DocumentCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<{
    notes: string;
    expiresAt: string;
    category: VaultCategory;
  }>({
    notes: doc.notes ?? "",
    expiresAt: doc.expiresAt ? doc.expiresAt.slice(0, 10) : "",
    category: doc.category,
  });

  const Icon = typeIcon(doc);
  const exp = expirationStatus(doc.expiresAt);

  function save() {
    onUpdate({
      notes: draft.notes || undefined,
      expiresAt: draft.expiresAt
        ? new Date(draft.expiresAt).toISOString()
        : undefined,
      category: draft.category,
    });
    setEditing(false);
  }

  return (
    <article className="relative rounded-lg border border-cyber-border bg-cyber-dark/70 p-4 transition-colors hover:border-neon-cyan/40">
      <header className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-mono text-sm font-semibold text-text-primary">
            {doc.name}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-secondary">
            <span>{CATEGORY_LABELS[doc.category]}</span>
            <span className="text-text-muted">·</span>
            <span>{formatBytes(doc.size)}</span>
            <span className="text-text-muted">·</span>
            <span>{new Date(doc.addedAt).toLocaleDateString()}</span>
          </div>
        </div>
        {exp.tone !== "none" && (
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider ${
              exp.tone === "expired"
                ? "border-neon-red/60 bg-neon-red/10 text-neon-red"
                : exp.tone === "danger"
                  ? "border-neon-red/50 bg-neon-red/5 text-neon-red"
                  : exp.tone === "warn"
                    ? "border-neon-amber/50 bg-neon-amber/5 text-neon-amber"
                    : "border-neon-green/40 bg-neon-green/5 text-neon-green"
            }`}
          >
            {exp.label}
          </span>
        )}
      </header>

      {!editing && doc.notes && (
        <p className="mt-3 text-[12px] text-text-secondary font-mono leading-relaxed">
          {doc.notes}
        </p>
      )}

      {editing && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Category
              </span>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    category: e.target.value as VaultCategory,
                  }))
                }
                className="mt-1 w-full rounded border border-cyber-border bg-cyber-dark px-2 py-1.5 font-mono text-xs text-text-primary cyber-focus"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Expires
              </span>
              <input
                type="date"
                value={draft.expiresAt}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, expiresAt: e.target.value }))
                }
                className="mt-1 w-full rounded border border-cyber-border bg-cyber-dark px-2 py-1.5 font-mono text-xs text-text-primary cyber-focus"
              />
            </label>
          </div>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Notes
            </span>
            <textarea
              value={draft.notes}
              onChange={(e) =>
                setDraft((d) => ({ ...d, notes: e.target.value }))
              }
              rows={2}
              className="mt-1 w-full rounded border border-cyber-border bg-cyber-dark px-2 py-1.5 font-mono text-xs text-text-primary cyber-focus"
            />
          </label>
        </div>
      )}

      <footer className="mt-3 flex flex-wrap items-center gap-2 border-t border-cyber-border/50 pt-3 font-mono text-[11px]">
        {doc.dataUrl ? (
          <a
            href={doc.dataUrl}
            download={doc.name}
            className="inline-flex items-center gap-1 rounded border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-1 text-neon-cyan transition-colors hover:bg-neon-cyan/10"
          >
            <Download className="h-3 w-3" /> Download
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 rounded border border-cyber-border bg-cyber-surface/60 px-2 py-1 text-text-muted">
            metadata only
          </span>
        )}
        {editing ? (
          <>
            <button
              onClick={save}
              className="inline-flex items-center gap-1 rounded border border-neon-green/40 bg-neon-green/5 px-2 py-1 text-neon-green transition-colors hover:bg-neon-green/10"
            >
              <Save className="h-3 w-3" /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 rounded border border-cyber-border bg-cyber-surface/60 px-2 py-1 text-text-secondary transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded border border-cyber-border bg-cyber-surface/60 px-2 py-1 text-text-secondary transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
        <button
          onClick={() => {
            if (!confirmDelete) setConfirmDelete(true);
            else onDelete();
          }}
          className={`ml-auto inline-flex items-center gap-1 rounded border px-2 py-1 transition-colors ${
            confirmDelete
              ? "border-neon-red/60 bg-neon-red/10 text-neon-red"
              : "border-cyber-border bg-cyber-surface/60 text-text-secondary hover:border-neon-red/50 hover:text-neon-red"
          }`}
        >
          <Trash2 className="h-3 w-3" />{" "}
          {confirmDelete ? "Confirm delete?" : "Delete"}
        </button>
      </footer>
    </article>
  );
}
