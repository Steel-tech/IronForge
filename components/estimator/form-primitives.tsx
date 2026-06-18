// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { ReactNode } from "react";

/* Presentational primitives for the estimator form — pure, props-only. Split
 * out of estimator-form.tsx so that file stays focused on state and logic. */

export function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: "cyan" | "green" | "magenta" | "amber";
  children: ReactNode;
}) {
  const colorMap = {
    cyan: "text-neon-cyan text-glow-cyan border-neon-cyan/30",
    green: "text-neon-green text-glow-green border-neon-green/30",
    magenta: "text-neon-magenta text-glow-magenta border-neon-magenta/30",
    amber: "text-neon-amber text-glow-amber border-neon-amber/30",
  };
  return (
    <section className="relative cyber-card rounded-lg p-6 space-y-4">
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          accent === "cyan"
            ? "via-neon-cyan"
            : accent === "green"
              ? "via-neon-green"
              : accent === "magenta"
                ? "via-neon-magenta"
                : "via-neon-amber"
        }`}
      />
      <h3
        className={`text-sm font-mono font-bold tracking-[0.2em] uppercase pb-2 border-b ${colorMap[accent]}`}
      >
        ▸ {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  suffix,
  hint,
  children,
}: {
  label: string;
  suffix?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center justify-between text-[10px] font-mono font-semibold text-text-secondary mb-1.5 tracking-wider uppercase">
        <span>{label}</span>
        {suffix && <span className="text-text-muted">{suffix}</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[10px] font-mono text-text-muted mt-1">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="cyber-input"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        onChange(Number.isFinite(n) ? n : 0);
      }}
      onFocus={(e) => e.target.select()}
      min={min}
      step={step}
      className="cyber-input"
    />
  );
}

export function CheckRow({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/30 cursor-pointer transition-all group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan glow-cyan"
              : "border-cyber-border group-hover:border-cyber-border-bright"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm text-text-secondary font-mono group-hover:text-text-primary transition-colors">
          {label}
        </div>
        {sub && <div className="text-[10px] text-text-muted font-mono">{sub}</div>}
      </div>
    </label>
  );
}
