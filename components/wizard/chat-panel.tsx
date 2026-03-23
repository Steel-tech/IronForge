"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "@/lib/types/chat";
import type { Step } from "@/lib/types/content";
import type { UserProfile } from "@/lib/types/wizard";
import { X, Send, MessageSquare } from "lucide-react";
import { IBeamIcon } from "@/components/ui/ibeam-icon";

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
      <div className="w-12 bg-cyber-darker border-l border-cyber-border flex flex-col items-center pt-4">
        <button
          onClick={onToggle}
          className="p-2 text-neon-magenta hover:bg-neon-magenta/10 rounded-lg transition-all"
          title="Open AI Mentor Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-cyber-darker border-l border-cyber-border flex flex-col relative">
      {/* Left neon accent */}
      <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-neon-magenta/40 via-neon-magenta/10 to-transparent" />

      {/* Header */}
      <div className="p-4 border-b border-cyber-border flex items-center justify-between relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-magenta/40 via-transparent to-transparent" />
        <div>
          <div className="font-mono font-semibold text-neon-magenta text-xs tracking-wider uppercase flex items-center gap-1.5">
            <IBeamIcon className="w-3.5 h-3.5" />
            IRONFORGE MENTOR
          </div>
          <div className="text-[10px] text-text-muted font-mono mt-0.5">
            AI-powered guidance for this step
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-text-muted hover:text-neon-magenta rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && !isStreaming && (
          <div className="space-y-4">
            <div className="text-center text-text-muted text-xs font-mono py-4">
              <div className="text-2xl mb-2">⚒️</div>
              <p>
                Ask me anything about{" "}
                <span className="text-neon-cyan">{step.title}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                Suggested:
              </div>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(q)}
                  className="w-full text-left text-xs p-3 rounded-lg border border-cyber-border text-text-secondary hover:border-neon-magenta/30 hover:bg-neon-magenta/5 transition-all font-mono"
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
            {msg.role === "user" ? (
              <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed bg-neon-cyan/10 border border-neon-cyan/20 text-text-primary">
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ) : (
              <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed bg-cyber-surface border border-cyber-border relative">
                <div className="absolute top-0 bottom-0 left-0 w-0.5 rounded-full bg-neon-magenta/40" />
                <div className="whitespace-pre-wrap text-text-secondary pl-1">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="animate-fade-in">
            <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed bg-cyber-surface border border-cyber-border relative">
              <div className="absolute top-0 bottom-0 left-0 w-0.5 rounded-full bg-neon-magenta/40 animate-neon-pulse" />
              <div className="whitespace-pre-wrap text-text-secondary pl-1">
                {streamingContent}
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-cyber-border">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this step..."
            rows={1}
            className="flex-1 px-3 py-2.5 rounded-lg bg-cyber-dark border border-cyber-border text-text-primary placeholder-text-muted font-mono text-sm resize-none cyber-focus transition-all"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-3 py-2.5 rounded-lg btn-neon-magenta disabled:opacity-30 disabled:cursor-not-allowed text-sm font-mono font-medium transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[10px] text-text-muted mt-1.5 px-1 font-mono">
          AI responses are educational. Verify at official sources.
        </div>
      </form>
    </div>
  );
}
