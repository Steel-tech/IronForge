"use client"

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimatedDirection = "up" | "down" | "left" | "right"

export interface AnimatedContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  direction?: AnimatedDirection
  /** distance in px to travel from */
  distance?: number
  /** duration in ms */
  duration?: number
  /** delay in ms */
  delay?: number
  className?: string
  /** If true, only animate once when first entering viewport */
  once?: boolean
  /** IntersectionObserver threshold */
  threshold?: number
}

function offsetFor(direction: AnimatedDirection, distance: number): string {
  switch (direction) {
    case "up":
      return `translate3d(0, ${distance}px, 0)`
    case "down":
      return `translate3d(0, -${distance}px, 0)`
    case "left":
      return `translate3d(${distance}px, 0, 0)`
    case "right":
      return `translate3d(-${distance}px, 0, 0)`
  }
}

export function AnimatedContent({
  children,
  direction = "up",
  distance = 24,
  duration = 600,
  delay = 0,
  once = true,
  threshold = 0.15,
  className,
  style,
  ...props
}: AnimatedContentProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once, threshold])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transform: visible ? "translate3d(0,0,0)" : offsetFor(direction, distance),
        opacity: visible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
        willChange: "transform, opacity",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default AnimatedContent
