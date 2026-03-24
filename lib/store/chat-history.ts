"use client";

import type { ChatMessage, ChatState } from "@/lib/types/chat";

const STORAGE_KEY = "ironforge_chat_history";

function isValidChatState(data: unknown): data is ChatState {
  if (typeof data !== "object" || data === null) return false;
  for (const [key, messages] of Object.entries(data as Record<string, unknown>)) {
    if (typeof key !== "string" || !/^[a-z-]+:[a-z-]+$/.test(key)) return false;
    if (!Array.isArray(messages)) return false;
    for (const msg of messages) {
      if (typeof msg !== "object" || msg === null) return false;
      const m = msg as Record<string, unknown>;
      if (typeof m.id !== "string") return false;
      if (m.role !== "user" && m.role !== "assistant") return false;
      if (typeof m.content !== "string" || m.content.length > 10_000) return false;
      if (typeof m.timestamp !== "number") return false;
    }
  }
  return true;
}

export function loadChatHistory(): ChatState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isValidChatState(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveChatHistory(state: ChatState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full
  }
}

export function getChatKey(phaseId: string, stepId: string): string {
  return `${phaseId}:${stepId}`;
}

export function getStepMessages(
  state: ChatState,
  phaseId: string,
  stepId: string
): ChatMessage[] {
  return state[getChatKey(phaseId, stepId)] ?? [];
}

export function addMessage(
  state: ChatState,
  phaseId: string,
  stepId: string,
  message: ChatMessage
): ChatState {
  const key = getChatKey(phaseId, stepId);
  return {
    ...state,
    [key]: [...(state[key] ?? []), message],
  };
}
