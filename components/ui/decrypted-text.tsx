"use client"

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import * as React from "react"

import { cn } from "@/lib/utils"

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

export interface DecryptedTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string
  /** ms between each "scramble" tick */
  speed?: number
  /** how many scramble ticks per character before it locks in */
  revealIterations?: number
  characters?: string
  className?: string
  /** If true, restart animation when `text` changes */
  restartOnTextChange?: boolean
}

export function DecryptedText({
  text,
  speed = 40,
  revealIterations = 3,
  characters = DEFAULT_CHARS,
  restartOnTextChange = true,
  className,
  ...props
}: DecryptedTextProps) {
  const [display, setDisplay] = React.useState(text)

  React.useEffect(() => {
    let cancelled = false
    let frame = 0
    const total = text.length * revealIterations
    const chars = characters

    const randomChar = () =>
      chars.charAt(Math.floor(Math.random() * chars.length))

    const tick = () => {
      if (cancelled) return
      const progress = frame / revealIterations
      const revealed = Math.min(text.length, Math.floor(progress))

      let out = ""
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === " " || ch === "\n") {
          out += ch
        } else if (i < revealed) {
          out += ch
        } else {
          out += randomChar()
        }
      }
      setDisplay(out)

      frame += 1
      if (frame <= total) {
        window.setTimeout(tick, speed)
      } else {
        setDisplay(text)
      }
    }

    // start scrambled
    setDisplay(
      text
        .split("")
        .map((c) => (c === " " || c === "\n" ? c : randomChar()))
        .join("")
    )
    const id = window.setTimeout(tick, speed)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
    // restartOnTextChange controls whether text changes re-run effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartOnTextChange ? text : null, speed, revealIterations, characters])

  return (
    <span
      className={cn("inline-block tabular-nums", className)}
      aria-label={text}
      {...props}
    >
      {display}
    </span>
  )
}

export default DecryptedText
