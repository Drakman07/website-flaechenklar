// scripts/build-og-image.mjs
// Konvertiert public/og-image.svg nach public/og-image.png (1200x630).
// Aufruf: node scripts/build-og-image.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SVG_PATH = resolve(REPO_ROOT, "public/og-image.svg");
const PNG_PATH = resolve(REPO_ROOT, "public/og-image.png");

async function main() {
  const svg = await readFile(SVG_PATH);
  const png = await sharp(svg, { density: 144 })
    .resize(1200, 630, { fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  await writeFile(PNG_PATH, png);
  console.log(`OK: og-image.png (${png.length} bytes) erzeugt aus og-image.svg`);
}

main().catch((err) => {
  console.error("FEHLER:", err);
  process.exit(1);
});
