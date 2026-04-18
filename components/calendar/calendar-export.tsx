"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { Download } from "lucide-react";
import type { ComplianceEvent } from "@/lib/calendar/compliance-dates";

interface CalendarExportProps {
  events: ComplianceEvent[];
  filename?: string;
}

/** Escape text per RFC 5545 (backslash, semicolon, comma, newline). */
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Format a Date as UTC DTSTART value: YYYYMMDDTHHMMSSZ. */
function formatICSDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

/** Fold long lines to <=75 octets per RFC 5545. (We approximate with chars.) */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    chunks.push(line.slice(i, i + 75));
    i += 75;
  }
  return chunks.join("\r\n ");
}

export function buildICS(events: ComplianceEvent[]): string {
  const now = new Date();
  const dtstamp = formatICSDate(now);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IronForge//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:IronForge Compliance",
    "X-WR-TIMEZONE:UTC",
  ];

  for (const e of events) {
    const dtstart = formatICSDate(e.date);
    // 1-hour default event window
    const end = new Date(e.date);
    end.setUTCHours(end.getUTCHours() + 1);
    const dtend = formatICSDate(end);

    const alarmTrigger =
      e.priority === "critical"
        ? "-P7D"
        : e.priority === "important"
          ? "-P3D"
          : "-P1D";
    const alarmDesc =
      e.priority === "critical"
        ? `${e.title} due in 7 days`
        : e.priority === "important"
          ? `${e.title} due in 3 days`
          : `${e.title} due tomorrow`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${e.id}@ironforge.app`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(foldLine(`SUMMARY:${icsEscape(e.title)}`));
    lines.push(foldLine(`DESCRIPTION:${icsEscape(e.description)}`));
    lines.push(
      `CATEGORIES:${e.category.toUpperCase()},${e.priority.toUpperCase()}`,
    );
    lines.push(
      `PRIORITY:${e.priority === "critical" ? 1 : e.priority === "important" ? 5 : 9}`,
    );
    lines.push("BEGIN:VALARM");
    lines.push(`TRIGGER:${alarmTrigger}`);
    lines.push("ACTION:DISPLAY");
    lines.push(foldLine(`DESCRIPTION:${icsEscape(alarmDesc)}`));
    lines.push("END:VALARM");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

export function CalendarExport({
  events,
  filename = "ironforge-compliance.ics",
}: CalendarExportProps) {
  function handleExport() {
    const ics = buildICS(events);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={events.length === 0}
      className="btn-neon-cyan px-4 py-2 rounded font-mono text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Export to Calendar (.ics)
    </button>
  );
}
