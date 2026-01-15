/**
 * scripts/generate-component.ts
 *
 * Simple scaffolder for feature modules.
 * Usage:
 *   pnpm ts-node scripts/generate-component.ts FeatureName
 *
 * Creates:
 * /features/feature-name/{types,utils,hooks,components}/FeatureNamePage.tsx
 */

import fs from "node:fs";
import path from "node:path";

function toKebab(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p: string, c: string) {
  fs.writeFileSync(p, c, "utf8");
}

function main() {
  const name = process.argv[2];
  if (!name) {
    console.error("Provide a feature name, e.g. FeatureName");
    process.exit(1);
  }

  const kebab = toKebab(name);
  const root = path.join(process.cwd(), "features", kebab);

  const dirs = ["types", "utils", "hooks", "components"];
  for (const d of dirs) ensureDir(path.join(root, d));

  const pagePath = path.join(root, `${name}Page.tsx`);
  const indexPath = path.join(root, "index.ts");

  if (!fs.existsSync(pagePath)) {
    writeFile(
      pagePath,
      `/**
 * features/${kebab}/${name}Page.tsx
 *
 * Page orchestrator for ${name}.
 *
 * Related:
 * - features/${kebab}/hooks
 * - features/${kebab}/components
 */
export default function ${name}Page() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">${name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Scaffolded feature page.</p>
    </main>
  );
}
`
    );
  }

  if (!fs.existsSync(indexPath)) {
    writeFile(
      indexPath,
      `/**
 * features/${kebab}/index.ts
 *
 * Barrel exports for ${name} feature.
 */
export { default as ${name}Page } from "./${name}Page";
`
    );
  }

  console.log(`Created feature scaffold at: features/${kebab}`);
}

main();
