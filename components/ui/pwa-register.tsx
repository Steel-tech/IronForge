"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "ironforge-pwa-install-dismissed-at";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Registers the service worker and surfaces a cyberpunk "install" banner
 * when the browser fires `beforeinstallprompt`. Dismissals are remembered
 * for 7 days via localStorage.
 */
export function PwaRegister() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register the service worker (only in production builds — avoids dev HMR noise).
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const register = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          /* non-fatal */
        });
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register, { once: true });
    }

    // beforeinstallprompt handler
    const onPrompt = (event: Event) => {
      event.preventDefault();
      const dismissedAt = Number(
        localStorage.getItem(DISMISS_KEY) ?? "0",
      );
      if (
        Number.isFinite(dismissedAt) &&
        Date.now() - dismissedAt < DISMISS_MS
      ) {
        return;
      }
      setPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setPrompt(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.finally(() => {
      setPrompt(null);
      setVisible(false);
    });
  }

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage unavailable — ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install IronForge"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-md"
    >
      <div className="cyber-card relative flex items-center gap-3 rounded-lg border border-neon-cyan/40 bg-cyber-dark/95 px-4 py-3 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan">
          <Download className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-xs font-semibold tracking-wider text-neon-cyan text-glow-cyan">
            INSTALL IRONFORGE
          </div>
          <div className="mt-0.5 truncate font-mono text-[11px] text-text-secondary">
            Add to home screen for offline access.
          </div>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded border border-neon-cyan/50 bg-neon-cyan/10 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          INSTALL
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="rounded p-1 text-text-muted transition-colors hover:text-neon-cyan"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
