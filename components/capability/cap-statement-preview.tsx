"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { type CapStatementData, CERT_LABELS } from "@/lib/types/cap-statement";

interface Props {
  data: CapStatementData;
}

export function CapStatementPreview({ data }: Props) {
  const activeCerts = (
    Object.keys(CERT_LABELS) as Array<keyof typeof CERT_LABELS>
  ).filter((k) => data.certifications[k]);

  const competencies = data.coreCompetencies
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const hasPastProjects = data.pastProjects.some(
    (p) => p.projectName || p.client || p.description,
  );

  return (
    <div
      id="cap-statement-printable"
      className="cap-preview bg-white text-slate-900 shadow-lg rounded-md overflow-hidden"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Header bar */}
      <div
        className="px-6 py-4 border-b-4"
        style={{ borderColor: "#0f172a", background: "#f8fafc" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logoDataUrl}
                alt="Company logo"
                className="h-14 w-14 object-contain rounded"
              />
            ) : null}
            <div>
              <h1
                className="text-2xl font-bold leading-tight tracking-tight"
                style={{ color: "#0f172a" }}
              >
                {data.companyName || "Your Company Name"}
              </h1>
              <div
                className="text-xs mt-1 uppercase tracking-wider"
                style={{ color: "#475569" }}
              >
                Capability Statement
              </div>
            </div>
          </div>
          <div
            className="text-[11px] leading-snug text-right"
            style={{ color: "#334155" }}
          >
            {data.address && <div>{data.address}</div>}
            {(data.city || data.state || data.zip) && (
              <div>
                {[data.city, data.state].filter(Boolean).join(", ")} {data.zip}
              </div>
            )}
            {data.phone && <div>{data.phone}</div>}
            {data.email && <div>{data.email}</div>}
            {data.website && <div>{data.website}</div>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 text-[12px] leading-relaxed">
        {/* About + Classifications */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <SectionHeading>Core Competencies</SectionHeading>
            {competencies.length > 0 ? (
              <ul className="list-disc pl-5 space-y-0.5">
                {competencies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic">No competencies listed</div>
            )}
            {data.differentiators && (
              <>
                <SectionHeading className="mt-4">Differentiators</SectionHeading>
                <p className="whitespace-pre-line">{data.differentiators}</p>
              </>
            )}
          </div>
          <div>
            <SectionHeading>Business Classifications</SectionHeading>
            <dl className="space-y-1">
              {data.naicsCodes && (
                <Row label="NAICS" value={data.naicsCodes} />
              )}
              {data.sicCodes && <Row label="SIC" value={data.sicCodes} />}
              {data.businessSize && (
                <Row label="Size" value={data.businessSize} />
              )}
              {data.yearEstablished && (
                <Row label="Est." value={data.yearEstablished} />
              )}
              {data.dunsNumber && <Row label="DUNS" value={data.dunsNumber} />}
              {data.cageCode && <Row label="CAGE" value={data.cageCode} />}
              {data.samUeiNumber && (
                <Row label="SAM UEI" value={data.samUeiNumber} />
              )}
              <Row
                label="SAM.gov"
                value={data.samRegistered ? "Active registration" : "—"}
              />
            </dl>

            {activeCerts.length > 0 && (
              <>
                <SectionHeading className="mt-4">Certifications</SectionHeading>
                <ul className="list-disc pl-5 space-y-0.5">
                  {activeCerts.map((k) => (
                    <li key={k}>{CERT_LABELS[k]}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Past Performance */}
        {hasPastProjects && (
          <div>
            <SectionHeading>Past Performance</SectionHeading>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr
                  className="text-left"
                  style={{ background: "#0f172a", color: "#fff" }}
                >
                  <th className="px-2 py-1.5 font-semibold">Project</th>
                  <th className="px-2 py-1.5 font-semibold">Client</th>
                  <th className="px-2 py-1.5 font-semibold">Value</th>
                  <th className="px-2 py-1.5 font-semibold">Period</th>
                </tr>
              </thead>
              <tbody>
                {data.pastProjects
                  .filter((p) => p.projectName || p.client || p.description)
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="border-b"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <td className="px-2 py-1.5 align-top">
                        <div className="font-semibold">{p.projectName || "—"}</div>
                        {p.description && (
                          <div
                            className="text-[10px] mt-0.5"
                            style={{ color: "#475569" }}
                          >
                            {p.description}
                          </div>
                        )}
                        {p.relevance && (
                          <div
                            className="text-[10px] mt-0.5 italic"
                            style={{ color: "#64748b" }}
                          >
                            Relevance: {p.relevance}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1.5 align-top">{p.client || "—"}</td>
                      <td className="px-2 py-1.5 align-top">
                        {p.contractValue || "—"}
                      </td>
                      <td className="px-2 py-1.5 align-top">
                        {p.periodOfPerformance || "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bonding & Insurance */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <SectionHeading>Bonding Capacity</SectionHeading>
            <dl className="space-y-1">
              <Row label="Single" value={data.bondingSingle || "—"} />
              <Row label="Aggregate" value={data.bondingAggregate || "—"} />
            </dl>
          </div>
          <div>
            <SectionHeading>Insurance Coverage</SectionHeading>
            <dl className="space-y-1">
              <Row label="General Liability" value={data.insuranceGL || "—"} />
              <Row label="Workers' Comp" value={data.insuranceWC || "—"} />
              <Row label="Commercial Auto" value={data.insuranceAuto || "—"} />
            </dl>
            {data.insuranceSummary && (
              <p className="mt-2 text-[11px]" style={{ color: "#475569" }}>
                {data.insuranceSummary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 text-[10px] uppercase tracking-wider text-center"
        style={{ background: "#0f172a", color: "#fff" }}
      >
        {data.companyName || "Your Company"}
        {data.phone && ` • ${data.phone}`}
        {data.email && ` • ${data.email}`}
        {data.website && ` • ${data.website}`}
      </div>
    </div>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-[11px] font-bold uppercase tracking-widest pb-1 mb-2 border-b ${className}`}
      style={{ color: "#0f172a", borderColor: "#cbd5e1" }}
    >
      {children}
    </h2>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <dt
        className="font-semibold shrink-0"
        style={{ color: "#475569", minWidth: "5.5rem" }}
      >
        {label}
      </dt>
      <dd style={{ color: "#0f172a" }}>{value}</dd>
    </div>
  );
}
