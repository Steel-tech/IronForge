"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
  color?: string;
  speed?: number;
}

export function MatrixRain({
  className = "",
  opacity = 0.12,
  color = "#00ff41",
  speed = 1,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: number[] = [];

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

    function draw() {
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

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
