"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useRef } from "react";
import {
  type CapStatementData,
  type PastProject,
  CERT_LABELS,
  SUGGESTED_NAICS,
  emptyPastProject,
} from "@/lib/types/cap-statement";
import { STATE_REGISTRY } from "@/content/state-registry";
import { Plus, Trash2, Upload, X } from "lucide-react";

interface Props {
  data: CapStatementData;
  onChange: (data: CapStatementData) => void;
}

const INPUT_CLS =
  "w-full px-3 py-2 rounded-md bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-xs cyber-focus transition-all";
const LABEL_CLS =
  "block text-[10px] font-mono font-semibold text-text-secondary mb-1 tracking-wider uppercase";

export function CapStatementForm({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  function update<K extends keyof CapStatementData>(key: K, value: CapStatementData[K]) {
    onChange({ ...data, [key]: value });
  }

  function toggleCert(key: keyof CapStatementData["certifications"]) {
    onChange({
      ...data,
      certifications: { ...data.certifications, [key]: !data.certifications[key] },
    });
  }

  function updateProject(id: string, patch: Partial<PastProject>) {
    onChange({
      ...data,
      pastProjects: data.pastProjects.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    });
  }

  function addProject() {
    if (data.pastProjects.length >= 3) return;
    onChange({ ...data, pastProjects: [...data.pastProjects, emptyPastProject()] });
  }

  function removeProject(id: string) {
    onChange({
      ...data,
      pastProjects: data.pastProjects.filter((p) => p.id !== id),
    });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      alert("Logo must be under 512 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update("logoDataUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  const states = Object.values(STATE_REGISTRY).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-6">
      {/* ───── COMPANY INFO ───── */}
      <Section title="01 / COMPANY INFORMATION" color="cyan">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company Name" className="col-span-2">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Pacific Steel Erectors LLC"
            />
          </Field>
          <Field label="Address" className="col-span-2">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="1234 Ironworks Way, Suite 200"
            />
          </Field>
          <Field label="City">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="State">
              <select
                className={INPUT_CLS + " appearance-none cursor-pointer"}
                value={data.state}
                onChange={(e) => update("state", e.target.value)}
              >
                <option value="">—</option>
                {states.map((s) => (
                  <option key={s.code} value={s.code} className="bg-cyber-dark">
                    {s.code}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ZIP">
              <input
                type="text"
                className={INPUT_CLS}
                value={data.zip}
                onChange={(e) => update("zip", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Phone">
            <input
              type="tel"
              className={INPUT_CLS}
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={INPUT_CLS}
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="contact@company.com"
            />
          </Field>
          <Field label="Website" className="col-span-2">
            <input
              type="url"
              className={INPUT_CLS}
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://www.company.com"
            />
          </Field>
          <Field label="Year Established">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.yearEstablished}
              onChange={(e) => update("yearEstablished", e.target.value)}
              placeholder="2024"
            />
          </Field>
          <Field label="DUNS Number">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.dunsNumber}
              onChange={(e) => update("dunsNumber", e.target.value)}
            />
          </Field>
          <Field label="CAGE Code">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.cageCode}
              onChange={(e) => update("cageCode", e.target.value)}
            />
          </Field>
          <Field label="SAM.gov UEI">
            <input
              type="text"
              className={INPUT_CLS}
              value={data.samUeiNumber}
              onChange={(e) => update("samUeiNumber", e.target.value)}
            />
          </Field>

          <Field label="Company Logo" className="col-span-2">
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 rounded-md border border-cyber-border text-neon-cyan font-mono text-[11px] hover:border-neon-cyan/50 transition-all inline-flex items-center gap-2"
              >
                <Upload className="w-3 h-3" /> UPLOAD
              </button>
              {data.logoDataUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.logoDataUrl}
                    alt="logo preview"
                    className="h-10 w-10 object-contain rounded border border-cyber-border bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => update("logoDataUrl", "")}
                    className="text-text-muted hover:text-neon-red"
                    aria-label="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </Field>
        </div>
      </Section>

      {/* ───── CLASSIFICATIONS ───── */}
      <Section title="02 / BUSINESS CLASSIFICATIONS" color="magenta">
        <Field label="NAICS Codes (comma-separated)">
          <input
            type="text"
            className={INPUT_CLS}
            value={data.naicsCodes}
            onChange={(e) => update("naicsCodes", e.target.value)}
            placeholder="238120, 238190, 332312"
          />
          <div className="mt-2 space-y-1">
            {SUGGESTED_NAICS.map((n) => (
              <div
                key={n.code}
                className="text-[10px] font-mono text-text-muted"
              >
                <span className="text-neon-green">{n.code}</span> — {n.desc}
              </div>
            ))}
          </div>
        </Field>

        <Field label="SIC Codes">
          <input
            type="text"
            className={INPUT_CLS}
            value={data.sicCodes}
            onChange={(e) => update("sicCodes", e.target.value)}
            placeholder="1791, 3441"
          />
        </Field>

        <Field label="Business Size">
          <div className="flex gap-2">
            {(["Small", "Large", "Other"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => update("businessSize", size)}
                className={`px-3 py-2 rounded-md border font-mono text-[11px] transition-all ${
                  data.businessSize === size
                    ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan glow-cyan"
                    : "border-cyber-border text-text-secondary hover:border-cyber-border-bright"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Certifications">
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(CERT_LABELS) as Array<keyof typeof CERT_LABELS>).map(
              (key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 rounded-md border border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/30 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={data.certifications[key]}
                    onChange={() => toggleCert(key)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                      data.certifications[key]
                        ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                        : "border-cyber-border"
                    }`}
                  >
                    {data.certifications[key] && (
                      <svg
                        className="w-2.5 h-2.5"
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
                  <span className="text-[11px] font-mono text-text-secondary">
                    {CERT_LABELS[key]}
                  </span>
                </label>
              ),
            )}
          </div>
        </Field>

        <Field label="SAM.gov Registered">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.samRegistered}
              onChange={(e) => update("samRegistered", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                data.samRegistered
                  ? "bg-neon-green/20 border-neon-green text-neon-green"
                  : "border-cyber-border"
              }`}
            >
              {data.samRegistered && (
                <svg
                  className="w-2.5 h-2.5"
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
            <span className="text-[11px] font-mono text-text-secondary">
              Active registration in SAM.gov
            </span>
          </label>
        </Field>
      </Section>

      {/* ───── CORE COMPETENCIES ───── */}
      <Section title="03 / CORE COMPETENCIES" color="green">
        <Field label="Core Competencies">
          <textarea
            className={INPUT_CLS + " min-h-[100px] resize-y"}
            value={data.coreCompetencies}
            onChange={(e) => update("coreCompetencies", e.target.value)}
            placeholder="Structural Steel Erection, Steel Joist & Deck Installation, ..."
          />
        </Field>

        <Field label="Differentiators">
          <textarea
            className={INPUT_CLS + " min-h-[80px] resize-y"}
            value={data.differentiators}
            onChange={(e) => update("differentiators", e.target.value)}
            placeholder="What sets your company apart — certifications, experience, equipment, safety record, etc."
          />
        </Field>
      </Section>

      {/* ───── PAST PERFORMANCE ───── */}
      <Section title="04 / PAST PERFORMANCE" color="amber">
        <div className="space-y-4">
          {data.pastProjects.map((p, i) => (
            <div
              key={p.id}
              className="p-3 rounded-md border border-cyber-border bg-cyber-dark/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neon-amber tracking-wider">
                  PROJECT {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => removeProject(p.id)}
                  className="text-text-muted hover:text-neon-red transition-colors"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Project Name" className="col-span-2">
                  <input
                    className={INPUT_CLS}
                    value={p.projectName}
                    onChange={(e) =>
                      updateProject(p.id, { projectName: e.target.value })
                    }
                  />
                </Field>
                <Field label="Client / Agency">
                  <input
                    className={INPUT_CLS}
                    value={p.client}
                    onChange={(e) =>
                      updateProject(p.id, { client: e.target.value })
                    }
                  />
                </Field>
                <Field label="Contract Value">
                  <input
                    className={INPUT_CLS}
                    value={p.contractValue}
                    onChange={(e) =>
                      updateProject(p.id, { contractValue: e.target.value })
                    }
                    placeholder="$1.2M"
                  />
                </Field>
                <Field label="Period of Performance" className="col-span-2">
                  <input
                    className={INPUT_CLS}
                    value={p.periodOfPerformance}
                    onChange={(e) =>
                      updateProject(p.id, { periodOfPerformance: e.target.value })
                    }
                    placeholder="Jan 2023 – Aug 2023"
                  />
                </Field>
                <Field label="Description" className="col-span-2">
                  <textarea
                    className={INPUT_CLS + " min-h-[60px] resize-y"}
                    value={p.description}
                    onChange={(e) =>
                      updateProject(p.id, { description: e.target.value })
                    }
                  />
                </Field>
                <Field label="Relevance" className="col-span-2">
                  <textarea
                    className={INPUT_CLS + " min-h-[50px] resize-y"}
                    value={p.relevance}
                    onChange={(e) =>
                      updateProject(p.id, { relevance: e.target.value })
                    }
                    placeholder="Why this project demonstrates capability for target work"
                  />
                </Field>
              </div>
            </div>
          ))}

          {data.pastProjects.length < 3 && (
            <button
              type="button"
              onClick={addProject}
              className="w-full py-2 rounded-md border border-dashed border-cyber-border hover:border-neon-amber/50 text-text-muted hover:text-neon-amber font-mono text-[11px] transition-all inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-3 h-3" /> ADD PROJECT
            </button>
          )}
        </div>
      </Section>

      {/* ───── BONDING / INSURANCE ───── */}
      <Section title="05 / BONDING & INSURANCE" color="cyan">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bonding Capacity — Single">
            <input
              className={INPUT_CLS}
              value={data.bondingSingle}
              onChange={(e) => update("bondingSingle", e.target.value)}
              placeholder="$500,000"
            />
          </Field>
          <Field label="Bonding Capacity — Aggregate">
            <input
              className={INPUT_CLS}
              value={data.bondingAggregate}
              onChange={(e) => update("bondingAggregate", e.target.value)}
              placeholder="$2,000,000"
            />
          </Field>
          <Field label="General Liability Limits">
            <input
              className={INPUT_CLS}
              value={data.insuranceGL}
              onChange={(e) => update("insuranceGL", e.target.value)}
              placeholder="$1M / $2M"
            />
          </Field>
          <Field label="Workers' Comp">
            <input
              className={INPUT_CLS}
              value={data.insuranceWC}
              onChange={(e) => update("insuranceWC", e.target.value)}
              placeholder="Statutory"
            />
          </Field>
          <Field label="Commercial Auto">
            <input
              className={INPUT_CLS}
              value={data.insuranceAuto}
              onChange={(e) => update("insuranceAuto", e.target.value)}
              placeholder="$1M CSL"
            />
          </Field>
          <Field label="Additional Coverage Notes" className="col-span-2">
            <textarea
              className={INPUT_CLS + " min-h-[60px] resize-y"}
              value={data.insuranceSummary}
              onChange={(e) => update("insuranceSummary", e.target.value)}
              placeholder="Umbrella, Inland Marine, Professional, etc."
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: "cyan" | "magenta" | "green" | "amber";
  children: React.ReactNode;
}) {
  const colorMap = {
    cyan: "text-neon-cyan border-neon-cyan/30",
    magenta: "text-neon-magenta border-neon-magenta/30",
    green: "text-neon-green border-neon-green/30",
    amber: "text-neon-amber border-neon-amber/30",
  }[color];

  return (
    <div className="cyber-card rounded-lg p-4 relative">
      <h3
        className={`font-mono text-xs font-semibold tracking-widest uppercase pb-2 mb-3 border-b ${colorMap}`}
      >
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className={LABEL_CLS}>{label}</label>
      {children}
    </div>
  );
}
