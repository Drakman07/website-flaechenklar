// Bereitet die amtlichen Geodaten für die Kundenkarte auf (einmalig, bei Gebietsänderungen wiederholen).
//
// Quelle: Bundesamt für Kartographie und Geodäsie (BKG), Verwaltungsgebiete VG2500 und VG250,
// Datenlizenz Deutschland Namensnennung 2.0 (dl-de/by-2-0). Quellenvermerk: © BKG (Jahr des Datenbezugs) dl-de/by-2-0.
//
// Abgerufen wird immer der ganze Datensatz, gefiltert wird hier am Rechner. So geht keine Kundenliste an den Geodienst.
//   https://sgx.geodatenzentrum.de/wfs_vg2500?service=WFS&version=2.0.0&request=GetFeature&typeNames=vg2500:vg2500_rbz&outputFormat=application/json&srsName=EPSG:4326
//   https://sgx.geodatenzentrum.de/wfs_vg2500?service=WFS&version=2.0.0&request=GetFeature&typeNames=vg2500:vg2500_lan&outputFormat=application/json&srsName=EPSG:4326
//   https://sgx.geodatenzentrum.de/wfs_vg250?service=WFS&version=2.0.0&request=GetFeature&typeNames=vg250:vg250_pk&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=lkz%3D%27BY%27
//
// Aufruf: node scripts/geodaten-aufbereiten.mjs <Ordner mit vg2500_rbz.json, vg2500_lan.json, vg250_pk_by.json> <Jahr des Datenbezugs>
// Schreibt src/content/geo/bayern.json (Umriss und Regierungsbezirke, vereinfacht) und
// src/content/geo/gemeindepunkte.json (AGS -> Länge, Breite für alle bayerischen Gemeinden).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = path.join(WURZEL, "src", "content", "geo");
const [roh, jahr] = process.argv.slice(2);
if (!roh || !/^\d{4}$/.test(jahr || "")) {
  console.error("Aufruf: node scripts/geodaten-aufbereiten.mjs <Rohdaten-Ordner> <Jahr des Datenbezugs>");
  process.exit(1);
}
const lies = (name) => JSON.parse(fs.readFileSync(path.join(roh, name), "utf8"));

// Toleranz der Vereinfachung in Grad Breite. 0,0016 Grad sind rund 180 m, auf der Karte unter einem Drittel Pixel.
const TOLERANZ = 0.0016;
const COS = Math.cos((48.95 * Math.PI) / 180);

function abstand(p, a, b) {
  const px = (p[0] - a[0]) * COS, py = p[1] - a[1];
  const bx = (b[0] - a[0]) * COS, by = b[1] - a[1];
  const l2 = bx * bx + by * by;
  const t = l2 ? Math.max(0, Math.min(1, (px * bx + py * by) / l2)) : 0;
  return Math.hypot(px - t * bx, py - t * by);
}
function douglasPeucker(punkte) {
  const bleibt = new Uint8Array(punkte.length);
  bleibt[0] = bleibt[punkte.length - 1] = 1;
  const stapel = [[0, punkte.length - 1]];
  while (stapel.length) {
    const [a, b] = stapel.pop();
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = abstand(punkte[i], punkte[a], punkte[b]);
      if (d > max) { max = d; idx = i; }
    }
    if (max > TOLERANZ) { bleibt[idx] = 1; stapel.push([a, idx], [idx, b]); }
  }
  return punkte.filter((_, i) => bleibt[i]);
}
function flaeche(ring) {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return Math.abs(s / 2) * COS;
}
// Ein geschlossener Ring hat keinen festen Anfang: am entferntesten Punkt teilen, beide Hälften vereinfachen.
function ringVereinfachen(ring) {
  let weit = 0, idx = 0;
  for (let i = 1; i < ring.length - 1; i++) {
    const d = Math.hypot((ring[i][0] - ring[0][0]) * COS, ring[i][1] - ring[0][1]);
    if (d > weit) { weit = d; idx = i; }
  }
  const a = douglasPeucker(ring.slice(0, idx + 1));
  const b = douglasPeucker(ring.slice(idx));
  return a.concat(b.slice(1)).map(([lon, lat]) => [+lon.toFixed(4), +lat.toFixed(4)]);
}
// Splitter unter rund 3 km² (Exklaven, Inseln) trägt die Karte nicht.
const MIN_FLAECHE = 0.0004;
function ringe(geometrie) {
  const polygone = geometrie.type === "Polygon" ? [geometrie.coordinates] : geometrie.coordinates;
  return polygone
    .flat()
    .filter((r) => flaeche(r) >= MIN_FLAECHE)
    .map(ringVereinfachen)
    .filter((r) => r.length >= 4);
}

const REIHENFOLGE = ["Oberbayern", "Niederbayern", "Oberpfalz", "Oberfranken", "Mittelfranken", "Unterfranken", "Schwaben"];
const rbz = lies("vg2500_rbz.json").features.filter((f) => f.properties.sn_l === "09");
if (rbz.length !== 7) { console.error("Erwartet 7 Regierungsbezirke, gefunden " + rbz.length); process.exit(1); }
const bezirke = REIHENFOLGE.map((name) => {
  const f = rbz.find((x) => x.properties.gen === name);
  if (!f) { console.error("Regierungsbezirk fehlt: " + name); process.exit(1); }
  return { name, ringe: ringe(f.geometry) };
});

const land = lies("vg2500_lan.json").features.find((f) => f.properties.gen === "Bayern");
if (!land) { console.error("Land Bayern fehlt in vg2500_lan.json"); process.exit(1); }
const umriss = ringe(land.geometry).sort((a, b) => flaeche(b) - flaeche(a)).slice(0, 1);

const punkte = {};
for (const f of lies("vg250_pk_by.json").features) {
  if (f.properties.lkz !== "BY") continue;
  const [lon, lat] = f.geometry.coordinates;
  punkte[f.properties.ags] = [+lon.toFixed(4), +lat.toFixed(4)];
}

const quelle = "© BKG (" + jahr + ") dl-de/by-2-0";
fs.mkdirSync(ZIEL, { recursive: true });
fs.writeFileSync(path.join(ZIEL, "bayern.json"), JSON.stringify({ quelle, datensatz: "VG2500", umriss, bezirke }) + "\n");
fs.writeFileSync(path.join(ZIEL, "gemeindepunkte.json"), JSON.stringify({ quelle, datensatz: "VG250, Punktkoordinaten der Gemeinden", punkte }) + "\n");
const zahl = (r) => r.reduce((s, x) => s + x.length, 0);
console.log(
  "geodaten: Umriss " + zahl(umriss) + " Punkte, Bezirke " + bezirke.map((b) => b.name + " " + zahl(b.ringe) + " (" + b.ringe.length + " Ringe)").join(", ") +
    ", Gemeindepunkte " + Object.keys(punkte).length + ".",
);
