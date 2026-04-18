"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  CheckCircle2,
  Layers,
  DollarSign,
  Calendar,
  Download,
  GitCompare,
} from "lucide-react";

import { loadUserState } from "@/lib/store/user-profile";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { UserState } from "@/lib/types/wizard";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";

import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { CountUp } from "@/components/ui/count-up";
import { StatCard } from "@/components/dashboard/stat-card";
import { PhaseCard } from "@/components/dashboard/phase-card";
import {
  CostBreakdown,
  type CostRow,
} from "@/components/dashboard/cost-breakdown";
import {
  ActivityTimeline,
  type TimelineEvent,
} from "@/components/dashboard/activity-timeline";

interface PhaseSummary {
  id: string;
  title: string;
  description: string;
  firstStepId: string;
  totalSteps: number;
  visitedSteps: number;
  totalItems: number;
  completedItems: number;
  minCost: number;
  maxCost: number;
  firstVisitedAt?: string;
  lastActivityAt?: string;
}

export default function SummaryPage() {
  const router = useRouter();
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const state = loadUserState();
    if (!state.profile.state) {
      router.push("/");
      return;
    }
    setUserState(state);
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    document.title = "IronForge — Progress Dashboard";
  }, []);

  const summary = useMemo(() => {
    if (!userState.profile.state) return null;
    const stateCode = userState.profile.state as StateCode;

    let totalItems = 0;
    let completedItems = 0;
    let phasesComplete = 0;
    let totalMinCost = 0;
    let totalMaxCost = 0;

    const phaseSummaries: PhaseSummary[] = PHASE_DEFINITIONS.map((phaseDef) => {
      const phase = getPhaseContent(phaseDef.id, stateCode);
      let phaseTotal = 0;
      let phaseCompleted = 0;
      let phaseVisitedSteps = 0;
      let phaseMinCost = 0;
      let phaseMaxCost = 0;

      for (const step of phase.steps) {
        const stepProgress = userState.progress[phaseDef.id]?.[step.id];
        const completed = stepProgress?.completedChecklist ?? [];
        const total = step.checklist.length;

        phaseTotal += total;
        phaseCompleted += completed.length;
        if (stepProgress?.visited) phaseVisitedSteps += 1;

        phaseMinCost += step.estimatedCost?.min ?? 0;
        phaseMaxCost += step.estimatedCost?.max ?? 0;
      }

      totalItems += phaseTotal;
      completedItems += phaseCompleted;
      totalMinCost += phaseMinCost;
      totalMaxCost += phaseMaxCost;

      const phaseHasSteps = phase.steps.length > 0;
      const isComplete =
        phaseHasSteps &&
        phaseVisitedSteps === phase.steps.length &&
        (phaseTotal === 0 || phaseCompleted === phaseTotal);
      if (isComplete) phasesComplete += 1;

      return {
        id: phaseDef.id,
        title: phaseDef.title,
        description: phaseDef.description,
        firstStepId: phase.steps[0]?.id ?? "",
        totalSteps: phase.steps.length,
        visitedSteps: phaseVisitedSteps,
        totalItems: phaseTotal,
        completedItems: phaseCompleted,
        minCost: phaseMinCost,
        maxCost: phaseMaxCost,
      };
    });

    const overallPercent =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const startedAtIso = userState.startedAt || "";
    const startedAt = startedAtIso ? new Date(startedAtIso) : null;
    const now = new Date();
    const daysSinceStarted = startedAt
      ? Math.max(
          0,
          Math.floor(
            (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

    // Projected completion: if we've completed X% in D days, extrapolate
    let projectionIso: string | undefined;
    if (overallPercent > 0 && overallPercent < 100 && daysSinceStarted >= 0) {
      const effectiveDays = Math.max(1, daysSinceStarted);
      const remainingPct = 100 - overallPercent;
      const daysPerPct = effectiveDays / overallPercent;
      const daysRemaining = Math.ceil(daysPerPct * remainingPct);
      const eta = new Date(now.getTime() + daysRemaining * 86400_000);
      projectionIso = eta.toISOString();
    }

    return {
      phaseSummaries,
      totalItems,
      completedItems,
      phasesComplete,
      totalMinCost,
      totalMaxCost,
      overallPercent,
      daysSinceStarted,
      startedAtIso,
      projectionIso,
    };
  }, [userState]);

  if (!loaded || !userState.profile.state || !summary) return null;

  const stateCode = userState.profile.state as StateCode;
  const stateData = STATE_REGISTRY[stateCode];

  // Cost rows for breakdown
  const costRows: CostRow[] = summary.phaseSummaries.map((p) => ({
    phaseId: p.id,
    phaseTitle: p.title,
    min: p.minCost,
    max: p.maxCost,
    stepsCount: p.totalSteps,
    visitedSteps: p.visitedSteps,
    firstStepId: p.firstStepId,
  }));

  // Timeline events
  const timelineEvents: TimelineEvent[] = [];
  if (summary.startedAtIso) {
    timelineEvents.push({
      id: "start",
      type: "start",
      title: "Mission initialized",
      subtitle: stateData
        ? `${stateData.emoji} ${stateData.name} selected`
        : undefined,
      timestamp: summary.startedAtIso,
    });
  }
  // Phase-visit markers: first time each phase was visited (approximated — we
  // don't track per-step timestamps, so we just list phases that have been
  // touched).
  summary.phaseSummaries.forEach((p) => {
    if (p.visitedSteps > 0) {
      timelineEvents.push({
        id: `phase-${p.id}`,
        type: "phase-visit",
        title: `Entered "${p.title}"`,
        subtitle: `${p.visitedSteps}/${p.totalSteps} steps · ${p.completedItems}/${p.totalItems} items`,
      });
    }
  });
  // Today activity marker
  timelineEvents.push({
    id: "today",
    type: "today",
    title:
      summary.overallPercent >= 100
        ? "All phases complete — ready to launch"
        : `Currently at ${summary.overallPercent}% overall progress`,
    subtitle:
      userState.currentPhase && userState.currentStep
        ? `Last active on: ${userState.currentPhase} → ${userState.currentStep}`
        : undefined,
    timestamp: new Date().toISOString(),
  });
  // Projection
  if (summary.projectionIso) {
    timelineEvents.push({
      id: "projection",
      type: "projection",
      title: "Projected completion",
      subtitle: "Based on current pace",
      timestamp: summary.projectionIso,
    });
  }

  const continueHref = `/wizard/${userState.currentPhase}/${userState.currentStep}`;

  return (
    <div className="min-h-screen bg-cyber-black tron-grid">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 relative z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-3">
            <IBeamIcon className="w-9 h-9 text-neon-cyan animate-neon-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-text-primary mb-2">
            IRON<span className="text-neon-cyan text-glow-cyan">FORGE</span>{" "}
            <span className="text-text-secondary">DASHBOARD</span>
          </h1>
          <p className="text-text-muted font-mono text-xs">
            {stateData
              ? `${stateData.emoji} ${stateData.name.toUpperCase()}`
              : stateCode}{" "}
            • {userState.profile.businessName || "IRONWORK CONTRACTOR"}
          </p>
        </div>

        {/* ═══════════ HERO PROGRESS ═══════════ */}
        <section className="mb-8 animate-fade-in-up stagger-1">
          <div className="relative bg-cyber-dark border border-cyber-border rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
            <div className="flex flex-col items-center text-center">
              <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Overall Mission Progress
              </div>
              <div className="flex items-baseline gap-1">
                <CountUp
                  end={summary.overallPercent}
                  duration={1400}
                  className="text-6xl md:text-7xl font-mono font-bold text-neon-cyan text-glow-cyan leading-none"
                />
                <span className="text-3xl font-mono text-neon-cyan/60">%</span>
              </div>
              <div className="mt-3 text-xs font-mono text-text-secondary">
                <CountUp end={summary.completedItems} duration={1400} />{" "}
                of{" "}
                <CountUp end={summary.totalItems} duration={1400} /> checklist
                items complete
              </div>

              <div className="mt-5 w-full max-w-xl h-2 bg-cyber-surface rounded-full overflow-hidden">
                <div
                  className="neon-progress-bar h-full"
                  style={{ width: `${summary.overallPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STAT CARDS ═══════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-in-up stagger-2">
          <StatCard
            icon={CheckCircle2}
            label="Items Completed"
            accent="green"
            value={
              <>
                <CountUp end={summary.completedItems} duration={1200} />
                <span className="text-text-muted text-base font-normal">
                  {" "}
                  / {summary.totalItems}
                </span>
              </>
            }
            subtitle={`${summary.overallPercent}% complete`}
          />
          <StatCard
            icon={Layers}
            label="Phases Completed"
            accent="cyan"
            value={
              <>
                <CountUp end={summary.phasesComplete} duration={1200} />
                <span className="text-text-muted text-base font-normal">
                  {" "}
                  / {PHASE_DEFINITIONS.length}
                </span>
              </>
            }
            subtitle={`${PHASE_DEFINITIONS.length - summary.phasesComplete} remaining`}
          />
          <StatCard
            icon={DollarSign}
            label="Est. Startup Cost"
            accent="amber"
            value={
              <>
                $
                <CountUp
                  end={Math.round(summary.totalMinCost / 1000)}
                  duration={1400}
                />
                K
                <span className="text-text-muted text-base font-normal">
                  {" "}–{" "}
                </span>
                $
                <CountUp
                  end={Math.round(summary.totalMaxCost / 1000)}
                  duration={1400}
                />
                K
              </>
            }
            subtitle="Sum of step estimates"
          />
          <StatCard
            icon={Calendar}
            label="Days Since Started"
            accent="magenta"
            value={<CountUp end={summary.daysSinceStarted} duration={1200} />}
            subtitle={
              summary.startedAtIso
                ? `Started ${new Date(summary.startedAtIso).toLocaleDateString()}`
                : "—"
            }
          />
        </section>

        {/* ═══════════ PHASE GRID ═══════════ */}
        <section className="mb-10 animate-fade-in-up stagger-3">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
              Phase Progress
            </h2>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Click any phase to resume
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.phaseSummaries.map((p, i) => (
              <PhaseCard
                key={p.id}
                index={i}
                phaseId={p.id}
                title={p.title}
                description={p.description}
                stepId={p.firstStepId}
                totalSteps={p.totalSteps}
                visitedSteps={p.visitedSteps}
                totalItems={p.totalItems}
                completedItems={p.completedItems}
              />
            ))}
          </div>
        </section>

        {/* ═══════════ COST BREAKDOWN + TIMELINE ═══════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 animate-fade-in-up stagger-4">
          <div className="lg:col-span-3">
            <CostBreakdown rows={costRows} />
          </div>
          <div className="lg:col-span-2">
            <ActivityTimeline events={timelineEvents} />
          </div>
        </section>

        {/* ═══════════ ACTIONS ═══════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-up stagger-5 print:hidden">
          {/* Continue */}
          <Link
            href={continueHref}
            className="group relative bg-cyber-dark border border-neon-cyan/30 hover:border-neon-cyan/70 rounded-xl p-5 transition-all overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan">
                Resume
              </span>
              <ArrowRight className="w-4 h-4 text-neon-cyan group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-sm font-mono font-semibold text-text-primary mb-1">
              Continue Where You Left Off
            </div>
            <div className="text-[10px] font-mono text-text-muted truncate">
              {userState.currentPhase} → {userState.currentStep}
            </div>
          </Link>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="group relative text-left bg-cyber-dark border border-cyber-border hover:border-neon-magenta/40 rounded-xl p-5 transition-all overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/40 to-transparent" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon-magenta">
                Print
              </span>
              <Printer className="w-4 h-4 text-neon-magenta" />
            </div>
            <div className="text-sm font-mono font-semibold text-text-primary mb-1">
              Print Checklist
            </div>
            <div className="text-[10px] font-mono text-text-muted">
              Hard copy of all steps and items
            </div>
          </button>

          {/* Export placeholder */}
          <button
            disabled
            title="Export feature coming soon"
            className="group relative text-left bg-cyber-dark border border-cyber-border rounded-xl p-5 transition-all overflow-hidden opacity-60 cursor-not-allowed"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-text-muted/40 to-transparent" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                Soon
              </span>
              <Download className="w-4 h-4 text-text-muted" />
            </div>
            <div className="text-sm font-mono font-semibold text-text-secondary mb-1">
              Export Progress
            </div>
            <div className="text-[10px] font-mono text-text-muted">
              JSON/CSV download (coming soon)
            </div>
          </button>
        </section>

        {/* ═══════════ FOOTER NAV ═══════════ */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cyber-border/60 print:hidden">
          <Link
            href={continueHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-solid"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO FORGE
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-semibold text-xs tracking-wide btn-neon-magenta"
          >
            <GitCompare className="w-4 h-4" /> COMPARE STATES
          </Link>
        </section>
      </div>
    </div>
  );
}
