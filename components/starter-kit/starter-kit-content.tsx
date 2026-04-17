"use client";

import { useMemo } from "react";
import type { Phase, Step, CostRange, Resource } from "@/lib/types/content";
import type { UserState } from "@/lib/types/wizard";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import { STATE_REGISTRY, type StateData } from "@/content/state-registry";

interface Props {
  userState: UserState;
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n === 0) return "$0";
  return "$" + n.toLocaleString("en-US");
}

function sumCostRange(steps: Step[]): { min: number; max: number } {
  return steps.reduce(
    (acc, s) => ({
      min: acc.min + (s.estimatedCost?.min ?? 0),
      max: acc.max + (s.estimatedCost?.max ?? 0),
    }),
    { min: 0, max: 0 },
  );
}

function fmtRange(r: CostRange | { min: number; max: number }): string {
  if (r.min === 0 && r.max === 0) return "Free";
  if (r.min === r.max) return fmtCurrency(r.min);
  return `${fmtCurrency(r.min)} – ${fmtCurrency(r.max)}`;
}

function isCompleted(
  userState: UserState,
  phaseId: string,
  stepId: string,
  itemId: string,
): boolean {
  return Boolean(
    userState.progress?.[phaseId]?.[stepId]?.completedChecklist?.includes(
      itemId,
    ),
  );
}

// ─────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────

export function StarterKitContent({ userState }: Props) {
  const stateCode = (userState.profile.state ?? "WA") as StateCode;
  const stateData: StateData | undefined = STATE_REGISTRY[stateCode];

  const phases = useMemo<Phase[]>(() => {
    return PHASE_DEFINITIONS.map((def) =>
      getPhaseContent(def.id, stateCode),
    );
  }, [stateCode]);

  const phaseCosts = useMemo(() => {
    return phases.map((p) => ({
      id: p.id,
      title: p.title,
      cost: sumCostRange(p.steps),
    }));
  }, [phases]);

  const totalCost = useMemo(() => {
    return phaseCosts.reduce(
      (acc, p) => ({
        min: acc.min + p.cost.min,
        max: acc.max + p.cost.max,
      }),
      { min: 0, max: 0 },
    );
  }, [phaseCosts]);

  const allResources = useMemo(() => {
    return phases.map((p) => ({
      id: p.id,
      title: p.title,
      resources: p.steps.flatMap((s) =>
        s.resources.map((r) => ({ ...r, stepTitle: s.title })),
      ),
    }));
  }, [phases]);

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bizName = userState.profile.businessName || "[Your Business Name]";

  return (
    <div id="starter-kit-printable" className="starter-kit">
      {/* ══════════════════════════════════════════════
          COVER PAGE
          ══════════════════════════════════════════════ */}
      <section className="sk-page sk-cover">
        <div className="sk-cover-inner">
          <div className="sk-cover-tag">IRONFORGE</div>
          <h1 className="sk-cover-title">
            CONTRACTOR
            <br />
            STARTER KIT
          </h1>
          <div className="sk-cover-divider" />
          <div className="sk-cover-meta">
            <div>
              <div className="sk-cover-meta-label">BUSINESS</div>
              <div className="sk-cover-meta-value">{bizName}</div>
            </div>
            <div>
              <div className="sk-cover-meta-label">STATE</div>
              <div className="sk-cover-meta-value">
                {stateData ? `${stateData.name} (${stateData.code})` : "—"}
              </div>
            </div>
            <div>
              <div className="sk-cover-meta-label">GENERATED</div>
              <div className="sk-cover-meta-value">{generatedDate}</div>
            </div>
          </div>
          <div className="sk-cover-footer">
            A step-by-step printable binder for launching your ironwork
            contracting business — licensing, bonding, insurance,
            certifications, and union pathways.
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TABLE OF CONTENTS
          ══════════════════════════════════════════════ */}
      <section className="sk-page">
        <h2 className="sk-h1">Table of Contents</h2>
        <ol className="sk-toc">
          {phases.map((p, i) => (
            <li key={p.id}>
              <span className="sk-toc-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sk-toc-title">{p.title}</span>
              <span className="sk-toc-dots" />
              <span className="sk-toc-note">
                {p.steps.length} step{p.steps.length === 1 ? "" : "s"}
              </span>
            </li>
          ))}
          <li>
            <span className="sk-toc-num">
              {String(phases.length + 1).padStart(2, "0")}
            </span>
            <span className="sk-toc-title">State Reference Card</span>
            <span className="sk-toc-dots" />
          </li>
          <li>
            <span className="sk-toc-num">
              {String(phases.length + 2).padStart(2, "0")}
            </span>
            <span className="sk-toc-title">Resource Directory</span>
            <span className="sk-toc-dots" />
          </li>
          <li>
            <span className="sk-toc-num">
              {String(phases.length + 3).padStart(2, "0")}
            </span>
            <span className="sk-toc-title">Cost Summary</span>
            <span className="sk-toc-dots" />
          </li>
        </ol>
      </section>

      {/* ══════════════════════════════════════════════
          PHASE CHECKLISTS
          ══════════════════════════════════════════════ */}
      {phases.map((phase, idx) => (
        <section key={phase.id} className="sk-page">
          <div className="sk-phase-header">
            <div className="sk-phase-num">
              PHASE {String(idx + 1).padStart(2, "0")}
            </div>
            <h2 className="sk-h1">{phase.title}</h2>
            <p className="sk-lede">{phase.description}</p>
          </div>

          {phase.steps.map((step, sIdx) => (
            <div key={step.id} className="sk-step">
              <div className="sk-step-header">
                <h3 className="sk-h2">
                  {String(idx + 1).padStart(2, "0")}.
                  {String(sIdx + 1).padStart(2, "0")} {step.title}
                </h3>
                <div className="sk-step-meta">
                  <span>
                    <strong>Time:</strong> {step.estimatedTime || "—"}
                  </span>
                  <span>
                    <strong>Cost:</strong> {fmtRange(step.estimatedCost)}
                  </span>
                </div>
              </div>

              {step.description && (
                <p className="sk-step-desc">{step.description}</p>
              )}

              {step.checklist.length > 0 && (
                <>
                  <div className="sk-subheading">Checklist</div>
                  <ul className="sk-checklist">
                    {step.checklist.map((item) => {
                      const done = isCompleted(
                        userState,
                        phase.id,
                        step.id,
                        item.id,
                      );
                      return (
                        <li key={item.id}>
                          <span
                            className={`sk-check ${done ? "sk-check-done" : ""}`}
                            aria-hidden
                          >
                            {done ? "☑" : "☐"}
                          </span>
                          <div className="sk-check-body">
                            <div className="sk-check-label">
                              {item.label}
                              {item.required && (
                                <span className="sk-req">REQUIRED</span>
                              )}
                            </div>
                            {item.description && (
                              <div className="sk-check-desc">
                                {item.description}
                              </div>
                            )}
                            {item.link && (
                              <div className="sk-check-link">{item.link}</div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {step.tips.length > 0 && (
                <div className="sk-callout sk-callout-tip">
                  <div className="sk-callout-label">TIPS</div>
                  <ul>
                    {step.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {step.warnings.length > 0 && (
                <div className="sk-callout sk-callout-warn">
                  <div className="sk-callout-label">WARNINGS</div>
                  <ul>
                    {step.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {step.resources.length > 0 && (
                <div className="sk-resources">
                  <div className="sk-subheading">Top Resources</div>
                  <ol>
                    {step.resources.slice(0, 3).map((r, i) => (
                      <li key={i}>
                        <span className="sk-res-type">[{r.type}]</span>{" "}
                        <strong>{r.title}</strong>
                        {r.description && (
                          <span className="sk-res-desc"> — {r.description}</span>
                        )}
                        <div className="sk-res-url">{r.url}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </section>
      ))}

      {/* ══════════════════════════════════════════════
          STATE REFERENCE CARD
          ══════════════════════════════════════════════ */}
      {stateData && (
        <section className="sk-page">
          <h2 className="sk-h1">State Reference Card</h2>
          <div className="sk-ref-subtitle">
            {stateData.name} ({stateData.code}) — Quick Reference
          </div>

          <div className="sk-ref-grid">
            <RefBlock title="Business Formation">
              <RefRow
                label="LLC Filing Fee"
                value={fmtCurrency(stateData.llcFilingFee)}
              />
              <RefRow
                label="Annual Report"
                value={`${stateData.annualReportName} — ${fmtCurrency(stateData.annualReportFee)}`}
              />
              <RefRow label="SoS Filing" value={stateData.llcFilingUrl} mono />
            </RefBlock>

            <RefBlock title="Taxes">
              <RefRow
                label="Income Tax"
                value={stateData.incomeTaxRate}
              />
              <RefRow
                label="Sales Tax"
                value={
                  stateData.hasSalesTax
                    ? stateData.salesTaxDetails
                    : "None"
                }
              />
              <RefRow label="Agency" value={stateData.taxAgency} />
              <RefRow
                label="Register"
                value={stateData.taxRegistrationUrl}
                mono
              />
            </RefBlock>

            <RefBlock title="Contractor License">
              <RefRow
                label="Required?"
                value={stateData.hasStateLicense ? "YES" : "NO"}
              />
              {stateData.hasStateLicense && (
                <>
                  <RefRow label="Agency" value={stateData.licensingAgency} />
                  <RefRow
                    label="Fee"
                    value={fmtRange(stateData.licensingFee)}
                  />
                  <RefRow
                    label="Exam"
                    value={stateData.examRequired ? "Required" : "Not required"}
                  />
                  <RefRow
                    label="Notes"
                    value={stateData.licensingNotes}
                  />
                  <RefRow
                    label="Apply"
                    value={stateData.licensingUrl}
                    mono
                  />
                </>
              )}
            </RefBlock>

            <RefBlock title="Workers' Compensation">
              <RefRow
                label="Type"
                value={
                  stateData.wcType === "monopolistic"
                    ? "MONOPOLISTIC (state fund only)"
                    : stateData.wcType === "competitive"
                      ? "Competitive state fund"
                      : "Private market"
                }
              />
              <RefRow label="Agency" value={stateData.wcAgency} />
              <RefRow label="Notes" value={stateData.wcNotes} />
              <RefRow label="Website" value={stateData.wcAgencyUrl} mono />
            </RefBlock>

            <RefBlock title="Surety Bond">
              <RefRow
                label="State Bond"
                value={
                  stateData.stateBondRequired
                    ? stateData.stateBondAmount
                    : "Not required by state"
                }
              />
              <RefRow label="Notes" value={stateData.bondNotes} />
            </RefBlock>

            <RefBlock title="Prevailing Wage">
              <RefRow
                label="State PW"
                value={stateData.hasStatePrevailingWage ? "YES" : "NO"}
              />
              {stateData.hasStatePrevailingWage && (
                <>
                  <RefRow
                    label="Agency"
                    value={stateData.prevailingWageAgency}
                  />
                  <RefRow
                    label="Threshold"
                    value={stateData.prevailingWageThreshold}
                  />
                </>
              )}
            </RefBlock>

            <RefBlock title="State Certifications">
              <RefRow label="Program" value={stateData.stateCertProgram} />
              <RefRow
                label="Categories"
                value={stateData.stateCertCategories}
              />
              <RefRow label="Apply" value={stateData.stateCertUrl} mono />
            </RefBlock>

            <RefBlock title="Ironworkers Locals">
              {stateData.ironworkersLocals.length === 0 && (
                <div className="sk-ref-empty">
                  No ironworkers local directly in this state. See District
                  Council: {stateData.districtCouncil}.
                </div>
              )}
              {stateData.ironworkersLocals.map((l) => (
                <div key={l.number} className="sk-ref-union">
                  <div className="sk-ref-union-head">
                    <strong>Local {l.number}</strong> — {l.city}
                  </div>
                  <div className="sk-ref-union-meta">
                    {l.jurisdiction}
                    {l.phone && <> • {l.phone}</>}
                  </div>
                  <div className="sk-ref-union-url">{l.url}</div>
                </div>
              ))}
              {stateData.districtCouncil && (
                <div className="sk-ref-dc">
                  <strong>District Council:</strong> {stateData.districtCouncil}
                </div>
              )}
            </RefBlock>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          RESOURCE DIRECTORY
          ══════════════════════════════════════════════ */}
      <section className="sk-page">
        <h2 className="sk-h1">Resource Directory</h2>
        <p className="sk-lede">
          All links organized by phase. Type URLs manually if this binder is
          printed.
        </p>

        {allResources.map((group) => (
          <div key={group.id} className="sk-res-group">
            <h3 className="sk-h2">{group.title}</h3>
            {group.resources.length === 0 ? (
              <div className="sk-ref-empty">No resources.</div>
            ) : (
              <ul className="sk-res-list">
                {dedupeResources(group.resources).map((r, i) => (
                  <li key={i}>
                    <span className="sk-res-type">[{r.type}]</span>{" "}
                    <strong>{r.title}</strong>
                    {r.description && (
                      <span className="sk-res-desc"> — {r.description}</span>
                    )}
                    <div className="sk-res-url">{r.url}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════
          COST SUMMARY
          ══════════════════════════════════════════════ */}
      <section className="sk-page">
        <h2 className="sk-h1">Cost Summary</h2>
        <p className="sk-lede">
          Estimated startup costs compiled from all phases. Ranges reflect
          variation by business size, certifications pursued, and coverage
          selected.
        </p>

        <table className="sk-cost-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {phaseCosts.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{fmtCurrency(p.cost.min)}</td>
                <td>{fmtCurrency(p.cost.max)}</td>
              </tr>
            ))}
            <tr className="sk-cost-total">
              <td>TOTAL ESTIMATED</td>
              <td>{fmtCurrency(totalCost.min)}</td>
              <td>{fmtCurrency(totalCost.max)}</td>
            </tr>
          </tbody>
        </table>

        <div className="sk-cost-notes">
          <strong>Notes:</strong> Ongoing costs such as annual insurance
          premiums, monthly bond premiums, and state renewal fees are not
          included. Actual costs depend on your state, credit, experience
          level, and project pipeline.
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────

function RefBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sk-ref-block">
      <h3 className="sk-h3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function RefRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="sk-ref-row">
      <div className="sk-ref-label">{label}</div>
      <div className={`sk-ref-value ${mono ? "sk-mono" : ""}`}>{value}</div>
    </div>
  );
}

function dedupeResources<T extends Resource>(list: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const r of list) {
    const key = r.url || r.title;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
