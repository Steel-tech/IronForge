"use client"

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import * as React from "react"

import { cn } from "@/lib/utils"

export interface SpotlightCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  /** CSS color for the spotlight glow */
  spotlightColor?: string
  /** Spotlight radius in pixels */
  radius?: number
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "var(--neon-cyan, rgba(34, 211, 238, 0.25))",
  radius = 320,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)

  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(e)
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [onMouseMove]
  )

  const handleLeave = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e)
      setPos(null)
    },
    [onMouseLeave]
  )

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos ? 1 : 0,
          background: pos
            ? `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`
            : undefined,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default SpotlightCard
