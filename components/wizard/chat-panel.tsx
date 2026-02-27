"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "@/lib/types/chat";
import type { Step } from "@/lib/types/content";
import type { UserProfile } from "@/lib/types/wizard";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  step: Step;
  profile: UserProfile;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isStreaming,
  streamingContent,
  step,
  collapsed,
  onToggle,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const suggestedQuestions = [
    `What's the first thing I should do for "${step.title}"?`,
    "How much will this cost me total?",
    "What mistakes should I avoid here?",
  ];

  if (collapsed) {
    return (
      <div className="w-12 bg-white border-l border-iron-200 flex flex-col items-center pt-4">
        <button
          onClick={onToggle}
          className="p-2 text-forge-600 hover:bg-forge-50 rounded-lg"
          title="Open AI Mentor Chat"
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-iron-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-iron-100 flex items-center justify-between">
        <div>
          <div className="font-semibold text-iron-900 text-sm">
            ⚒️ IronForge Mentor
          </div>
          <div className="text-xs text-iron-500">
            Ask me anything about this step
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1 text-iron-400 hover:text-iron-600 rounded text-sm"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && !isStreaming && (
          <div className="space-y-4">
            <div className="text-center text-iron-400 text-sm py-4">
              <div className="text-2xl mb-2">🔨</div>
              <p>
                I&apos;m your IronForge mentor. Ask me anything about{" "}
                <strong className="text-iron-600">{step.title}</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-iron-400 uppercase tracking-wide">
                Try asking:
              </div>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(q)}
                  className="w-full text-left text-sm p-2.5 rounded-lg border border-iron-200 text-iron-600 hover:border-forge-300 hover:bg-forge-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in ${
              msg.role === "user" ? "flex justify-end" : ""
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-forge-600 text-white"
                  : "bg-iron-100 text-iron-800"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="animate-fade-in">
            <div className="max-w-[85%] bg-iron-100 text-iron-800 rounded-xl px-4 py-2.5 text-sm leading-relaxed">
              <div className="whitespace-pre-wrap">{streamingContent}</div>
              <span className="inline-flex gap-1 ml-1">
                <span className="streaming-dot w-1 h-1 bg-iron-400 rounded-full inline-block" />
                <span className="streaming-dot w-1 h-1 bg-iron-400 rounded-full inline-block" />
                <span className="streaming-dot w-1 h-1 bg-iron-400 rounded-full inline-block" />
              </span>
            </div>
          </div>
        )}

        {isStreaming && !streamingContent && (
          <div className="animate-fade-in">
            <div className="max-w-[85%] bg-iron-100 rounded-xl px-4 py-3 text-sm">
              <span className="inline-flex gap-1">
                <span className="streaming-dot w-1.5 h-1.5 bg-iron-400 rounded-full inline-block" />
                <span className="streaming-dot w-1.5 h-1.5 bg-iron-400 rounded-full inline-block" />
                <span className="streaming-dot w-1.5 h-1.5 bg-iron-400 rounded-full inline-block" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-iron-100">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this step..."
            rows={1}
            className="flex-1 px-3 py-2 rounded-lg border border-iron-300 focus:border-forge-500 focus:ring-1 focus:ring-forge-500 outline-none text-sm resize-none"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2 bg-forge-600 text-white rounded-lg hover:bg-forge-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-iron-400 mt-1.5 px-1">
          AI responses are educational. Verify all regulatory details at official sources.
        </div>
      </form>
    </div>
  );
}
