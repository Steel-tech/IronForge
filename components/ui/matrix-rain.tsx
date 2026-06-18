"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
  color?: string;
  speed?: number;
}

// Cap the effective frame rate so the rain never burns a full 60fps of
// CPU/GPU. ~30fps keeps the effect smooth enough while halving the work on
// low-power devices.
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export function MatrixRain({
  className = "",
  opacity = 0.12,
  color = "#00ff41",
  speed = 1,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: number[] = [];
    let lastFrame = 0;

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF⚒⛓⚙";
    const charArray = chars.split("");
    const fontSize = 14;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const columnCount = Math.floor(canvas.width / fontSize);
      columns = Array(columnCount)
        .fill(0)
        .map(() => Math.random() * -100);
    }

    // Render one frame of the rain. Pulled out so we can paint a single
    // static frame for reduced-motion users without entering the rAF loop.
    function renderFrame() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = `rgba(10, 10, 15, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        // Brighter head character
        if (Math.random() > 0.5) {
          ctx.fillStyle = "#ffffff";
          ctx.fillText(char, x, y);
          ctx.fillStyle = color;
        } else {
          ctx.fillText(char, x, y);
        }

        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }
        columns[i] += speed;
      }
    }

    // Frame-rate-capped loop: rAF still drives timing (so it pauses when the
    // tab is hidden and stays in sync with the display), but we only repaint
    // once at least FRAME_INTERVAL has elapsed.
    function loop(now: number) {
      animationId = requestAnimationFrame(loop);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      renderFrame();
    }

    resize();

    const handleResize = () => {
      resize();
      // Reduced-motion users get a fresh static frame after a resize.
      if (reducedMotion) renderFrame();
    };
    window.addEventListener("resize", handleResize);

    // Reduced motion: paint one calm static frame and never start the loop.
    if (reducedMotion) {
      renderFrame();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    // Pause the loop while the tab is hidden — no point animating an
    // unfocused tab — and resume on return. Reset the frame clock so we
    // don't fast-forward a backlog of frames on resume.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        lastFrame = 0;
        animationId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (!document.hidden) {
      animationId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [color, speed, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`matrix-rain-container absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
