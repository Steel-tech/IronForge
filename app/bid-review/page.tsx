"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Scan,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { TronGrid } from "@/components/ui/tron-grid";
import { DecryptedText } from "@/components/ui/decrypted-text";
import { ReviewResults } from "@/components/bid-review/review-results";

const MIN_CHARS = 200;
const MAX_CHARS = 60_000;

export default function BidReviewPage() {
  const [contractText, setContractText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "IronForge — Bid Review Scanner";
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /**
   * Accepts a plain-text contract file (.txt/.md). PDF parsing is not
   * handled client-side — we tell the user to paste for those.
   */
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File is larger than 2MB. Try pasting the relevant sections.");
      return;
    }

    if (!/\.(txt|md|text)$/i.test(file.name)) {
      setError(
        "Only .txt or .md files supported. For PDFs, copy the text and paste below."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setContractText(text.slice(0, MAX_CHARS));
      setFileName(file.name);
      setError(null);
    };
    reader.onerror = () => {
      setError("Could not read file.");
    };
    reader.readAsText(file);
  }

  function handleClearFile() {
    setFileName(null);
    setContractText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleScan() {
    setError(null);
    const trimmed = contractText.trim();
    if (trimmed.length < MIN_CHARS) {
      setError(
        `Paste more of the contract — need at least ${MIN_CHARS} characters (currently ${trimmed.length}).`
      );
      return;
    }

    setAnalysis("");
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/bid-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(
          typeof payload.error === "string"
            ? payload.error
            : "Analysis failed. Try again in a moment."
        );
        return;
      }
      if (!res.body) {
        setError("No response body.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const event = JSON.parse(data);
            if (event.text) {
              acc += event.text;
              setAnalysis(acc);
            }
            if (event.error) {
              setError(event.error);
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || "Unknown error during analysis.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
  }

  const charsUsed = contractText.length;
  const pctUsed = Math.min(100, (charsUsed / MAX_CHARS) * 100);
  const canScan = charsUsed >= MIN_CHARS && !isStreaming;

  return (
    <div className="min-h-screen bg-cyber-black relative">
      <MatrixRain opacity={0.04} speed={0.6} />
      <TronGrid />

      {/* Header */}
      <header className="relative z-10 border-b border-cyber-border bg-cyber-darker/80 backdrop-blur sticky top-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-neon-cyan font-mono text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> IRONFORGE
          </Link>
          <div className="flex items-center gap-3">
            <IBeamIcon className="w-5 h-5 text-neon-magenta" />
            <div className="text-right">
              <div className="font-mono text-[10px] text-neon-magenta tracking-widest uppercase">
                <DecryptedText
                  text="AI ANALYSIS"
                  speed={30}
                  revealIterations={2}
                  className=""
                />
              </div>
              <div className="font-mono font-bold text-text-primary text-sm tracking-wide">
                BID REVIEW SCANNER
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-text-primary">
            CONTRACT{" "}
            <span className="text-neon-magenta text-glow-magenta">SCANNER</span>
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
            Paste a subcontract or steel erection agreement. The AI flags
            pay-if-paid, broad-form indemnification, unlimited LDs, and 10
            other risks before you sign.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-text-muted px-3 py-1 rounded-full border border-cyber-border bg-cyber-dark">
            <span>⚠️</span>
            <span>
              Educational analysis only — not legal advice. Have a construction
              attorney review before signing.
            </span>
          </div>
        </div>

        {/* Input area */}
        <div className="bg-cyber-darker border border-cyber-border rounded-xl p-5 space-y-4 animate-fade-in-up stagger-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-mono font-semibold text-neon-cyan tracking-wider uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contract Text
            </h2>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-neon-cyan cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload .txt
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.text,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <button
                  onClick={handleClearFile}
                  className="inline-flex items-center gap-1 text-xs font-mono text-text-muted hover:text-neon-red transition-colors"
                >
                  <X className="w-3 h-3" />
                  {fileName}
                </button>
              )}
            </div>
          </div>

          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste the full subcontract text here. For PDFs, open in a reader, select all, copy, paste.&#10;&#10;Example: ARTICLE 1 - SCOPE OF WORK. The Subcontractor shall furnish all labor, materials, equipment..."
            rows={14}
            className="w-full px-3 py-2.5 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-xs resize-y cyber-focus transition-all min-h-[280px]"
            disabled={isStreaming}
          />

          {/* Char progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>
                {charsUsed.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
                {charsUsed < MIN_CHARS &&
                  ` (min ${MIN_CHARS} to scan)`}
              </span>
              {charsUsed > MAX_CHARS * 0.9 && (
                <span className="text-neon-amber">Approaching limit</span>
              )}
            </div>
            <div className="h-1 bg-cyber-border/40 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${pctUsed}%`,
                  background:
                    charsUsed >= MIN_CHARS
                      ? "linear-gradient(to right, var(--color-neon-cyan, #00f0ff), var(--color-neon-magenta, #ff00c8))"
                      : "rgba(255,255,255,0.25)",
                }}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-neon-red/40 bg-neon-red/5 p-3 text-xs font-mono text-neon-red">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] font-mono text-text-muted">
              Rate limit: 5 scans per minute per IP.
            </div>
            {isStreaming ? (
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-cyan inline-flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                CANCEL SCAN
              </button>
            ) : (
              <button
                onClick={handleScan}
                disabled={!canScan}
                className="px-5 py-2.5 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-magenta disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Scan className="w-4 h-4" />
                SCAN CONTRACT
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {(analysis || isStreaming) && (
          <div className="animate-fade-in-up">
            <ReviewResults analysis={analysis} isStreaming={isStreaming} />
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="text-center text-[10px] font-mono text-text-muted pb-8 pt-4 border-t border-cyber-border">
          IronForge Bid Review is an educational tool. Always consult a
          licensed construction attorney in your state before signing.
        </div>
      </main>
    </div>
  );
}
