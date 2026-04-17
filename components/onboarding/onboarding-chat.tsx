"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send, X } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { TronGrid } from "@/components/ui/tron-grid";
import { DecryptedText } from "@/components/ui/decrypted-text";
import { STATE_REGISTRY } from "@/content/state-registry";
import { saveUserState } from "@/lib/store/user-profile";
import type { UserProfile } from "@/lib/types/wizard";
import { DEFAULT_PROFILE, DEFAULT_STATE } from "@/lib/types/wizard";
import { PHASE_DEFINITIONS, getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import {
  parseState,
  parseExperience,
  parseVeteran,
  parseYesNo,
  parseBusinessName,
  parseConfirmation,
} from "@/lib/ai/onboarding-parser";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type Stage =
  | "state"
  | "experience"
  | "veteran"
  | "minority"
  | "woman"
  | "business-name"
  | "confirm"
  | "done";

const STAGE_TO_STEP: Record<Stage, number> = {
  state: 1,
  experience: 2,
  veteran: 3,
  minority: 4,
  woman: 5,
  "business-name": 6,
  confirm: 6,
  done: 6,
};

const WELCOME_MESSAGE = `Welcome to IronForge. I'm your AI mentor — think of me as the journeyman who's walked this path.

Let's get you set up in under 60 seconds. First question:

**What state are you looking to start your contracting business in?**`;

interface OnboardingChatProps {
  onExit?: () => void;
}

export function OnboardingChat({ onExit }: OnboardingChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("state");
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [stage]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const stepNumber = STAGE_TO_STEP[stage];

  /**
   * Pushes a canned assistant message to the transcript.
   * Used for local clarifications + finished-state summaries.
   */
  function pushAssistant(content: string) {
    setMessages((m) => [
      ...m,
      {
        id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "assistant",
        content,
      },
    ]);
  }

  function pushUser(content: string) {
    setMessages((m) => [
      ...m,
      {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "user",
        content,
      },
    ]);
  }

  /**
   * Stream an assistant message from /api/onboarding using the full
   * transcript as context. Appends a final assistant message on success.
   */
  async function streamNextAssistantMessage(
    transcript: Msg[],
    fallback: string
  ) {
    setIsStreaming(true);
    setStreamingContent("");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: transcript.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        pushAssistant(fallback);
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
          const payload = line.slice(6).trim();
          if (!payload) continue;
          if (payload === "[DONE]") continue;
          try {
            const event = JSON.parse(payload);
            if (event.text) {
              acc += event.text;
              setStreamingContent(acc);
            }
          } catch {
            // ignore
          }
        }
      }

      if (acc) {
        pushAssistant(acc);
      } else {
        pushAssistant(fallback);
      }
    } catch {
      pushAssistant(fallback);
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      abortRef.current = null;
    }
  }

  /**
   * Fallback question text per stage, used if the AI request fails.
   */
  function fallbackQuestionFor(nextStage: Stage, updated: UserProfile): string {
    const stateName =
      updated.state && STATE_REGISTRY[updated.state]
        ? STATE_REGISTRY[updated.state].name
        : "";
    switch (nextStage) {
      case "experience":
        return `Got it — ${stateName}. How many years of ironwork experience do you have?`;
      case "veteran":
        return `Solid. Now — are you a veteran? And if so, do you have a service-connected disability (any %)?`;
      case "minority":
        return `Thanks. Do you qualify as a minority business owner? (This helps me flag MBE/DBE set-asides.)`;
      case "woman":
        return `Noted. Do you qualify as a woman-owned business? (WOSB certification is free through the SBA.)`;
      case "business-name":
        return `Almost there. What would you like to name your business? (Optional — say "skip" to decide later.)`;
      case "confirm":
        return buildSummary(updated);
      default:
        return "Let's keep going.";
    }
  }

  function buildSummary(p: UserProfile): string {
    const stateName =
      p.state && STATE_REGISTRY[p.state]
        ? STATE_REGISTRY[p.state].name
        : "—";
    const lines = [
      "**Here's your profile:**",
      "",
      `- **State:** ${stateName}`,
      `- **Experience:** ${p.tradeExperience || "—"} years`,
      `- **Veteran:** ${p.isVeteran ? "Yes" : "No"}${
        p.isDisabledVeteran ? " (service-connected disability)" : ""
      }`,
      `- **Minority business owner:** ${p.isMinority ? "Yes" : "No"}`,
      `- **Woman-owned business:** ${p.isWomanOwned ? "Yes" : "No"}`,
      `- **Business name:** ${p.businessName || "(to be decided)"}`,
      "",
      "Ready to start your journey? Say **\"let's go\"** to launch, or **\"wait\"** to change something.",
    ];
    return lines.join("\n");
  }

  /**
   * Processes a user answer through the current stage parser, updates
   * profile + stage, and asks the next question.
   */
  async function handleAnswer(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    pushUser(trimmed);

    // Snapshot current transcript (including new user msg) for API calls
    const transcript: Msg[] = [
      ...messages,
      {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      },
    ];

    switch (stage) {
      case "state": {
        const result = parseState(trimmed);
        if (!result.ok || !result.value) {
          pushAssistant(
            result.reason ??
              "I didn't catch that state. Try the full name (e.g. \"Washington\")."
          );
          return;
        }
        const updated = { ...profile, state: result.value };
        setProfile(updated);
        setStage("experience");
        await streamNextAssistantMessage(
          transcript,
          fallbackQuestionFor("experience", updated)
        );
        return;
      }
      case "experience": {
        const result = parseExperience(trimmed);
        if (!result.ok || !result.value) {
          pushAssistant(
            result.reason ?? "Roughly how many years? 0-2, 3-5, 5-10, or 10+?"
          );
          return;
        }
        const updated = { ...profile, tradeExperience: result.value };
        setProfile(updated);
        setStage("veteran");
        await streamNextAssistantMessage(
          transcript,
          fallbackQuestionFor("veteran", updated)
        );
        return;
      }
      case "veteran": {
        const result = parseVeteran(trimmed);
        if (!result.ok || !result.value) {
          pushAssistant(
            result.reason ??
              "Are you a veteran? And if yes, do you have a service-connected disability?"
          );
          return;
        }
        const updated = {
          ...profile,
          isVeteran: result.value.isVeteran,
          isDisabledVeteran: result.value.isDisabledVeteran,
        };
        setProfile(updated);
        setStage("minority");
        await streamNextAssistantMessage(
          transcript,
          fallbackQuestionFor("minority", updated)
        );
        return;
      }
      case "minority": {
        const result = parseYesNo(trimmed);
        if (!result.ok || result.value === undefined) {
          pushAssistant(result.reason ?? "Yes or no — either works.");
          return;
        }
        const updated = { ...profile, isMinority: result.value };
        setProfile(updated);
        setStage("woman");
        await streamNextAssistantMessage(
          transcript,
          fallbackQuestionFor("woman", updated)
        );
        return;
      }
      case "woman": {
        const result = parseYesNo(trimmed);
        if (!result.ok || result.value === undefined) {
          pushAssistant(result.reason ?? "Yes or no?");
          return;
        }
        const updated = { ...profile, isWomanOwned: result.value };
        setProfile(updated);
        setStage("business-name");
        await streamNextAssistantMessage(
          transcript,
          fallbackQuestionFor("business-name", updated)
        );
        return;
      }
      case "business-name": {
        const result = parseBusinessName(trimmed);
        if (!result.ok) {
          pushAssistant(result.reason ?? "Keep it short and try again.");
          return;
        }
        const updated = { ...profile, businessName: result.value ?? "" };
        setProfile(updated);
        setStage("confirm");
        // Always use local summary for the confirm stage so the profile
        // preview matches what we're about to save.
        pushAssistant(buildSummary(updated));
        return;
      }
      case "confirm": {
        const result = parseConfirmation(trimmed);
        if (!result.ok || result.value === undefined) {
          pushAssistant(
            result.reason ??
              "Say \"let's go\" to launch, or \"wait\" if you want to start over."
          );
          return;
        }
        if (result.value) {
          // CONFIRMED — save + redirect
          if (!profile.state) {
            pushAssistant(
              "Hmm — I don't have a state on file. Let's start over with the state question."
            );
            setStage("state");
            return;
          }
          const userState = {
            ...DEFAULT_STATE,
            profile,
            startedAt: new Date().toISOString(),
          };
          saveUserState(userState);
          setStage("done");
          pushAssistant(
            "🔥 **Forge is heating up.** Launching your wizard now..."
          );
          setTimeout(() => {
            const firstPhase = PHASE_DEFINITIONS[0].id;
            const phaseContent = getPhaseContent(
              firstPhase,
              profile.state as StateCode
            );
            const firstStep =
              phaseContent.steps[0]?.id || "choose-structure";
            router.push(`/wizard/${firstPhase}/${firstStep}`);
          }, 900);
        } else {
          // User wants to go back — restart the flow
          setProfile({ ...DEFAULT_PROFILE });
          setStage("state");
          pushAssistant(
            "No problem — let's start over. **What state are you looking to start your contracting business in?**"
          );
        }
        return;
      }
      case "done":
        return;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isStreaming || stage === "done") return;
    const value = input;
    setInput("");
    void handleAnswer(value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const progressPct = Math.min(100, Math.round((stepNumber / 6) * 100));
  const placeholder = placeholderFor(stage);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-black relative overflow-hidden">
      <MatrixRain opacity={0.05} speed={0.7} />
      <TronGrid />

      {/* Header */}
      <header className="relative z-10 border-b border-cyber-border bg-cyber-darker/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IBeamIcon className="w-6 h-6 text-neon-cyan animate-neon-pulse" />
            <div>
              <div className="font-mono text-xs text-neon-cyan tracking-widest uppercase">
                <DecryptedText
                  text="IRONFORGE"
                  speed={25}
                  revealIterations={2}
                  className=""
                />
              </div>
              <div className="font-mono font-bold text-text-primary text-sm tracking-wide">
                ONBOARDING
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs font-mono text-text-muted tracking-wider uppercase">
              Step {stepNumber}/6
            </div>
            {onExit && (
              <button
                onClick={onExit}
                aria-label="Exit onboarding"
                className="p-1.5 text-text-muted hover:text-neon-magenta rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-cyber-border/40 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-cyan to-neon-magenta transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              boxShadow:
                "0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(0, 240, 255, 0.3)",
            }}
          />
        </div>
      </header>

      {/* Messages */}
      <main
        role="log"
        aria-label="Onboarding chat"
        aria-live="polite"
        aria-relevant="additions text"
        className="flex-1 overflow-y-auto scrollbar-thin relative z-10"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-fade-in ${
                msg.role === "user" ? "flex justify-end" : ""
              }`}
            >
              {msg.role === "user" ? (
                <div className="max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed bg-neon-cyan/10 border border-neon-cyan/20 text-text-primary">
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-cyber-surface border border-cyber-border relative">
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 rounded-full bg-neon-magenta/50" />
                  <div className="pl-2">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isStreaming && streamingContent && (
            <div className="animate-fade-in">
              <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-cyber-surface border border-cyber-border relative">
                <div className="absolute top-0 bottom-0 left-0 w-0.5 rounded-full bg-neon-magenta/50 animate-neon-pulse" />
                <div className="pl-2">
                  <MarkdownRenderer content={streamingContent} />
                </div>
                <span className="inline-flex gap-1 ml-1">
                  <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
                  <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
                  <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
                </span>
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && (
            <div className="animate-fade-in">
              <div className="max-w-[85%] bg-cyber-surface border border-cyber-border rounded-xl px-4 py-3 text-sm">
                <span className="inline-flex gap-1.5">
                  <span className="streaming-dot w-2 h-2 bg-neon-magenta rounded-full inline-block" />
                  <span className="streaming-dot w-2 h-2 bg-neon-magenta rounded-full inline-block" />
                  <span className="streaming-dot w-2 h-2 bg-neon-magenta rounded-full inline-block" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="relative z-10 border-t border-cyber-border bg-cyber-darker/80 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto px-4 py-3"
        >
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={isStreaming || stage === "done"}
              className="flex-1 px-3 py-2.5 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-sm resize-none cyber-focus transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim() || stage === "done"}
              aria-label="Send"
              className="px-3 py-2.5 rounded-lg btn-neon-magenta disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono font-medium transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-text-muted mt-1.5 px-1 font-mono">
            ENTER to send • Responses are parsed locally — no data leaves your
            browser except for AI-generated prompts.
          </div>
        </form>
      </footer>
    </div>
  );
}

function placeholderFor(stage: Stage): string {
  switch (stage) {
    case "state":
      return "e.g. Washington";
    case "experience":
      return "e.g. 8 years";
    case "veteran":
      return "e.g. yes, SC disability / no";
    case "minority":
    case "woman":
      return "yes / no";
    case "business-name":
      return "e.g. Pacific Steel Erectors LLC — or \"skip\"";
    case "confirm":
      return "\"let's go\" to launch, or \"wait\" to redo";
    case "done":
      return "Launching...";
  }
}
