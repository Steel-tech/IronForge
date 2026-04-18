"use client"

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import * as React from "react"

import { cn } from "@/lib/utils"

type Spark = {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  color: string
}

export interface ClickSparkProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  sparkColor?: string
  sparkCount?: number
  /**
   * If set, sparks only emit when this function returns true for a given event.
   * Useful to only spark on "check" (not "uncheck").
   */
  shouldSpark?: (e: React.MouseEvent<HTMLDivElement>) => boolean
}

let sparkIdCounter = 0

export function ClickSpark({
  children,
  sparkColor = "var(--neon-cyan, #22d3ee)",
  sparkCount = 10,
  shouldSpark,
  className,
  onClick,
  ...props
}: ClickSparkProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [sparks, setSparks] = React.useState<Spark[]>([])

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      if (shouldSpark && !shouldSpark(e)) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newSparks: Spark[] = Array.from({ length: sparkCount }).map(
        (_, i) => ({
          id: ++sparkIdCounter,
          x,
          y,
          angle: (Math.PI * 2 * i) / sparkCount + Math.random() * 0.4,
          distance: 24 + Math.random() * 24,
          color: sparkColor,
        })
      )

      setSparks((prev) => [...prev, ...newSparks])

      const ids = new Set(newSparks.map((s) => s.id))
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !ids.has(s.id)))
      }, 650)
    },
    [onClick, shouldSpark, sparkColor, sparkCount]
  )

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {sparks.map((s) => {
          const dx = Math.cos(s.angle) * s.distance
          const dy = Math.sin(s.angle) * s.distance
          return (
            <span
              key={s.id}
              className="click-spark-particle absolute block h-1.5 w-1.5 rounded-full"
              style={
                {
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 8px ${s.color}, 0 0 16px ${s.color}`,
                  // CSS custom props consumed by keyframes
                  ["--dx" as string]: `${dx}px`,
                  ["--dy" as string]: `${dy}px`,
                } as React.CSSProperties
              }
            />
          )
        })}
      </div>
      <style jsx>{`
        .click-spark-particle {
          transform: translate(-50%, -50%);
          animation: click-spark-burst 600ms ease-out forwards;
        }
        @keyframes click-spark-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
                calc(-50% + var(--dx)),
                calc(-50% + var(--dy))
              )
              scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default ClickSpark
