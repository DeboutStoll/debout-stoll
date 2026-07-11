#!/usr/bin/env node
/**
 * Extracts the base64-embedded images from legacy/index.html into public/img.
 * The migration already did this once; keep this script so the original static
 * page remains the single source of truth for the imagery.
 *
 * Usage: npm run extract:legacy
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const legacy = join(root, 'legacy', 'index.html');
const outDir = join(root, 'public', 'img', 'legacy-extract');

if (!existsSync(legacy)) {
  console.error('legacy/index.html not found — nothing to extract.');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const html = readFileSync(legacy, 'utf8');
const imgTags = html.match(/<img\b[^>]*>/g) || [];
let i = 0;
for (const tag of imgTags) {
  const m = tag.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/);
  if (!m) continue;
  const ext = m[1].replace('jpeg', 'jpg');
  const alt = (tag.match(/alt="([^"]*)"/) || [, ''])[1];
  const file = join(outDir, `${String(i).padStart(2, '0')}.${ext}`);
  writeFileSync(file, Buffer.from(m[2], 'base64'));
  console.log(`${file}  ${alt.slice(0, 60)}`);
  i++;
}
console.log(`\nExtracted ${i} images to ${outDir}`);
