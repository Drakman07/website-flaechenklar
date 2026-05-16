// scripts/build-portrait.mjs
// Konvertiert ein hochaufloesendes Original-Portrait nach optimiertem WebP
// fuer die Founder-Sektion (src/sections/Founder.tsx).
//
// Aufruf: node scripts/build-portrait.mjs [<input-pfad>]
//   Default-Input:  ../alexander-potrait.png (Typo aus User-Ablage)
//                  ODER ./public/alexander-portrait.{jpg,png}
//   Output:         public/alexander-portrait.webp (~600x800, ~50-80 KB)
//
// Photo soll B&W bleiben (Original ist bereits B&W), wir reduzieren nur
// Aufloesung + komprimieren.

import { readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

// Kandidaten-Eingabepfade in Prioritaets-Reihenfolge (erste Existenz gewinnt).
// Erlaubt sowohl Repo-Ablage als auch Haupt-Repo-Ablage (Eltern-Verzeichnis).
const INPUT_CANDIDATES = [
  resolve(REPO_ROOT, "public/alexander-portrait.jpg"),
  resolve(REPO_ROOT, "public/alexander-portrait.png"),
  resolve(REPO_ROOT, "public/alexander-portrait.webp"),
  // Haupt-Repo (falls Worktree-Setup):
  resolve(REPO_ROOT, "../../../public/alexander-portrait.jpg"),
  resolve(REPO_ROOT, "../../../public/alexander-portrait.png"),
  resolve(REPO_ROOT, "../../../public/alexander-potrait.png"), // User-Typo
  resolve(REPO_ROOT, "../../../public/alexander-potrait.jpg"),
];

const OUTPUT = resolve(REPO_ROOT, "public/alexander-portrait.webp");
const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 800;
const WEBP_QUALITY = 82;

async function main() {
  // CLI-Argument oder erstes existierendes Kandidaten-Match.
  const cliInput = process.argv[2];
  const input = cliInput
    ? resolve(cliInput)
    : INPUT_CANDIDATES.find((p) => existsSync(p));

  if (!input) {
    console.error("FEHLER: Kein Portrait-Quellbild gefunden.");
    console.error("Erwartete Pfade:");
    INPUT_CANDIDATES.forEach((p) => console.error("  -", p));
    console.error("\nLeg das Original-Foto unter public/alexander-portrait.jpg ab,");
    console.error("oder uebergib den Pfad als Argument:");
    console.error("  node scripts/build-portrait.mjs <pfad-zum-foto>");
    process.exit(1);
  }

  const inputBuf = await readFile(input);
  const inputStat = await stat(input);
  console.log(`Input:  ${input}`);
  console.log(`        ${(inputStat.size / 1024 / 1024).toFixed(2)} MB`);

  const meta = await sharp(inputBuf).metadata();
  console.log(`        ${meta.width}x${meta.height} ${meta.format}`);

  const webp = await sharp(inputBuf)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: "attention", // findet das salient-Object (Gesicht)
    })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();

  await writeFile(OUTPUT, webp);
  console.log(`\nOutput: ${OUTPUT}`);
  console.log(`        ${TARGET_WIDTH}x${TARGET_HEIGHT} webp`);
  console.log(`        ${(webp.length / 1024).toFixed(1)} KB`);
  console.log(
    `        ${((webp.length / inputStat.size) * 100).toFixed(2)} % der Original-Groesse`,
  );
}

main().catch((err) => {
  console.error("FEHLER:", err);
  process.exit(1);
});
