"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Cyberpunk-themed markdown renderer.
 *
 * Uses react-markdown with remark-gfm (tables, strikethrough, task lists)
 * and rehype-highlight (syntax highlighting for fenced code blocks). All
 * elements are styled with the IronForge neon palette.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "markdown-body text-sm leading-relaxed text-text-secondary break-words",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "font-mono text-neon-cyan text-glow-cyan text-base font-bold uppercase tracking-wider mt-4 mb-2 first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "font-mono text-neon-cyan text-sm font-semibold uppercase tracking-wide mt-3 mb-1.5 first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                "font-mono text-neon-cyan/90 text-xs font-semibold uppercase tracking-wide mt-2.5 mb-1 first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          h4: ({ className, ...props }) => (
            <h4
              className={cn(
                "font-mono text-text-primary text-xs font-semibold uppercase tracking-wide mt-2 mb-1 first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn("my-2 first:mt-0 last:mb-0", className)}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn(
                "my-2 pl-4 space-y-1 list-none [&>li]:relative [&>li]:pl-4",
                "[&>li]:before:content-['▸'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:text-neon-green [&>li]:before:font-mono",
                className,
              )}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn(
                "my-2 pl-6 space-y-1 list-decimal marker:text-neon-green marker:font-mono",
                className,
              )}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("text-text-secondary", className)} {...props} />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "text-neon-blue underline decoration-neon-blue/40 underline-offset-2 transition-all hover:text-neon-cyan hover:decoration-neon-cyan/70 hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)]",
                className,
              )}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ className, ...props }) => (
            <strong
              className={cn("font-semibold text-text-primary", className)}
              {...props}
            />
          ),
          em: ({ className, ...props }) => (
            <em className={cn("italic text-text-primary/90", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "my-3 pl-3 py-1 border-l-2 border-neon-magenta/60 bg-neon-magenta/5 text-text-secondary italic",
                className,
              )}
              {...props}
            />
          ),
          hr: ({ className, ...props }) => (
            <hr
              className={cn("my-4 border-0 h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent", className)}
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <code
                  className={cn(
                    "font-mono text-xs text-neon-green",
                    className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20",
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "my-3 p-3 rounded-lg overflow-x-auto bg-cyber-dark border border-cyber-border text-xs font-mono text-neon-green scrollbar-thin",
                className,
              )}
              {...props}
            />
          ),
          table: ({ className, ...props }) => (
            <div className="my-3 overflow-x-auto scrollbar-thin rounded-lg border border-cyber-border">
              <table
                className={cn(
                  "w-full text-xs font-mono border-collapse",
                  className,
                )}
                {...props}
              />
            </div>
          ),
          thead: ({ className, ...props }) => (
            <thead
              className={cn("bg-cyber-dark border-b border-cyber-border", className)}
              {...props}
            />
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn(
                "px-3 py-2 text-left text-neon-cyan font-semibold uppercase tracking-wider text-[10px]",
                className,
              )}
              {...props}
            />
          ),
          tr: ({ className, ...props }) => (
            <tr
              className={cn(
                "border-b border-cyber-border/60 last:border-0 hover:bg-cyber-surface/40 transition-colors",
                className,
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td
              className={cn("px-3 py-2 text-text-secondary", className)}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
