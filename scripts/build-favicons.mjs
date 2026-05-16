// scripts/build-favicons.mjs
// Rendert public/favicon.svg nach verschiedenen PNG-Groessen fuer Google-Favicon
// in Suchergebnissen, Browser-Tabs, iOS-Homescreen und Schema.org-Organization-logo.
//
// Aufruf: node scripts/build-favicons.mjs (oder npm run build-favicons)
//
// Output (alle nach public/):
//   favicon-16.png, favicon-32.png, favicon-48.png  -> Browser-Tabs / Tab-Wechsel
//   favicon-96.png, favicon-192.png                  -> Android / hochaufloesende Tabs
//   favicon-512.png                                  -> Manifest, PWA, Galerie
//   apple-touch-icon.png (180x180)                   -> iOS-Homescreen
//   logo-512.png                                     -> Schema.org Organization.logo
//
// Die SVG bleibt das primaere Favicon fuer moderne Browser; die PNGs sind
// Fallbacks fuer Google-Crawler und aeltere Browser, die SVG-Favicons
// inkonsistent rendern.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SVG_PATH = resolve(REPO_ROOT, "public/favicon.svg");

/** @type {Array<{ size: number, name: string }>} */
const TARGETS = [
  { size: 16, name: "favicon-16.png" },
  { size: 32, name: "favicon-32.png" },
  { size: 48, name: "favicon-48.png" },
  { size: 96, name: "favicon-96.png" },
  { size: 192, name: "favicon-192.png" },
  { size: 512, name: "favicon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 512, name: "logo-512.png" },
];

async function main() {
  const svg = await readFile(SVG_PATH);
  let totalBytes = 0;
  for (const t of TARGETS) {
    // density skaliert die SVG-Rasterung; bei kleinen Targets reicht 144,
    // bei 512+ holen wir mehr Detail aus der Quelle.
    const density = t.size >= 256 ? 384 : 192;
    const png = await sharp(svg, { density })
      .resize(t.size, t.size, { fit: "fill" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    const outPath = resolve(REPO_ROOT, "public", t.name);
    await writeFile(outPath, png);
    totalBytes += png.length;
    console.log(`OK: public/${t.name.padEnd(24)} ${String(png.length).padStart(6)} bytes`);
  }
  console.log(`---\nGesamt: ${TARGETS.length} Dateien, ${totalBytes} bytes`);
}

main().catch((err) => {
  console.error("FEHLER:", err);
  process.exit(1);
});
