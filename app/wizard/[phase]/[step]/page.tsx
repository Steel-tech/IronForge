"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import { loadUserState, saveUserState } from "@/lib/store/user-profile";
import {
  loadChatHistory,
  saveChatHistory,
  getStepMessages,
  addMessage,
} from "@/lib/store/chat-history";
import { toggleChecklistItem, markStepVisited } from "@/lib/store/progress";
import {
  getPhaseContent,
  getNextStep,
  getPrevStep,
  PHASE_DEFINITIONS,
} from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { UserState } from "@/lib/types/wizard";
import type { ChatMessage, ChatState } from "@/lib/types/chat";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { ProgressSidebar } from "@/components/wizard/progress-sidebar";
import { StepContent } from "@/components/wizard/step-content";
import { ChatPanel } from "@/components/wizard/chat-panel";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  StepContentSkeleton,
  ChatPanelSkeleton,
} from "@/components/ui/skeleton";
import { KeyboardShortcutsHint } from "@/components/wizard/keyboard-shortcuts-hint";
import {
  loadAchievementsState,
  saveAchievementsState,
  recordUnlock,
  markSeen,
  unlockedIds,
  recordVisitToday,
  computeConsecutiveDays,
  recordPhaseFirstVisit,
  recordPhaseCompleted,
  incrementSessionCompletion,
  type AchievementsState,
} from "@/lib/store/achievements";
import {
  getNewAchievements,
  type DetectorAuxInputs,
} from "@/lib/achievements/detector";
import type { Achievement } from "@/lib/achievements/definitions";
import { AchievementToastStack } from "@/components/achievements/achievement-toast";
import {
  loadNudgeState,
  saveNudgeState,
  dismissNudge,
  touchLastVisit,
  incrementTodayCompletion,
  getTodayCompletionCount,
  type NudgeStoreState,
} from "@/lib/store/nudges";
import { pickNudge, type NudgeContext } from "@/lib/notifications/nudge-engine";
import { NudgeBanner } from "@/components/notifications/nudge-banner";

export default function WizardStepPage({
  params,
}: {
  params: Promise<{ phase: string; step: string }>;
}) {
  const { phase: phaseId, step: stepId } = use(params);
  const router = useRouter();

  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [chatState, setChatState] = useState<ChatState>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [achievementsState, setAchievementsState] =
    useState<AchievementsState | null>(null);
  const [nudgeState, setNudgeState] = useState<NudgeStoreState | null>(null);
  const [priorLastVisitISO, setPriorLastVisitISO] = useState<string | null>(
    null,
  );
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);

  // Load state
  useEffect(() => {
    const state = loadUserState();
    if (!state.profile.state) {
      router.push("/");
      return;
    }
    setUserState(state);
    setChatState(loadChatHistory());
    setLoaded(true);

    // Mark step visited and save current position
    const updatedProgress = markStepVisited(state.progress, phaseId, stepId);
    const updated = {
      ...state,
      progress: updatedProgress,
      currentPhase: phaseId,
      currentStep: stepId,
    };
    setUserState(updated);
    saveUserState(updated);

    // Initialize achievements + nudge tracking (best-effort).
    try {
      let ach = loadAchievementsState();
      ach = recordVisitToday(ach);
      ach = recordPhaseFirstVisit(ach, phaseId);
      saveAchievementsState(ach);
      setAchievementsState(ach);
    } catch {
      // ignore
    }
    try {
      const nudge = loadNudgeState();
      const { next, previous } = touchLastVisit(nudge);
      saveNudgeState(next);
      setNudgeState(next);
      setPriorLastVisitISO(previous);
    } catch {
      // ignore
    }
  }, [phaseId, stepId, router]);

  // Responsive
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setChatCollapsed(true);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const stateCode = userState.profile.state as StateCode | null;

  // Detect achievements whenever state changes (best-effort).
  useEffect(() => {
    if (!loaded || !achievementsState) return;
    try {
      const aux: DetectorAuxInputs = {
        chatState,
        sessionCompletedCount: achievementsState.sessionCompletedCount,
        consecutiveDaysUsed: computeConsecutiveDays(achievementsState),
        usedEstimator: achievementsState.usedEstimator,
        phaseTimestamps: achievementsState.phaseTimestamps,
      };
      const newly = getNewAchievements(
        userState,
        aux,
        unlockedIds(achievementsState),
      );
      if (newly.length === 0) return;
      let nextState = achievementsState;
      for (const a of newly) nextState = recordUnlock(nextState, a.id);
      saveAchievementsState(nextState);
      setAchievementsState(nextState);
      setToastQueue((prev) => [...prev, ...newly]);
    } catch {
      // swallow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, chatState, loaded]);

  function handleDismissToast(id: string) {
    setToastQueue((prev) => prev.filter((a) => a.id !== id));
    if (achievementsState) {
      const n = markSeen(achievementsState, id);
      saveAchievementsState(n);
      setAchievementsState(n);
    }
  }

  const nudgeContext = useMemo<NudgeContext | null>(() => {
    if (!loaded || !nudgeState || !stateCode) return null;
    const phaseVisitRatio: Record<string, number> = {};
    const phaseChecklistRatio: Record<string, number> = {};
    for (const phaseDef of PHASE_DEFINITIONS) {
      const pid = phaseDef.id;
      try {
        const content = getPhaseContent(pid, stateCode);
        const progressPhase = userState.progress[pid] ?? {};
        const visited = Object.values(progressPhase).filter(
          (s) => s.visited,
        ).length;
        phaseVisitRatio[pid] =
          content.steps.length > 0 ? visited / content.steps.length : 0;
        let total = 0;
        let done = 0;
        for (const s of content.steps) {
          total += s.checklist.length;
          done += (progressPhase[s.id]?.completedChecklist ?? []).length;
        }
        phaseChecklistRatio[pid] = total > 0 ? done / total : 0;
      } catch {
        phaseVisitRatio[pid] = 0;
        phaseChecklistRatio[pid] = 0;
      }
    }
    let daysSincePhase1FirstVisit: number | null = null;
    if (achievementsState) {
      const fv =
        achievementsState.phaseTimestamps["business-formation"]?.firstVisit;
      if (fv) {
        daysSincePhase1FirstVisit = Math.floor(
          (Date.now() - fv) / (1000 * 60 * 60 * 24),
        );
      }
    }
    return {
      state: userState,
      phaseChecklistRatio,
      phaseVisitRatio,
      lastVisitISO: priorLastVisitISO,
      itemsCompletedToday: getTodayCompletionCount(nudgeState),
      daysSincePhase1FirstVisit,
    };
  }, [
    loaded,
    nudgeState,
    stateCode,
    userState,
    achievementsState,
    priorLastVisitISO,
  ]);

  const currentNudge = useMemo(() => {
    if (!nudgeContext || !nudgeState) return null;
    return pickNudge(nudgeContext, nudgeState.dismissedIds);
  }, [nudgeContext, nudgeState]);

  function handleDismissNudge() {
    if (!nudgeState || !currentNudge) return;
    const n = dismissNudge(nudgeState, currentNudge.id);
    saveNudgeState(n);
    setNudgeState(n);
  }

  // Dynamic page title
  useEffect(() => {
    if (!stateCode) return;
    const phaseContent = getPhaseContent(phaseId, stateCode);
    const step = phaseContent.steps.find((s) => s.id === stepId);
    const phaseDef = PHASE_DEFINITIONS.find((p) => p.id === phaseId);
    if (step && phaseDef) {
      document.title = `IronForge — ${phaseDef.title}: ${step.title}`;
    }
  }, [phaseId, stepId, stateCode]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore shortcuts when typing in inputs/textareas/contenteditable
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // Ctrl/Cmd + / toggles chat panel (works even in inputs)
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setChatCollapsed((c) => !c);
        return;
      }

      // Escape closes mobile chat (works even in inputs)
      if (e.key === "Escape") {
        if (isMobile && !chatCollapsed) {
          e.preventDefault();
          setChatCollapsed(true);
        }
        return;
      }

      if (isEditable) return;

      if (e.key === "ArrowRight" || e.key === "]") {
        if (!stateCode) return;
        const nextTarget = getNextStep(phaseId, stepId, stateCode);
        if (nextTarget) {
          e.preventDefault();
          router.push(`/wizard/${nextTarget.phaseId}/${nextTarget.stepId}`);
        }
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "[") {
        if (!stateCode) return;
        const prevTarget = getPrevStep(phaseId, stepId, stateCode);
        if (prevTarget) {
          e.preventDefault();
          router.push(`/wizard/${prevTarget.phaseId}/${prevTarget.stepId}`);
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phaseId, stepId, stateCode, router, isMobile, chatCollapsed]);
  if (!loaded || !stateCode) {
    return (
      <div className="h-screen flex bg-cyber-black tron-grid">
        <div className="hidden lg:flex w-72 bg-cyber-darker border-r border-cyber-border flex-col p-4 gap-3">
          <div className="h-8 rounded skeleton-shimmer" />
          <div className="h-4 rounded skeleton-shimmer w-2/3" />
          <div className="mt-4 space-y-2">
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
            <div className="h-10 rounded skeleton-shimmer" />
          </div>
          <div className="mt-auto text-center text-neon-cyan font-mono text-[10px] uppercase tracking-widest animate-neon-pulse">
            Loading module…
          </div>
        </div>
        <StepContentSkeleton />
        <ChatPanelSkeleton />
      </div>
    );
  }

  const phaseContent = getPhaseContent(phaseId, stateCode);
  const step = phaseContent.steps.find((s) => s.id === stepId);
  const phaseDef = PHASE_DEFINITIONS.find((p) => p.id === phaseId);

  if (!step || !phaseDef) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <div className="text-text-muted font-mono text-sm">
          MODULE NOT FOUND.{" "}
          <button
            onClick={() => router.push("/")}
            className="text-neon-cyan hover:text-glow-cyan underline"
          >
            Return to base
          </button>
        </div>
      </div>
    );
  }

  const completedItems =
    userState.progress[phaseId]?.[stepId]?.completedChecklist ?? [];

  const next = getNextStep(phaseId, stepId, stateCode);
  const prev = getPrevStep(phaseId, stepId, stateCode);

  const messages = getStepMessages(chatState, phaseId, stepId);

  function handleToggleItem(itemId: string) {
    const prevCompleted =
      userState.progress[phaseId]?.[stepId]?.completedChecklist ?? [];
    const wasChecked = prevCompleted.includes(itemId);

    const nextProgress = toggleChecklistItem(
      userState.progress,
      phaseId,
      stepId,
      itemId,
    );
    const updated = {
      ...userState,
      progress: nextProgress,
    };
    setUserState(updated);
    saveUserState(updated);

    // Fire toasts only when turning an item ON.
    if (!wasChecked) {
      const nextCompleted =
        nextProgress[phaseId]?.[stepId]?.completedChecklist ?? [];
      const totalItems = step?.checklist.length ?? 0;
      const allDone =
        totalItems > 0 && nextCompleted.length >= totalItems;

      // Track session + daily completions for achievements/nudges.
      try {
        if (achievementsState) {
          let nextAch = incrementSessionCompletion(achievementsState);
          if (stateCode) {
            const content = getPhaseContent(phaseId, stateCode);
            let allPhaseDone = true;
            for (const s of content.steps) {
              const done =
                updated.progress[phaseId]?.[s.id]?.completedChecklist
                  .length ?? 0;
              if (done < s.checklist.length) {
                allPhaseDone = false;
                break;
              }
            }
            if (allPhaseDone) {
              nextAch = recordPhaseCompleted(nextAch, phaseId);
            }
          }
          saveAchievementsState(nextAch);
          setAchievementsState(nextAch);
        }
      } catch {
        // ignore
      }
      try {
        if (nudgeState) {
          const nextN = incrementTodayCompletion(nudgeState);
          saveNudgeState(nextN);
          setNudgeState(nextN);
        }
      } catch {
        // ignore
      }

      if (allDone) {
        toast.success("🎯 Step complete! All items checked.");
      } else {
        toast.success("Item completed!");
      }
    }
  }

  function handleNav(target: { phaseId: string; stepId: string } | null) {
    if (target) {
      router.push(`/wizard/${target.phaseId}/${target.stepId}`);
    }
  }

  async function handleSendMessage(content: string) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: Date.now(),
      stepId,
    };

    const updatedChat = addMessage(chatState, phaseId, stepId, userMsg);
    setChatState(updatedChat);
    saveChatHistory(updatedChat);
    setIsStreaming(true);
    setStreamingContent("");

    const allMessages = getStepMessages(updatedChat, phaseId, stepId);
    const apiMessages = allMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          phaseId,
          stepId,
          profile: userState.profile,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setStreamingContent(fullContent);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: fullContent,
        timestamp: Date.now(),
        stepId,
      };

      const finalChat = addMessage(updatedChat, phaseId, stepId, assistantMsg);
      setChatState(finalChat);
      saveChatHistory(finalChat);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Connection to AI mentor failed. Please try again.");
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content:
          "Connection to AI service failed. Please try again later.",
        timestamp: Date.now(),
        stepId,
      };
      const errorChat = addMessage(updatedChat, phaseId, stepId, errorMsg);
      setChatState(errorChat);
      saveChatHistory(errorChat);
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  }

  return (
    <div className="h-screen flex bg-cyber-black tron-grid">
      <ProgressSidebar
        currentPhaseId={phaseId}
        currentStepId={stepId}
        userState={stateCode}
        progress={userState.progress}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <StepContent
        step={step}
        phaseTitle={phaseDef.title}
        phaseId={phaseId}
        profile={userState.profile}
        completedItems={completedItems}
        onToggleItem={handleToggleItem}
        onAskChat={(q) => {
          // Open the chat panel if hidden, then fire the prewritten ask.
          if (chatCollapsed) setChatCollapsed(false);
          void handleSendMessage(q);
        }}
        onNext={next ? () => handleNav(next) : undefined}
        onPrev={prev ? () => handleNav(prev) : undefined}
        hasNext={!!next}
        hasPrev={!!prev}
        footerExtra={<KeyboardShortcutsHint />}
        headerExtra={
          currentNudge ? (
            <NudgeBanner
              nudge={currentNudge}
              onDismiss={handleDismissNudge}
            />
          ) : null
        }
      />

      <AchievementToastStack
        achievements={toastQueue}
        onDismiss={handleDismissToast}
      />

      {/* Mobile chat toggle */}
      {isMobile && chatCollapsed && (
        <button
          onClick={() => setChatCollapsed(false)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center z-50 btn-neon-magenta border-2 border-neon-magenta/50"
          style={{
            boxShadow:
              "0 0 20px rgba(255, 0, 170, 0.3), 0 0 40px rgba(255, 0, 170, 0.1)",
          }}
        >
          <MessageSquare className="w-5 h-5 text-neon-magenta" />
        </button>
      )}

      {/* Chat panel */}
      {(!isMobile || !chatCollapsed) && (
        <div
          className={
            isMobile ? "fixed inset-0 z-50 bg-cyber-darker" : ""
          }
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            step={step}
            profile={userState.profile}
            collapsed={!isMobile && chatCollapsed}
            onToggle={() => setChatCollapsed(!chatCollapsed)}
          />
        </div>
      )}
    </div>
  );
}
