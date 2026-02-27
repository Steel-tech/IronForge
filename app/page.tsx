"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadUserState, saveUserState } from "@/lib/store/user-profile";
import type { UserProfile } from "@/lib/types/wizard";
import { DEFAULT_PROFILE, DEFAULT_STATE } from "@/lib/types/wizard";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState<"welcome" | "state" | "profile">("welcome");
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const existing = loadUserState();
    if (existing.profile.state) {
      setHasExisting(true);
    }
  }, []);

  function handleContinue() {
    const existing = loadUserState();
    const phase = existing.currentPhase || "business-formation";
    const phaseContent = getPhaseContent(phase, existing.profile.state!);
    const stepId = existing.currentStep || phaseContent.steps[0]?.id || "choose-structure";
    router.push(`/wizard/${phase}/${stepId}`);
  }

  function handleStartNew() {
    setStep("state");
  }

  function handleStateSelect(state: "WA" | "OR") {
    setProfile((p) => ({ ...p, state }));
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
    const phaseContent = getPhaseContent(firstPhase, profile.state!);
    const firstStep = phaseContent.steps[0]?.id || "choose-structure";
    router.push(`/wizard/${firstPhase}/${firstStep}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {step === "welcome" && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">⚒️</div>
              <h1 className="text-4xl font-bold text-iron-900">
                Iron<span className="text-forge-600">Forge</span>
              </h1>
              <p className="text-xl text-iron-600 max-w-lg mx-auto">
                Your AI-powered guide to starting an ironwork contracting
                business in Washington or Oregon.
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto text-left">
              {[
                "Business formation & LLC setup",
                "State contractor licensing",
                "Surety bonding (plain English)",
                "Insurance requirements",
                "Small business certifications",
                "Federal contracting preparation",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-iron-700">
                  <span className="text-forge-500 font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              {hasExisting && (
                <button
                  onClick={handleContinue}
                  className="w-full py-3 px-6 bg-forge-600 text-white rounded-lg font-medium hover:bg-forge-700 transition-colors"
                >
                  Continue Where You Left Off →
                </button>
              )}
              <button
                onClick={handleStartNew}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  hasExisting
                    ? "bg-iron-200 text-iron-700 hover:bg-iron-300"
                    : "bg-forge-600 text-white hover:bg-forge-700"
                }`}
              >
                {hasExisting ? "Start Fresh" : "Get Started →"}
              </button>
            </div>

            <p className="text-sm text-iron-400">
              Free educational tool • AI-powered guidance • Real links &
              costs
            </p>
          </div>
        )}

        {step === "state" && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-iron-900">
                Where are you starting your business?
              </h2>
              <p className="text-iron-600">
                Licensing, bonding, and tax requirements differ by state.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <button
                onClick={() => handleStateSelect("WA")}
                className="p-8 rounded-xl border-2 border-iron-200 hover:border-forge-500 hover:bg-forge-50 transition-all group"
              >
                <div className="text-4xl mb-3">🌲</div>
                <div className="text-xl font-bold text-iron-900 group-hover:text-forge-700">
                  Washington
                </div>
                <div className="text-sm text-iron-500 mt-1">
                  L&I Registration
                </div>
                <div className="text-xs text-iron-400 mt-1">
                  No income tax • B&O tax
                </div>
              </button>

              <button
                onClick={() => handleStateSelect("OR")}
                className="p-8 rounded-xl border-2 border-iron-200 hover:border-forge-500 hover:bg-forge-50 transition-all group"
              >
                <div className="text-4xl mb-3">🏔️</div>
                <div className="text-xl font-bold text-iron-900 group-hover:text-forge-700">
                  Oregon
                </div>
                <div className="text-sm text-iron-500 mt-1">
                  CCB Licensing
                </div>
                <div className="text-xs text-iron-400 mt-1">
                  No sales tax • Income tax
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep("welcome")}
              className="text-iron-500 hover:text-iron-700 text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {step === "profile" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-iron-900">
                Tell us about yourself
              </h2>
              <p className="text-iron-600">
                This helps us customize your wizard experience and identify
                certifications you may qualify for.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-iron-700 mb-1">
                  Business Name (optional)
                </label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, businessName: e.target.value }))
                  }
                  placeholder="e.g., Pacific Steel Erectors LLC"
                  className="w-full px-4 py-2 rounded-lg border border-iron-300 focus:border-forge-500 focus:ring-1 focus:ring-forge-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-iron-700 mb-1">
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
                  className="w-full px-4 py-2 rounded-lg border border-iron-300 focus:border-forge-500 focus:ring-1 focus:ring-forge-500 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-iron-700">
                  Do any of these apply to you?
                </label>
                <p className="text-xs text-iron-500">
                  These unlock certification guidance for valuable set-aside
                  programs.
                </p>

                {[
                  {
                    key: "isVeteran" as const,
                    label: "I am a veteran",
                  },
                  {
                    key: "isDisabledVeteran" as const,
                    label:
                      "I have a service-connected disability (any %)",
                  },
                  {
                    key: "isMinority" as const,
                    label: "I am a minority business owner",
                  },
                  {
                    key: "isWomanOwned" as const,
                    label: "I am a woman business owner",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-iron-200 hover:border-iron-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={profile[key]}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          [key]: e.target.checked,
                          ...(key === "isDisabledVeteran" && e.target.checked
                            ? { isVeteran: true }
                            : {}),
                        }))
                      }
                      className="h-4 w-4 rounded border-iron-300 text-forge-600 focus:ring-forge-500"
                    />
                    <span className="text-iron-700">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("state")}
                  className="px-6 py-3 text-iron-600 hover:text-iron-800"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-forge-600 text-white rounded-lg font-medium hover:bg-forge-700 transition-colors"
                >
                  Start Building →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
