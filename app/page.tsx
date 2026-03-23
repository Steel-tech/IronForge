"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loadUserState, saveUserState } from "@/lib/store/user-profile";
import type { UserProfile } from "@/lib/types/wizard";
import { DEFAULT_PROFILE, DEFAULT_STATE } from "@/lib/types/wizard";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import { STATE_REGISTRY } from "@/content/state-registry";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { TronGrid } from "@/components/ui/tron-grid";
import { ArrowRight, ChevronLeft, Search } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";

const ALL_STATES = Object.values(STATE_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState<"welcome" | "state" | "profile">("welcome");
  const [hasExisting, setHasExisting] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  useEffect(() => {
    const existing = loadUserState();
    if (existing.profile.state) {
      setHasExisting(true);
    }
  }, []);

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return ALL_STATES;
    const q = stateSearch.toLowerCase();
    return ALL_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }, [stateSearch]);

  function handleContinue() {
    const existing = loadUserState();
    const phase = existing.currentPhase || "business-formation";
    const phaseContent = getPhaseContent(
      phase,
      existing.profile.state as StateCode
    );
    const stepId =
      existing.currentStep ||
      phaseContent.steps[0]?.id ||
      "choose-structure";
    router.push(`/wizard/${phase}/${stepId}`);
  }

  function handleStartNew() {
    setStep("state");
  }

  function handleStateSelect(code: string) {
    setProfile((p) => ({ ...p, state: code }));
    setStep("profile");
  }

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const userState = {
      ...DEFAULT_STATE,
      profile,
      startedAt: new Date().toISOString(),
    };
    saveUserState(userState);
    const firstPhase = PHASE_DEFINITIONS[0].id;
    const phaseContent = getPhaseContent(
      firstPhase,
      profile.state as StateCode
    );
    const firstStep = phaseContent.steps[0]?.id || "choose-structure";
    router.push(`/wizard/${firstPhase}/${firstStep}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden tron-grid">
      {/* Background effects */}
      <MatrixRain opacity={0.06} speed={0.8} />
      <TronGrid />

      {/* Content */}
      <div className="max-w-3xl w-full relative z-10">
        {/* ═══════════ WELCOME SCREEN ═══════════ */}
        {step === "welcome" && (
          <div className="text-center space-y-10 animate-fade-in-up">
            {/* Logo */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <IBeamIcon className="w-8 h-8 text-neon-cyan animate-neon-pulse" />
              </div>
              <h1 className="text-5xl md:text-6xl font-mono font-bold tracking-tight">
                <span className="text-text-primary glitch-text">IRON</span>
                <span className="text-neon-cyan text-glow-cyan">FORGE</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
                Your AI-powered guide to starting an ironwork contracting
                business — all 50 states covered.
              </p>
            </div>

            {/* Phase list — terminal style */}
            <div className="max-w-md mx-auto text-left space-y-0">
              {[
                "Business formation & LLC setup",
                "State contractor licensing",
                "Surety bonding (plain English)",
                "Insurance requirements",
                "Small business certifications",
                "Union signatory contractor",
                "Federal contracting preparation",
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-2.5 px-4 border-b border-cyber-border/50 animate-fade-in-up stagger-${i + 1}`}
                >
                  <span className="font-mono text-neon-green text-sm text-glow-green w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-neon-cyan/40 mr-1">
                    {">"}
                  </span>
                  <span className="text-text-secondary text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 max-w-sm mx-auto">
              {hasExisting && (
                <button
                  onClick={handleContinue}
                  className="w-full py-3.5 px-6 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-solid"
                >
                  RESUME SESSION{" "}
                  <ArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              )}
              <button
                onClick={handleStartNew}
                className={`w-full py-3.5 px-6 rounded-lg font-mono font-semibold text-sm tracking-wide ${
                  hasExisting ? "btn-neon-cyan" : "btn-neon-solid"
                }`}
              >
                {hasExisting ? "INITIALIZE NEW" : "INITIALIZE"}{" "}
                <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Footer tag */}
            <p className="text-xs text-text-muted font-mono tracking-wider">
              [ FREE TOOL • AI-POWERED • ALL 50 STATES • REAL LINKS & COSTS ]
            </p>
          </div>
        )}

        {/* ═══════════ STATE SELECTION ═══════════ */}
        {step === "state" && (
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="space-y-3">
              <h2 className="text-3xl font-mono font-bold text-text-primary">
                SELECT{" "}
                <span className="text-neon-cyan text-glow-cyan">REGION</span>
              </h2>
              <p className="text-text-secondary text-sm font-mono">
                Licensing, bonding, and tax requirements differ by state.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search states..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-sm cyber-focus transition-all"
                autoFocus
              />
            </div>

            {/* State Grid */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredStates.map((s) => {
                  const taxBadge = !s.hasIncomeTax
                    ? "No income tax"
                    : !s.hasSalesTax
                      ? "No sales tax"
                      : s.incomeTaxRate.includes("Flat")
                        ? s.incomeTaxRate
                        : "";

                  return (
                    <button
                      key={s.code}
                      onClick={() => handleStateSelect(s.code)}
                      className="group relative p-3 rounded-lg border border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/50 transition-all duration-200 hover:glow-cyan text-left"
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/0 to-transparent group-hover:via-neon-cyan/40 transition-all duration-300" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.emoji}</span>
                        <span className="font-mono font-bold text-xs text-text-primary group-hover:text-neon-cyan transition-colors">
                          {s.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono truncate">
                        {s.name}
                      </div>
                      {taxBadge && (
                        <div className="text-[9px] text-neon-green/60 font-mono mt-1 truncate">
                          {taxBadge}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {filteredStates.length === 0 && (
                <div className="text-text-muted font-mono text-sm py-8">
                  No states matching &quot;{stateSearch}&quot;
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setStep("welcome");
                setStateSearch("");
              }}
              className="text-text-muted hover:text-neon-cyan text-sm font-mono transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> BACK
            </button>
          </div>
        )}

        {/* ═══════════ PROFILE FORM ═══════════ */}
        {step === "profile" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-mono font-bold text-text-primary">
                OPERATOR{" "}
                <span className="text-neon-cyan text-glow-cyan">PROFILE</span>
              </h2>
              <p className="text-text-secondary text-sm font-mono">
                {profile.state && STATE_REGISTRY[profile.state] && (
                  <span>
                    {STATE_REGISTRY[profile.state].emoji}{" "}
                    {STATE_REGISTRY[profile.state].name} selected •{" "}
                  </span>
                )}
                Customize your build path and unlock certification eligibility.
              </p>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-6 max-w-md mx-auto"
            >
              {/* Business Name */}
              <div>
                <label className="block text-xs font-mono font-semibold text-text-secondary mb-2 tracking-wider uppercase">
                  Business Name
                  <span className="text-text-muted ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      businessName: e.target.value,
                    }))
                  }
                  placeholder="e.g., Pacific Steel Erectors LLC"
                  className="w-full px-4 py-3 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-sm cyber-focus transition-all"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-mono font-semibold text-text-secondary mb-2 tracking-wider uppercase">
                  Years of Ironwork Experience
                </label>
                <select
                  value={profile.tradeExperience}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      tradeExperience: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary font-mono text-sm cyber-focus transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-cyber-dark">
                    Select...
                  </option>
                  <option value="0-2" className="bg-cyber-dark">
                    0-2 years
                  </option>
                  <option value="3-5" className="bg-cyber-dark">
                    3-5 years
                  </option>
                  <option value="5-10" className="bg-cyber-dark">
                    5-10 years
                  </option>
                  <option value="10+" className="bg-cyber-dark">
                    10+ years
                  </option>
                </select>
              </div>

              {/* Qualifications */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-semibold text-text-secondary tracking-wider uppercase">
                  Qualifications
                </label>
                <p className="text-[11px] text-text-muted font-mono">
                  These unlock certification guidance for set-aside programs.
                </p>

                {[
                  { key: "isVeteran" as const, label: "Veteran" },
                  {
                    key: "isDisabledVeteran" as const,
                    label: "Service-connected disability (any %)",
                  },
                  {
                    key: "isMinority" as const,
                    label: "Minority business owner",
                  },
                  {
                    key: "isWomanOwned" as const,
                    label: "Woman business owner",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/30 cursor-pointer transition-all group"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={profile[key]}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            [key]: e.target.checked,
                            ...(key === "isDisabledVeteran" &&
                            e.target.checked
                              ? { isVeteran: true }
                              : {}),
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          profile[key]
                            ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan glow-cyan"
                            : "border-cyber-border group-hover:border-cyber-border-bright"
                        }`}
                      >
                        {profile[key] && (
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
                    <span className="text-sm text-text-secondary font-mono group-hover:text-text-primary transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("state")}
                  className="px-5 py-3 text-text-muted hover:text-neon-cyan font-mono text-sm transition-colors inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-lg font-mono font-semibold text-sm tracking-wide btn-neon-solid"
                >
                  LAUNCH FORGE{" "}
                  <ArrowRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
