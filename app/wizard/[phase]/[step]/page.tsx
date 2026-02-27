"use client";

import { useEffect, useState, useCallback, use } from "react";
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
import type { Step } from "@/lib/types/content";
import { DEFAULT_STATE } from "@/lib/types/wizard";
import { ProgressSidebar } from "@/components/wizard/progress-sidebar";
import { StepContent } from "@/components/wizard/step-content";
import { ChatPanel } from "@/components/wizard/chat-panel";

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
  if (!loaded || !stateCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-iron-400">Loading...</div>
      </div>
    );
  }

  const phaseContent = getPhaseContent(phaseId, stateCode);
  const step = phaseContent.steps.find((s) => s.id === stepId);
  const phaseDef = PHASE_DEFINITIONS.find((p) => p.id === phaseId);

  if (!step || !phaseDef) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-iron-500">
          Step not found.{" "}
          <button
            onClick={() => router.push("/")}
            className="text-forge-600 underline"
          >
            Go home
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
    const updated = {
      ...userState,
      progress: toggleChecklistItem(userState.progress, phaseId, stepId, itemId),
    };
    setUserState(updated);
    saveUserState(updated);
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

    // Prepare messages for API
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
          step,
          profile: userState.profile,
          phaseName: phaseDef!.title,
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

      // Save assistant message
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
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the AI service. Make sure your ANTHROPIC_API_KEY is set and try again.",
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
    <div className="h-screen flex">
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
        completedItems={completedItems}
        onToggleItem={handleToggleItem}
        onNext={next ? () => handleNav(next) : undefined}
        onPrev={prev ? () => handleNav(prev) : undefined}
        hasNext={!!next}
        hasPrev={!!prev}
      />

      {/* Mobile chat toggle */}
      {isMobile && chatCollapsed && (
        <button
          onClick={() => setChatCollapsed(false)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-forge-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-forge-700 transition-colors z-50"
        >
          💬
        </button>
      )}

      {/* Chat panel - fixed overlay on mobile */}
      {(!isMobile || !chatCollapsed) && (
        <div
          className={
            isMobile
              ? "fixed inset-0 z-50 bg-white"
              : ""
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
