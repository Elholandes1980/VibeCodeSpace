/**
 * scripts/check-architecture.ts
 *
 * Architecture guardrail checker:
 * - file size limits
 * - required header comment presence
 * - basic folder structure expectations
 *
 * Why: keeps the codebase readable and AI-friendly.
 */

import fs from "node:fs";
import path from "node:path";

type Violation = { file: string; type: string; details: string };

const ROOT = process.cwd();
const TARGET_MAX = 300;
const WARN_MAX = 500;

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  ".vercel",
]);

const IGNORE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
  ".ico",
  ".zip",
  ".pdf",
  ".lock",
]);

function walk(dir: string, out: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else {
      const ext = path.extname(e.name);
      if (IGNORE_EXT.has(ext)) continue;
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

function countLines(content: string) {
  // counts newline-separated lines; includes whitespace and comments
  return content.split(/\r?\n/).length;
}

function hasHeaderComment(content: string) {
  // Simple heuristic: file starts with /** ... */
  const trimmed = content.trimStart();
  return trimmed.startsWith("/**");
}

function isCodeFile(file: string) {
  return (
    file.endsWith(".ts") ||
    file.endsWith(".tsx") ||
    file.endsWith(".js") ||
    file.endsWith(".jsx")
  );
}

function checkFile(file: string): Violation[] {
  const rel = path.relative(ROOT, file);
  let content: string;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    return [{ file: rel, type: "read_error", details: "Cannot read file" }];
  }

  const violations: Violation[] = [];
  const lines = countLines(content);

  if (isCodeFile(file)) {
    if (!hasHeaderComment(content)) {
      violations.push({
        file: rel,
        type: "missing_header",
        details: "File must start with /** header comment */",
      });
    }
  }

  if (lines > WARN_MAX) {
    violations.push({
      file: rel,
      type: "file_too_large_error",
      details: `>${WARN_MAX} lines (${lines}) — must split`,
    });
  } else if (lines > TARGET_MAX) {
    violations.push({
      file: rel,
      type: "file_too_large_warning",
      details: `>${TARGET_MAX} lines (${lines}) — refactor recommended`,
    });
  }

  return violations;
}

function formatViolations(vs: Violation[]) {
  const grouped = vs.reduce<Record<string, Violation[]>>((acc, v) => {
    acc[v.type] ??= [];
    acc[v.type].push(v);
    return acc;
  }, {});
  const lines: string[] = [];
  for (const [type, items] of Object.entries(grouped)) {
    lines.push(`\n== ${type} (${items.length}) ==`);
    for (const it of items) {
      lines.push(`- ${it.file}: ${it.details}`);
    }
  }
  return lines.join("\n");
}

function main() {
  const files = walk(ROOT);
  const violations: Violation[] = [];
  for (const file of files) {
    violations.push(...checkFile(file));
  }

  const errors = violations.filter((v) => v.type.includes("_error") || v.type === "missing_header");
  const warnings = violations.filter((v) => !errors.includes(v));

  if (warnings.length) {
    console.log(formatViolations(warnings));
  }

  if (errors.length) {
    console.error(formatViolations(errors));
    process.exit(1);
  }

  console.log("Architecture check passed ✅");
}

main();
