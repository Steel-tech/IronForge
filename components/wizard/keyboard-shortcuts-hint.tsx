"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useState } from "react";

export function KeyboardShortcutsHint() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
    }
  }, []);

  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <div
      className="mt-6 pt-4 border-t border-cyber-border/40 text-[10px] font-mono text-text-muted flex flex-wrap gap-x-4 gap-y-1 items-center"
      aria-label="Keyboard shortcuts"
    >
      <span className="uppercase tracking-widest text-text-muted/80">
        Shortcuts:
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          ←
        </kbd>{" "}
        /{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          [
        </kbd>{" "}
        Prev
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          →
        </kbd>{" "}
        /{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          ]
        </kbd>{" "}
        Next
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          {modKey}
        </kbd>{" "}
        +{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          /
        </kbd>{" "}
        Toggle chat
      </span>
      <span>
        <kbd className="px-1.5 py-0.5 rounded border border-cyber-border bg-cyber-dark text-text-secondary">
          Esc
        </kbd>{" "}
        Close chat
      </span>
    </div>
  );
}
