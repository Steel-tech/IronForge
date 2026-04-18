"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
interface TronGridProps {
  className?: string;
}

export function TronGrid({ className = "" }: TronGridProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Perspective grid floor */}
      <div className="tron-floor" />

      {/* Horizontal glow line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          top: "50%",
          background:
            "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.15), rgba(0, 240, 255, 0.3), rgba(0, 240, 255, 0.15), transparent)",
          boxShadow: "0 0 20px rgba(0, 240, 255, 0.1)",
        }}
      />

      {/* Vertical accent lines */}
      <div
        className="absolute top-0 bottom-0 w-px opacity-20"
        style={{
          left: "20%",
          background:
            "linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.2), transparent)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-px opacity-20"
        style={{
          right: "20%",
          background:
            "linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.2), transparent)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-px bg-neon-cyan/20" />
        <div className="absolute top-0 left-0 w-px h-full bg-neon-cyan/20" />
      </div>
      <div className="absolute top-6 right-6 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-px bg-neon-cyan/20" />
        <div className="absolute top-0 right-0 w-px h-full bg-neon-cyan/20" />
      </div>
      <div className="absolute bottom-6 left-6 w-12 h-12">
        <div className="absolute bottom-0 left-0 w-full h-px bg-neon-cyan/20" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-neon-cyan/20" />
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-12">
        <div className="absolute bottom-0 right-0 w-full h-px bg-neon-cyan/20" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-neon-cyan/20" />
      </div>
    </div>
  );
}
