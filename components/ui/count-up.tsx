"use client"

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import * as React from "react"

import { cn } from "@/lib/utils"

export interface CountUpProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "prefix"> {
  end: number
  /** duration in ms */
  duration?: number
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  /** Number of decimal places to show */
  decimals?: number
  className?: string
  /** Retrigger when end changes (default true) */
  retriggerOnChange?: boolean
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function CountUp({
  end,
  duration = 1200,
  prefix,
  suffix,
  decimals = 0,
  retriggerOnChange = true,
  className,
  ...props
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = React.useState(0)
  const [started, setStarted] = React.useState(false)

  // Observe when element enters viewport
  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // When end changes, allow retrigger
  React.useEffect(() => {
    if (!retriggerOnChange) return
    // reset so animation runs again
    setValue(0)
  }, [end, retriggerOnChange])

  // Run the RAF animation
  React.useEffect(() => {
    if (!started) return
    let rafId = 0
    const startTime = performance.now()
    const from = 0
    const to = end

    const step = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / Math.max(1, duration))
      const eased = easeOutCubic(t)
      const current = from + (to - from) * eased
      setValue(current)
      if (t < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        setValue(to)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [started, end, duration])

  const formatted = React.useMemo(() => {
    const factor = Math.pow(10, decimals)
    const rounded = Math.round(value * factor) / factor
    return rounded.toFixed(decimals)
  }, [value, decimals])

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export default CountUp
