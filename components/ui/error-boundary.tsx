"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Cyberpunk-styled React error boundary. Wraps any subtree and renders
 * a "SYSTEM ERROR" screen when a child throws, with RETRY and RETURN
 * TO BASE affordances.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const message = this.state.error?.message || "Unknown system fault.";

    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black tron-grid p-6">
        <div className="max-w-xl w-full cyber-card rounded-2xl p-8 neon-border-magenta relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-red/60 to-transparent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-neon-red/10 border border-neon-red/30 animate-neon-pulse">
              <AlertTriangle className="w-6 h-6 text-neon-red" />
            </div>
            <div>
              <h1 className="font-mono text-neon-red text-xl font-bold uppercase tracking-widest text-glow-red">
                SYSTEM ERROR
              </h1>
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                An unhandled exception has occurred
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-cyber-dark border border-cyber-border">
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
              Stack trace
            </div>
            <pre className="font-mono text-xs text-neon-red/90 whitespace-pre-wrap break-words">
              {message}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 rounded-lg btn-neon-cyan font-mono text-xs font-semibold uppercase tracking-widest"
            >
              ▸ RETRY
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg border border-cyber-border bg-cyber-surface text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/40 transition-all font-mono text-xs font-semibold uppercase tracking-widest"
            >
              ◂ RETURN TO BASE
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-red/30 to-transparent" />
        </div>
      </div>
    );
  }
}
