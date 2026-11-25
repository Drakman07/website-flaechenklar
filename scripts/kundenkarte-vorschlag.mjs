// Liest die Kunden aus der CRM-Datenbank (nur lesend) und schreibt einen Vorschlag für src/content/kundenkarte.json.
// Auf die Karte kommen die Status kunde und pilotbetrieb (Entscheidung 25.11.2026). Was in kundenkarte.json unter
// ausgenommen steht (AGS), kommt nie in die Datei: dort steht der Arbeitgeber, der im CRM als Pilot geführt wird.
//
// Veröffentlicht wird nichts von selbst: der Vorschlag landet in kundenkarte.vorschlag.json (nicht im Repo),
// das Skript zeigt, was sich gegenüber der gültigen Datei ändert. Erst --uebernehmen schreibt kundenkarte.json,
// und erst der nächste Bau samt Deploy bringt die Karte auf die Seite.
//
// Zeilen werden über den Amtlichen Gemeindeschlüssel (AGS) geführt, nie über den Namen. Die Lage kommt aus
// src/content/geo/gemeindepunkte.json (BKG), es geht keine Anfrage ins Netz.
// In die Datei kommen keine Vertragsdaten und keine Ansprechpartner, nur die Reihenfolge der Abschlüsse.
// Namen von Verwaltung und Gemeinden schreibt das Skript nur für Verwaltungen, an denen name_zeigen schon true ist:
// erst den Schalter in kundenkarte.json setzen, dann das Skript noch einmal laufen lassen.
// Schlüssel einer Verwaltungsgemeinschaft ist "vg:" plus der kleinste AGS ihrer Mitglieder mit Lizenz.
//
// Aufruf: node scripts/kundenkarte-vorschlag.mjs [--db <Pfad zur flaechenklar.db>] [--stand JJJJ-MM] [--uebernehmen]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INHALT = path.join(WURZEL, "src", "content");
const args = process.argv.slice(2);
const wert = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const dbPfad = wert("--db") || path.resolve(WURZEL, "..", "kontakte", "flaechenklar.db");
const heute = new Date();
const stand = wert("--stand") || heute.getFullYear() + "-" + String(heute.getMonth() + 1).padStart(2, "0");
if (!/^\d{4}-\d{2}$/.test(stand)) { console.error("--stand erwartet JJJJ-MM"); process.exit(1); }
if (!fs.existsSync(dbPfad)) { console.error("CRM-Datenbank nicht gefunden: " + dbPfad); process.exit(1); }

const punkte = JSON.parse(fs.readFileSync(path.join(INHALT, "geo", "gemeindepunkte.json"), "utf8")).punkte;
const zielDatei = path.join(INHALT, "kundenkarte.json");
const alt = fs.existsSync(zielDatei) ? JSON.parse(fs.readFileSync(zielDatei, "utf8")) : { name_zeigen: false, sperrliste: [], verwaltungen: [] };

const db = new DatabaseSync(dbPfad, { readOnly: true });
const zeilen = db
  .prepare(
    "SELECT id, ags, vg, gemeindename, art, landkreis, regierungsbezirk, vertragsdatum, lower(status) AS status FROM gemeinden " +
      "WHERE lower(status) IN ('kunde', 'pilotbetrieb') ORDER BY vertragsdatum, id",
  )
  .all();
db.close();

const ausgenommen = new Set(alt.ausgenommen || []);
const ohneAgs = zeilen.filter((z) => !z.ags);
const draussen = zeilen.filter((z) => z.ags && ausgenommen.has(z.ags));
const gruppen = new Map();
for (const z of zeilen.filter((x) => x.ags && !ausgenommen.has(x.ags))) {
  if (!punkte[z.ags]) { console.error("Kein Gemeindepunkt für AGS " + z.ags + " (CRM-Zeile " + z.id + ")"); process.exit(1); }
  const istVg = z.vg && !/^(nein|ja)$/i.test(z.vg.trim());
  const schluessel = istVg ? "crm-vg:" + z.vg.trim() : "ags:" + z.ags;
  if (!gruppen.has(schluessel)) {
    gruppen.set(schluessel, {
      istVg,
      name: istVg ? z.vg.trim() : (/^(Stadt|Markt|Gemeinde)$/.test(z.art || "") ? z.art + " " : "") + z.gemeindename,
      art: istVg ? "Verwaltungsgemeinschaft" : z.art || "Gemeinde",
      landkreis: String(z.landkreis || "").replace(/^LK\s+/, ""),
      regierungsbezirk: z.regierungsbezirk,
      erster: z.vertragsdatum || "9999",
      gemeinden: [],
    });
  }
  const g = gruppen.get(schluessel);
  if (g.regierungsbezirk !== z.regierungsbezirk) { console.error("Regierungsbezirk uneinheitlich in " + schluessel); process.exit(1); }
  const [lon, lat] = punkte[z.ags];
  g.gemeinden.push({ ags: z.ags, name: z.gemeindename, lon, lat });
}

const altNach = new Map((alt.verwaltungen || []).map((v) => [v.schluessel, v]));
const verwaltungen = [...gruppen.values()]
  .sort((a, b) => (a.erster < b.erster ? -1 : a.erster > b.erster ? 1 : 0))
  .map((g, i) => {
    const gemeinden = g.gemeinden.sort((a, b) => a.ags.localeCompare(b.ags));
    const schluessel = (g.istVg ? "vg:" : "ags:") + gemeinden[0].ags;
    const vorher = altNach.get(schluessel) || {};
    const mitNamen = vorher.name_zeigen === true;
    return {
      schluessel,
      ...(mitNamen ? { name: g.name } : {}),
      art: g.art,
      landkreis: g.landkreis,
      regierungsbezirk: g.regierungsbezirk,
      reihenfolge: i + 1,
      name_zeigen: mitNamen,
      ...(vorher.beschriftung ? { beschriftung: vorher.beschriftung } : {}),
      ...(vorher.versatz ? { versatz: vorher.versatz } : {}),
      gemeinden: gemeinden.map(({ name, ...rest }) => (mitNamen ? { name, ...rest } : rest)),
    };
  });

const neu = {
  hinweis:
    "Quelle der Kundenkarte auf der Startseite. Vorschlag aus dem CRM: scripts/kundenkarte-vorschlag.mjs. " +
    "name_zeigen (gesamt und je Verwaltung) schaltet Gemeindenamen frei; beide müssen true sein. " +
    "sperrliste: AGS oder Schlüssel einer Verwaltung, der Eintrag fehlt dann auf Karte, in Liste und Zahlen. " +
    "ausgenommen: AGS, die das Skript nie in die Datei schreibt.",
  stand,
  name_zeigen: alt.name_zeigen === true,
  sperrliste: alt.sperrliste || [],
  ausgenommen: [...ausgenommen],
  verwaltungen,
};

const agsVon = (d) => new Set((d.verwaltungen || []).flatMap((v) => v.gemeinden.map((g) => g.ags)));
const [a, n] = [agsVon(alt), agsVon(neu)];
const dazu = [...n].filter((x) => !a.has(x));
const weg = [...a].filter((x) => !n.has(x));
const gemeinden = verwaltungen.reduce((s, v) => s + v.gemeinden.length, 0);
console.log("kundenkarte: " + gemeinden + " Gemeinden in " + verwaltungen.length + " Verwaltungen, " +
  new Set(verwaltungen.map((v) => v.regierungsbezirk)).size + " Regierungsbezirke (CRM-Zeilen: " +
  zeilen.filter((z) => z.status === "kunde").length + " kunde, " + zeilen.filter((z) => z.status === "pilotbetrieb").length + " pilotbetrieb).");
if (draussen.length) console.log("  ausgenommen, nicht auf der Karte: " + draussen.map((z) => z.id + " " + z.gemeindename).join("; "));
if (ohneAgs.length) console.log("  ohne AGS, nicht auf der Karte: " + ohneAgs.map((z) => z.id + " " + z.gemeindename + " (" + z.art + ")").join("; "));
console.log("  neu gegenüber kundenkarte.json: " + (dazu.length ? dazu.join(", ") : "nichts"));
console.log("  entfällt gegenüber kundenkarte.json: " + (weg.length ? weg.join(", ") : "nichts"));

const text = JSON.stringify(neu, null, 2) + "\n";
if (args.includes("--uebernehmen")) {
  fs.writeFileSync(zielDatei, text);
  console.log("  geschrieben: src/content/kundenkarte.json");
} else {
  fs.writeFileSync(path.join(INHALT, "kundenkarte.vorschlag.json"), text);
  console.log("  Vorschlag: src/content/kundenkarte.vorschlag.json (übernehmen mit --uebernehmen)");
}
