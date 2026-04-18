"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { Toaster } from "sonner";

/**
 * Cyberpunk-themed toast provider wrapping Sonner's Toaster.
 *
 * Colors are wired up via `toastOptions.classNames` so Tailwind utility
 * classes (backed by the IronForge theme) drive the look. Individual
 * `toast.success/.error/.info` calls inherit the intent-specific classes.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "!bg-cyber-dark !border !border-cyber-border !text-text-primary !font-mono !text-xs !rounded-lg !shadow-[0_0_20px_rgba(0,0,0,0.5)]",
          title: "!text-text-primary !font-semibold",
          description: "!text-text-secondary",
          actionButton:
            "!bg-neon-cyan/10 !text-neon-cyan !border !border-neon-cyan/30 !font-mono !text-xs",
          cancelButton:
            "!bg-cyber-surface !text-text-secondary !border !border-cyber-border !font-mono !text-xs",
          closeButton:
            "!bg-cyber-surface !text-text-secondary !border !border-cyber-border hover:!text-neon-cyan",
          success:
            "!border-neon-green/50 !text-neon-green [&_[data-icon]]:!text-neon-green [&_[data-title]]:!text-neon-green",
          error:
            "!border-neon-red/50 !text-neon-red [&_[data-icon]]:!text-neon-red [&_[data-title]]:!text-neon-red",
          info:
            "!border-neon-cyan/50 !text-neon-cyan [&_[data-icon]]:!text-neon-cyan [&_[data-title]]:!text-neon-cyan",
          warning:
            "!border-neon-amber/50 !text-neon-amber [&_[data-icon]]:!text-neon-amber [&_[data-title]]:!text-neon-amber",
        },
        style: {
          background: "#12121c",
          border: "1px solid #2a2a40",
          color: "#e0e0f0",
        },
      }}
    />
  );
}
