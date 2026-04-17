"use client";

import { useMemo, useState } from "react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Scale,
  Shield,
  ShieldAlert,
  ShieldX,
} from "lucide-react";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";

interface ReviewResultsProps {
  /** Raw markdown streamed from /api/bid-review. */
  analysis: string;
  /** True while tokens are still arriving. */
  isStreaming: boolean;
}

/**
 * Renders the streamed analysis from the bid-review API.
 *
 * The AI is instructed to follow a specific markdown shape. We extract
 * the Overall Risk Score, the 13 section headers (### 1., ### 2., etc.),
 * and the Questions/Redlines blocks for improved presentation. If the
 * structure isn't detected yet (e.g. while streaming), we fall back to
 * plain markdown rendering so the user sees progress.
 */
export function ReviewResults({ analysis, isStreaming }: ReviewResultsProps) {
  const parsed = useMemo(() => parseAnalysis(analysis), [analysis]);

  // During early streaming, show raw markdown only. We require at least
  // the overall-risk heading to render the structured UI.
  const showStructured = !!parsed.riskLevel;

  return (
    <div className="space-y-6">
      {showStructured && (
        <RiskBadge level={parsed.riskLevel ?? "UNKNOWN"} headline={parsed.headline} />
      )}

      {showStructured && parsed.topConcerns && (
        <div className="bg-cyber-darker border border-neon-amber/30 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-amber/60 to-transparent" />
          <h3 className="text-sm font-mono font-semibold text-neon-amber tracking-wider uppercase mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Top Concerns
          </h3>
          <MarkdownRenderer content={parsed.topConcerns} />
        </div>
      )}

      {showStructured && parsed.sections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-semibold text-neon-cyan tracking-wider uppercase flex items-center gap-2">
            <Scale className="w-4 h-4" /> Section-by-Section Analysis
          </h3>
          {parsed.sections.map((section, i) => (
            <SectionCard key={i} title={section.title} body={section.body} />
          ))}
        </div>
      )}

      {showStructured && parsed.attorneyQuestions && (
        <div className="bg-cyber-darker border border-neon-blue/30 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/60 to-transparent" />
          <h3 className="text-sm font-mono font-semibold text-neon-blue tracking-wider uppercase mb-3 flex items-center gap-2">
            ⚖️ Questions to Ask Your Attorney
          </h3>
          <MarkdownRenderer content={parsed.attorneyQuestions} />
        </div>
      )}

      {showStructured && parsed.redlines && (
        <div className="bg-cyber-darker border border-neon-magenta/30 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/60 to-transparent" />
          <h3 className="text-sm font-mono font-semibold text-neon-magenta tracking-wider uppercase mb-3 flex items-center gap-2">
            📝 Recommended Redlines
          </h3>
          <MarkdownRenderer content={parsed.redlines} />
        </div>
      )}

      {/* Fallback: always render raw streaming content if we haven't parsed yet */}
      {!showStructured && (
        <div className="bg-cyber-darker border border-cyber-border rounded-xl p-5">
          <MarkdownRenderer content={analysis || "_Analyzing..._"} />
          {isStreaming && (
            <span className="inline-flex gap-1 ml-1 mt-2">
              <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
              <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
              <span className="streaming-dot w-1.5 h-1.5 bg-neon-magenta rounded-full inline-block" />
            </span>
          )}
        </div>
      )}

      {showStructured && isStreaming && (
        <div className="text-xs font-mono text-neon-magenta animate-pulse">
          Analyzing more clauses...
        </div>
      )}
    </div>
  );
}

// ── Risk badge ───────────────────────────────────────────────

function RiskBadge({
  level,
  headline,
}: {
  level: RiskLevel;
  headline?: string;
}) {
  const config = RISK_CONFIG[level];
  const Icon = config.icon;
  return (
    <div
      className={`relative rounded-xl border-2 p-5 overflow-hidden ${config.bg} ${config.border} ${
        level === "CRITICAL" ? "animate-neon-pulse" : ""
      }`}
      style={{ boxShadow: config.shadow }}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${config.accent} to-transparent`}
      />
      <div className="flex items-center gap-4">
        <Icon className={`w-10 h-10 ${config.text} shrink-0`} />
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Overall Risk Score
          </div>
          <div className={`text-3xl font-mono font-bold ${config.text} mt-1`}>
            {level}
          </div>
          {headline && (
            <div className="text-sm text-text-secondary mt-2 leading-relaxed">
              {headline}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const RISK_CONFIG: Record<
  RiskLevel,
  {
    bg: string;
    border: string;
    text: string;
    accent: string;
    shadow: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  LOW: {
    bg: "bg-neon-green/5",
    border: "border-neon-green/50",
    text: "text-neon-green text-glow-green",
    accent: "via-neon-green/60",
    shadow: "0 0 20px rgba(0, 255, 65, 0.15)",
    icon: Shield,
  },
  MEDIUM: {
    bg: "bg-neon-amber/5",
    border: "border-neon-amber/50",
    text: "text-neon-amber",
    accent: "via-neon-amber/60",
    shadow: "0 0 20px rgba(255, 176, 0, 0.15)",
    icon: ShieldAlert,
  },
  HIGH: {
    bg: "bg-neon-red/5",
    border: "border-neon-red/60",
    text: "text-neon-red",
    accent: "via-neon-red/70",
    shadow: "0 0 25px rgba(255, 0, 60, 0.25)",
    icon: ShieldAlert,
  },
  CRITICAL: {
    bg: "bg-neon-red/10",
    border: "border-neon-red",
    text: "text-neon-red",
    accent: "via-neon-red",
    shadow: "0 0 30px rgba(255, 0, 60, 0.5), 0 0 60px rgba(255, 0, 60, 0.2)",
    icon: ShieldX,
  },
  UNKNOWN: {
    bg: "bg-cyber-surface",
    border: "border-cyber-border",
    text: "text-text-muted",
    accent: "via-cyber-border-bright",
    shadow: "none",
    icon: Shield,
  },
};

// ── Section card ─────────────────────────────────────────────

function SectionCard({ title, body }: { title: string; body: string }) {
  const [expanded, setExpanded] = useState(true);
  const severity = detectSeverity(body);
  const severityConfig = SEVERITY_CONFIG[severity];

  return (
    <div
      className={`rounded-lg border bg-cyber-darker overflow-hidden ${severityConfig.border}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-cyber-surface/50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg shrink-0" aria-hidden>
            {severityConfig.emoji}
          </span>
          <span className="font-mono font-semibold text-sm text-text-primary truncate">
            {title}
          </span>
          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${severityConfig.badge}`}
          >
            {severity}
          </span>
        </div>
        <div className="text-text-muted shrink-0">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-cyber-border/50">
          <div className="pt-3">
            <MarkdownRenderer content={body} />
          </div>
        </div>
      )}
    </div>
  );
}

type SectionSeverity = "OK" | "CAUTION" | "HIGH RISK" | "CRITICAL" | "NOTE";

function detectSeverity(body: string): SectionSeverity {
  const lower = body.toLowerCase();
  if (/❌|\bcritical\b/.test(body) || /\bcritical\b/.test(lower))
    return "CRITICAL";
  if (/🚨|\bhigh risk\b/.test(body) || /\bhigh risk\b/.test(lower))
    return "HIGH RISK";
  if (/⚠️|\bcaution\b/.test(body) || /\bcaution\b/.test(lower))
    return "CAUTION";
  if (/✅|\bok\b/.test(body)) return "OK";
  return "NOTE";
}

const SEVERITY_CONFIG: Record<
  SectionSeverity,
  { emoji: string; border: string; badge: string }
> = {
  OK: {
    emoji: "✅",
    border: "border-neon-green/30",
    badge: "bg-neon-green/10 text-neon-green border border-neon-green/30",
  },
  CAUTION: {
    emoji: "⚠️",
    border: "border-neon-amber/40",
    badge: "bg-neon-amber/10 text-neon-amber border border-neon-amber/30",
  },
  "HIGH RISK": {
    emoji: "🚨",
    border: "border-neon-red/50",
    badge: "bg-neon-red/10 text-neon-red border border-neon-red/40",
  },
  CRITICAL: {
    emoji: "❌",
    border: "border-neon-red",
    badge: "bg-neon-red/20 text-neon-red border border-neon-red",
  },
  NOTE: {
    emoji: "📄",
    border: "border-cyber-border",
    badge:
      "bg-cyber-surface text-text-muted border border-cyber-border-bright",
  },
};

// ── Markdown parser ──────────────────────────────────────────

interface ParsedAnalysis {
  riskLevel?: RiskLevel;
  headline?: string;
  topConcerns?: string;
  sections: Array<{ title: string; body: string }>;
  attorneyQuestions?: string;
  redlines?: string;
}

/**
 * Parses the AI's structured markdown output.
 * Tolerant of variations (the model occasionally drops emoji or uses
 * slightly different headers). Returns whatever it can find; missing
 * pieces simply don't render.
 */
function parseAnalysis(markdown: string): ParsedAnalysis {
  if (!markdown) return { sections: [] };

  const result: ParsedAnalysis = { sections: [] };

  // Risk level
  const riskMatch = markdown.match(
    /##\s*OVERALL\s*RISK\s*SCORE\s*\n+\**\s*\[?\s*(LOW|MEDIUM|HIGH|CRITICAL)\s*\]?\s*\**/i
  );
  if (riskMatch) {
    result.riskLevel = riskMatch[1].toUpperCase() as RiskLevel;
    // Headline: the first non-empty paragraph after the risk level
    const idx = markdown.indexOf(riskMatch[0]);
    const after = markdown.slice(idx + riskMatch[0].length);
    const headlineMatch = after.match(/\n+([^\n#][^\n]*)/);
    if (headlineMatch) {
      result.headline = headlineMatch[1].trim();
    }
  }

  // Top concerns
  const concernsMatch = markdown.match(
    /##\s*TOP\s*CONCERNS\s*\n+([\s\S]*?)(?=\n##\s|\n?$)/i
  );
  if (concernsMatch) {
    result.topConcerns = concernsMatch[1].trim();
  }

  // Sections — capture everything under "## SECTION-BY-SECTION ANALYSIS"
  const sectionsBlockMatch = markdown.match(
    /##\s*SECTION-BY-SECTION[^\n]*\n+([\s\S]*?)(?=\n##\s|$)/i
  );
  if (sectionsBlockMatch) {
    const block = sectionsBlockMatch[1];
    // Split on "### " headers
    const parts = block.split(/\n(?=###\s+)/);
    for (const part of parts) {
      const m = part.match(/^###\s+([^\n]+)\n([\s\S]*)/);
      if (m) {
        result.sections.push({
          title: m[1].trim(),
          body: m[2].trim(),
        });
      }
    }
  }

  // Attorney questions
  const attorneyMatch = markdown.match(
    /##\s*QUESTIONS\s*TO\s*ASK\s*YOUR\s*ATTORNEY\s*\n+([\s\S]*?)(?=\n##\s|$)/i
  );
  if (attorneyMatch) {
    result.attorneyQuestions = attorneyMatch[1].trim();
  }

  // Redlines
  const redlinesMatch = markdown.match(
    /##\s*RECOMMENDED\s*REDLINES?\s*\n+([\s\S]*?)(?=\n##\s|$)/i
  );
  if (redlinesMatch) {
    result.redlines = redlinesMatch[1].trim();
  }

  return result;
}
