// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * SkeletonLine — animated shimmer bar.
 * Pass `className` to set width/height (default h-3 w-full).
 */
export function SkeletonLine({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("h-3 w-full rounded skeleton-shimmer", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * SkeletonCard — card-shaped skeleton with neon border pulse.
 */
export function SkeletonCard({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-xl skeleton-card p-4", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * StepContentSkeleton — full-screen placeholder matching the wizard
 * step-content layout (header, description, checklist, resources, nav).
 */
export function StepContentSkeleton() {
  return (
    <div
      className="flex-1 overflow-y-auto bg-cyber-black"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Phase label */}
        <SkeletonLine className="h-3 w-32" />

        {/* Title */}
        <SkeletonLine className="h-8 w-3/4" />

        {/* Subtitle / description */}
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-5/6" />
        </div>

        {/* Meta row (time + cost) */}
        <div className="flex gap-3">
          <SkeletonCard className="flex-1 h-20" />
          <SkeletonCard className="flex-1 h-20" />
        </div>

        {/* Checklist card */}
        <SkeletonCard className="space-y-3">
          <SkeletonLine className="h-4 w-1/3" />
          <div className="space-y-3 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded border border-cyber-border skeleton-shimmer" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonLine className="h-3 w-2/3" />
                  <SkeletonLine className="h-2.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Resources */}
        <SkeletonCard className="space-y-3">
          <SkeletonLine className="h-4 w-1/4" />
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-3 w-4/5" />
          <SkeletonLine className="h-3 w-3/5" />
        </SkeletonCard>

        {/* Nav buttons */}
        <div className="flex justify-between pt-4">
          <SkeletonLine className="h-10 w-28" />
          <SkeletonLine className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

/**
 * ChatPanelSkeleton — placeholder matching the right-rail chat panel.
 */
export function ChatPanelSkeleton() {
  return (
    <div
      className="hidden lg:flex w-96 bg-cyber-darker border-l border-cyber-border flex-col"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header */}
      <div className="p-4 border-b border-cyber-border space-y-2">
        <SkeletonLine className="h-3 w-2/3" />
        <SkeletonLine className="h-2.5 w-1/2" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        <SkeletonCard className="space-y-2">
          <SkeletonLine className="h-3 w-3/4" />
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-3 w-5/6" />
        </SkeletonCard>

        <div className="flex justify-end">
          <SkeletonCard className="w-2/3 space-y-2 !border-neon-cyan/20">
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-4/5" />
          </SkeletonCard>
        </div>

        <SkeletonCard className="space-y-2">
          <SkeletonLine className="h-3 w-2/3" />
          <SkeletonLine className="h-3 w-full" />
        </SkeletonCard>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-cyber-border">
        <SkeletonLine className="h-10 w-full" />
      </div>
    </div>
  );
}
