"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import {
  CATEGORY_LABELS,
  INLINE_SIZE_LIMIT,
  suggestCategory,
  type VaultCategory,
  type VaultDocument,
} from "@/lib/types/vault";
import { addDocument, generateDocId, loadVault } from "@/lib/store/vault";

interface DocumentUploadProps {
  onAdded?: () => void;
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

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function DocumentUpload({ onAdded }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "info" | "error" | "success";
    text: string;
  } | null>(null);

  async function ingest(files: FileList | File[]) {
    setBusy(true);
    let added = 0;
    let skippedLarge = 0;
    try {
      for (const file of Array.from(files)) {
        const category = suggestCategory(file.name);
        const id = generateDocId();
        const base: VaultDocument = {
          id,
          name: file.name,
          category,
          type: file.type || file.name.split(".").pop() || "file",
          size: file.size,
          addedAt: new Date().toISOString(),
        };

        if (file.size <= INLINE_SIZE_LIMIT) {
          try {
            base.dataUrl = await readAsDataUrl(file);
          } catch {
            /* fall through — store metadata only */
          }
        } else {
          skippedLarge += 1;
        }

        try {
          addDocument(base);
          added += 1;
        } catch {
          // Likely quota exceeded — fall back to metadata-only and retry.
          if (base.dataUrl) {
            const meta: VaultDocument = { ...base, dataUrl: undefined };
            try {
              addDocument(meta);
              added += 1;
              skippedLarge += 1;
            } catch {
              /* give up on this one */
            }
          }
        }
      }
      if (added === 0) {
        setMessage({
          tone: "error",
          text: "Could not save documents (storage may be full).",
        });
      } else if (skippedLarge > 0) {
        setMessage({
          tone: "info",
          text: `Added ${added}. ${skippedLarge} stored as metadata only (>500KB).`,
        });
      } else {
        setMessage({
          tone: "success",
          text: `Added ${added} document${added === 1 ? "" : "s"}.`,
        });
      }
      onAdded?.();
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) void ingest(e.dataTransfer.files);
  }

  const usage = loadVault();
  void usage; // reserved for future quota UI

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        dragOver
          ? "border-neon-cyan/70 bg-neon-cyan/5"
          : "border-cyber-border bg-cyber-dark/40 hover:border-neon-cyan/40"
      }`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan">
        <UploadCloud className="h-5 w-5" />
      </div>
      <div className="mt-3 font-mono text-sm font-semibold text-text-primary">
        Drop files or{" "}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-neon-cyan underline-offset-4 hover:underline"
        >
          browse
        </button>
      </div>
      <p className="mt-1 font-mono text-[11px] text-text-secondary">
        PDF, images, or Word docs. Files &le; 500 KB are stored inline;
        larger files keep metadata only.
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1 font-mono text-[10px] text-text-muted">
        Auto-categorizes into:{" "}
        {CATEGORY_OPTIONS.map((c, i) => (
          <span key={c}>
            {CATEGORY_LABELS[c]}
            {i < CATEGORY_OPTIONS.length - 1 ? " · " : ""}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,image/*,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => e.target.files && ingest(e.target.files)}
      />

      {busy && (
        <p className="mt-3 font-mono text-[11px] text-neon-cyan">
          Saving…
        </p>
      )}
      {message && !busy && (
        <p
          className={`mt-3 font-mono text-[11px] ${
            message.tone === "error"
              ? "text-neon-red"
              : message.tone === "success"
                ? "text-neon-green"
                : "text-neon-amber"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
