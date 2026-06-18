"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useMemo } from "react";
import { STATE_REGISTRY } from "@/content/state-registry";
import {
  Section,
  Field,
  TextInput,
  NumberInput,
  CheckRow,
} from "./form-primitives";
import {
  CRANE_DAY_RATES,
  type CraneType,
  type EstimateInput,
  type ProjectType,
} from "@/lib/types/estimator";

const PROJECT_TYPES: ProjectType[] = [
  "Commercial",
  "Industrial",
  "Bridge/Highway",
  "Residential",
  "Miscellaneous Metals",
];

const CRANE_TYPES: {
  value: CraneType;
  label: string;
  desc: string;
}[] = [
  { value: "None", label: "None", desc: "No crane required" },
  { value: "Hydraulic", label: "Hydraulic (small)", desc: "Up to ~40 ton" },
  { value: "Crawler", label: "Crawler (medium)", desc: "50-150 ton" },
  { value: "Tower", label: "Tower (large)", desc: "High-rise / long reach" },
];

const ALL_STATES = Object.values(STATE_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name)
);

interface Props {
  input: EstimateInput;
  onChange: (next: EstimateInput) => void;
}

export function EstimatorForm({ input, onChange }: Props) {
  const stateData = input.state ? STATE_REGISTRY[input.state] : undefined;

  // When state changes, pre-fill wage rate (if prevailing-wage state we
  // bump the default a bit) and reflect in form.
  useEffect(() => {
    if (!stateData) return;
    // Only update if wage is still at default 42 — don't override user edits.
    if (input.baseWageRate !== 42 && input.baseWageRate !== 48) return;
    const suggested = stateData.hasStatePrevailingWage ? 48 : 42;
    if (input.baseWageRate !== suggested) {
      onChange({ ...input, baseWageRate: suggested });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.state]);

  const unionLocal = useMemo(() => {
    if (!stateData?.ironworkersLocals?.length) return null;
    return stateData.ironworkersLocals[0];
  }, [stateData]);

  function update<K extends keyof EstimateInput>(
    key: K,
    value: EstimateInput[K]
  ) {
    onChange({ ...input, [key]: value });
  }

  function updateCrane(type: CraneType) {
    onChange({
      ...input,
      craneType: type,
      craneRate: CRANE_DAY_RATES[type],
    });
  }

  return (
    <div className="space-y-8">
      {/* ═══════════ PROJECT INFO ═══════════ */}
      <Section title="Project Info" accent="cyan">
        <Field label="Project Name">
          <TextInput
            value={input.projectName}
            onChange={(v) => update("projectName", v)}
            placeholder="e.g., Tower Crane Office Complex"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Location / State">
            <select
              value={input.state}
              onChange={(e) => update("state", e.target.value)}
              className="cyber-input appearance-none cursor-pointer"
            >
              <option value="" className="bg-cyber-dark">
                Select state...
              </option>
              {ALL_STATES.map((s) => (
                <option key={s.code} value={s.code} className="bg-cyber-dark">
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
            {stateData?.hasStatePrevailingWage && (
              <p className="text-[10px] font-mono text-neon-amber mt-1">
                ⚡ Prevailing wage state — {stateData.prevailingWageThreshold}
              </p>
            )}
          </Field>

          <Field label="Project Type">
            <select
              value={input.projectType}
              onChange={(e) =>
                update("projectType", e.target.value as ProjectType)
              }
              className="cyber-input appearance-none cursor-pointer"
            >
              {PROJECT_TYPES.map((p) => (
                <option key={p} value={p} className="bg-cyber-dark">
                  {p}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* ═══════════ SCOPE ═══════════ */}
      <Section title="Scope of Work" accent="green">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Total Tonnage" suffix="tons">
            <NumberInput
              value={input.tonnage}
              onChange={(v) => update("tonnage", v)}
              min={0}
              step={1}
            />
          </Field>
          <Field label="Floors / Levels">
            <NumberInput
              value={input.floors}
              onChange={(v) => update("floors", v)}
              min={1}
              step={1}
            />
          </Field>
          <Field label="Beam / Column Count">
            <NumberInput
              value={input.beamCount}
              onChange={(v) => update("beamCount", v)}
              min={0}
              step={1}
            />
          </Field>
        </div>

        <div className="space-y-3">
          <CheckRow
            label="Includes decking"
            checked={input.includesDecking}
            onChange={(v) => update("includesDecking", v)}
          />
          {input.includesDecking && (
            <div className="ml-8">
              <Field label="Decking Square Footage" suffix="sqft">
                <NumberInput
                  value={input.deckingSqft}
                  onChange={(v) => update("deckingSqft", v)}
                  min={0}
                  step={100}
                />
              </Field>
            </div>
          )}
          <CheckRow
            label="Includes stairs / rails"
            checked={input.includesStairs}
            onChange={(v) => update("includesStairs", v)}
          />
          <CheckRow
            label="Includes miscellaneous metals"
            checked={input.includesMisc}
            onChange={(v) => update("includesMisc", v)}
          />
        </div>
      </Section>

      {/* ═══════════ LABOR ═══════════ */}
      <Section title="Labor" accent="magenta">
        <div className="flex items-center gap-4 p-3 rounded-lg border border-cyber-border bg-cyber-dark/50">
          <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
            Workforce:
          </span>
          <div className="flex rounded-lg overflow-hidden border border-cyber-border">
            <button
              type="button"
              onClick={() => update("isUnion", true)}
              className={`px-4 py-2 text-xs font-mono transition-all ${
                input.isUnion
                  ? "bg-neon-cyan/20 text-neon-cyan border-r border-neon-cyan/40"
                  : "text-text-muted hover:text-text-primary border-r border-cyber-border"
              }`}
            >
              UNION
            </button>
            <button
              type="button"
              onClick={() => update("isUnion", false)}
              className={`px-4 py-2 text-xs font-mono transition-all ${
                !input.isUnion
                  ? "bg-neon-magenta/20 text-neon-magenta"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              NON-UNION
            </button>
          </div>
        </div>

        {input.isUnion && unionLocal && (
          <div className="p-3 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">
              Signatory Local
            </div>
            <div className="text-sm font-mono text-neon-cyan text-glow-cyan">
              {unionLocal.name}
            </div>
            <div className="text-[11px] font-mono text-text-secondary">
              {unionLocal.city} • {unionLocal.phone}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Base Journeyman Wage"
            suffix="$/hr"
            hint={
              stateData?.hasStatePrevailingWage
                ? "Pre-filled w/ prevailing-wage premium"
                : undefined
            }
          >
            <NumberInput
              value={input.baseWageRate}
              onChange={(v) => update("baseWageRate", v)}
              min={0}
              step={0.5}
            />
          </Field>
          <Field label="Foreman Premium" suffix="%">
            <NumberInput
              value={input.foremanPremium}
              onChange={(v) => update("foremanPremium", v)}
              min={0}
              step={1}
            />
          </Field>
          <Field label="Crew Size">
            <NumberInput
              value={input.crewSize}
              onChange={(v) => update("crewSize", v)}
              min={1}
              step={1}
            />
          </Field>
          <Field label="Duration" suffix="weeks">
            <NumberInput
              value={input.durationWeeks}
              onChange={(v) => update("durationWeeks", v)}
              min={0}
              step={0.5}
            />
          </Field>
        </div>
      </Section>

      {/* ═══════════ EQUIPMENT ═══════════ */}
      <Section title="Equipment" accent="amber">
        <Field label="Crane Type">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CRANE_TYPES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => updateCrane(c.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  input.craneType === c.value
                    ? "border-neon-amber bg-neon-amber/10 text-neon-amber"
                    : "border-cyber-border bg-cyber-dark/50 text-text-secondary hover:border-cyber-border-bright hover:text-text-primary"
                }`}
              >
                <div className="text-xs font-mono font-bold">{c.label}</div>
                <div className="text-[10px] text-text-muted mt-1 font-mono">
                  {c.desc}
                </div>
                <div className="text-[10px] font-mono mt-1 text-neon-amber/80">
                  ${CRANE_DAY_RATES[c.value].toLocaleString()}/day
                </div>
              </button>
            ))}
          </div>
        </Field>

        {input.craneType !== "None" && (
          <Field label="Crane Rental Rate" suffix="$/day">
            <NumberInput
              value={input.craneRate}
              onChange={(v) => update("craneRate", v)}
              min={0}
              step={100}
            />
          </Field>
        )}

        <div className="space-y-2">
          <CheckRow
            label="Boom lift / man-lift needed"
            sub="$800/week default"
            checked={input.needsLift}
            onChange={(v) => update("needsLift", v)}
          />
          <CheckRow
            label="Welding equipment"
            sub="$200/week default"
            checked={input.needsWelding}
            onChange={(v) => update("needsWelding", v)}
          />
        </div>
      </Section>
    </div>
  );
}

