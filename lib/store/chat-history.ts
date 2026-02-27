"use client";

import type { ChatMessage, ChatState } from "@/lib/types/chat";

const STORAGE_KEY = "ironforge_chat_history";

export function loadChatHistory(): ChatState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ChatState;
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
