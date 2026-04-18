"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useState } from "react";
import { Download, Link as LinkIcon, Check } from "lucide-react";

export function CapStatementExport() {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    if (typeof window === "undefined") return;
    window.print();
  }

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePrint}
        className="py-2.5 px-4 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-solid inline-flex items-center gap-2"
      >
        <Download className="w-3.5 h-3.5" />
        DOWNLOAD PDF
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="py-2.5 px-4 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-cyan inline-flex items-center gap-2"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <LinkIcon className="w-3.5 h-3.5" />
        )}
        {copied ? "COPIED" : "COPY LINK"}
      </button>
    </div>
  );
}
