#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Adds `SPDX-License-Identifier: AGPL-3.0-or-later` + copyright header to
 * every source file in the repo. Idempotent — re-running is a no-op once
 * headers are in place. Respects `"use client"` / `"use server"` pragmas
 * and shebangs by inserting the header *after* them.
 *
 * Usage:
 *   node scripts/add-spdx-headers.mjs          # dry-run (prints plan)
 *   node scripts/add-spdx-headers.mjs --write  # apply changes
 */

import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const WRITE = process.argv.includes("--write");

const COPYRIGHT_YEAR = new Date().getFullYear();
const COPYRIGHT_HOLDER = "Steel-Tech / StructuPath";
const SPDX_ID = "AGPL-3.0-or-later";

const SLASH_HEADER = [
  `// SPDX-License-Identifier: ${SPDX_ID}`,
  `// Copyright (C) ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}`,
  ``,
].join("\n");

const CSS_HEADER = [
  `/* SPDX-License-Identifier: ${SPDX_ID} */`,
  `/* Copyright (C) ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER} */`,
  ``,
].join("\n");

const PATTERNS = [
  "*.ts",
  "*.tsx",
  "*.mjs",
  "*.js",
  "*.jsx",
  "*.css",
];

const EXCLUDE = [
  "node_modules",
  ".next",
  ".git",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
  "package-lock.json",
];

function listFiles() {
  const args = PATTERNS.map((p) => `-name "${p}"`).join(" -o ");
  const excl = EXCLUDE.map((e) => `-not -path "*/${e}/*" -not -name "${e}"`).join(" ");
  const cmd = `find . -type f \\( ${args} \\) ${excl} -not -name "*.d.ts"`;
  const out = execSync(cmd, { encoding: "utf8" });
  return out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => (p.startsWith("./") ? p.slice(2) : p))
    .sort();
}

function pickHeader(file) {
  const ext = path.extname(file);
  return ext === ".css" ? CSS_HEADER : SLASH_HEADER;
}

function alreadyHasHeader(content) {
  // first 400 chars
  return /SPDX-License-Identifier/.test(content.slice(0, 400));
}

/**
 * Insert the header at the right position:
 *  - after a shebang line (`#!/usr/bin/env node`), OR
 *  - after a leading "use client" / "use server" / "use strict" directive, OR
 *  - at the very top otherwise.
 */
function insertHeader(content, header) {
  const lines = content.split("\n");
  let insertAt = 0;

  if (lines[0]?.startsWith("#!")) insertAt = 1;

  // Skip a single leading directive like `"use client";`
  const directiveLine = lines[insertAt]?.trim();
  if (
    directiveLine &&
    /^["'](use client|use server|use strict)["'];?\s*$/.test(directiveLine)
  ) {
    insertAt += 1;
    // skip blank line after the directive if present
    if (lines[insertAt]?.trim() === "") insertAt += 1;
  }

  const before = lines.slice(0, insertAt).join("\n");
  const after = lines.slice(insertAt).join("\n");
  const separator = before.length ? "\n" : "";
  return `${before}${separator}${header}${after}`;
}

async function main() {
  const files = listFiles();
  const planned = [];
  const skipped = [];

  for (const f of files) {
    const content = await readFile(f, "utf8");
    if (alreadyHasHeader(content)) {
      skipped.push(f);
      continue;
    }
    const header = pickHeader(f);
    const next = insertHeader(content, header);
    planned.push({ file: f, next });
  }

  console.log(`Files scanned:  ${files.length}`);
  console.log(`Already tagged: ${skipped.length}`);
  console.log(`Will update:    ${planned.length}`);

  if (!WRITE) {
    console.log("\nDry run. Re-run with --write to apply.");
    for (const p of planned.slice(0, 10)) console.log(`  +  ${p.file}`);
    if (planned.length > 10) console.log(`  ... and ${planned.length - 10} more`);
    return;
  }

  for (const { file, next } of planned) {
    await writeFile(file, next);
  }
  console.log(`\nApplied headers to ${planned.length} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
