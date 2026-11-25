// Erzeugt den Block „Verbreitung“ der Startseite: Bayernkarte als eingebettetes SVG, drei Zahlen und die Liste.
//
// Quellen: src/content/kundenkarte.json (Kunden, Schalter name_zeigen, Sperrliste; Vorschlag aus dem CRM über
// scripts/kundenkarte-vorschlag.mjs) und src/content/geo/bayern.json (BKG VG2500, über scripts/geodaten-aufbereiten.mjs).
// Keine Kartenkacheln, keine Bibliothek, kein Abruf im Browser.
//
// Ohne Freigabe der Namen steht je Verwaltung nur der Landkreis da. Gemeindenamen erscheinen erst, wenn name_zeigen
// in der Datei UND an der Verwaltung true ist.
import fs from "node:fs";
import path from "node:path";

const BEZIRKE = ["Oberbayern", "Niederbayern", "Oberpfalz", "Oberfranken", "Mittelfranken", "Unterfranken", "Schwaben"];
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const ZAHLWORT = ["null", "einem", "zwei", "drei", "vier", "fünf", "sechs", "sieben"];

// Kartenblatt: Bayern 520 Einheiten breit; rechts Rand für die Schilder der Gemeinden an der Ostgrenze.
const BREITE = 612, RAND_X = 16, RAND_Y = 24, KARTE_B = 520;
const COS = Math.cos((48.95 * Math.PI) / 180);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const z = (n) => (Math.round(n * 10) / 10).toString();

function huelle(punkte) {
  const p = [...punkte].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const unten = [], oben = [];
  for (const q of p) { while (unten.length >= 2 && kreuz(unten.at(-2), unten.at(-1), q) <= 0) unten.pop(); unten.push(q); }
  for (const q of p.reverse()) { while (oben.length >= 2 && kreuz(oben.at(-2), oben.at(-1), q) <= 0) oben.pop(); oben.push(q); }
  return unten.slice(0, -1).concat(oben.slice(0, -1));
}
function schwerpunkt(ring) {
  let a = 0, x = 0, y = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const f = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    a += f; x += (ring[i][0] + ring[i + 1][0]) * f; y += (ring[i][1] + ring[i + 1][1]) * f;
  }
  return [x / (3 * a), y / (3 * a)];
}

export function kundenkarteBlock(wurzel, abbruch) {
  const lies = (...teile) => JSON.parse(fs.readFileSync(path.join(wurzel, "src", "content", ...teile), "utf8"));
  const geo = lies("geo", "bayern.json");
  const daten = lies("kundenkarte.json");

  const gesperrt = new Set(daten.sperrliste || []);
  const verwaltungen = (daten.verwaltungen || [])
    .filter((v) => !gesperrt.has(v.schluessel))
    .map((v) => ({ ...v, gemeinden: v.gemeinden.filter((g) => !gesperrt.has(g.ags)) }))
    .filter((v) => v.gemeinden.length)
    .sort((a, b) => a.reihenfolge - b.reihenfolge);
  if (!verwaltungen.length) abbruch("kundenkarte.json: keine Verwaltung übrig");
  for (const v of verwaltungen) if (!BEZIRKE.includes(v.regierungsbezirk)) abbruch("kundenkarte.json: unbekannter Regierungsbezirk bei " + v.schluessel);
  const m = /^(\d{4})-(\d{2})$/.exec(daten.stand || "");
  if (!m || !MONATE[m[2] - 1]) abbruch("kundenkarte.json: stand fehlt (JJJJ-MM)");
  const stand = MONATE[m[2] - 1] + " " + m[1];

  // ---------- Projektion (abstandstreu genug für Bayern: Länge mit cos der mittleren Breite gestaucht)
  const umriss = geo.umriss[0];
  const lons = umriss.map((p) => p[0]), lats = umriss.map((p) => p[1]);
  const [lonMin, lonMax, latMin, latMax] = [Math.min(...lons), Math.max(...lons), Math.min(...lats), Math.max(...lats)];
  const k = KARTE_B / ((lonMax - lonMin) * COS);
  const HOEHE = Math.round((latMax - latMin) * k + 2 * RAND_Y);
  const pr = ([lon, lat]) => [RAND_X + (lon - lonMin) * COS * k, RAND_Y + (latMax - lat) * k];
  const pfad = (ring) => "M" + ring.map((p) => pr(p).map(z).join(" ")).join("L") + "Z";

  const zahlGemeinden = verwaltungen.reduce((s, v) => s + v.gemeinden.length, 0);
  const mitKunde = BEZIRKE.filter((b) => verwaltungen.some((v) => v.regierungsbezirk === b));
  const alle = mitKunde.length === BEZIRKE.length;
  const zeigt = (v) => daten.name_zeigen === true && v.name_zeigen === true;
  for (const v of verwaltungen) {
    if (zeigt(v) && (!v.name || v.gemeinden.some((g) => !g.name))) abbruch("kundenkarte.json: name_zeigen bei " + v.schluessel + ", aber Namen fehlen (scripts/kundenkarte-vorschlag.mjs neu laufen lassen)");
  }
  const anzahl = (n) => n + (n === 1 ? " Gemeinde" : " Gemeinden");

  // ---------- Karte
  const bezirksFlaechen = geo.bezirke
    .map((b) => '<path class="karte__bezirk' + (mitKunde.includes(b.name) ? " ist-kunde" : "") + '" data-bezirk="' + BEZIRKE.indexOf(b.name) + '" d="' + b.ringe.map(pfad).join("") + '"/>')
    .join("\n            ");
  const bezirksNamen = geo.bezirke
    .map((b) => {
      const gross = [...b.ringe].sort((x, y) => y.length - x.length)[0];
      const [x, y] = schwerpunkt(gross.map(pr));
      return '<text class="karte__bezirksname" x="' + z(x) + '" y="' + z(y) + '">' + esc(b.name) + "</text>";
    })
    .join("\n            ");

  const gruppen = verwaltungen
    .map((v, i) => {
      const pkt = v.gemeinden.map((g) => pr([g.lon, g.lat]));
      const xs = pkt.map((p) => p[0]), ys = pkt.map((p) => p[1]);
      const cx = xs.reduce((a, b) => a + b, 0) / pkt.length, cy = ys.reduce((a, b) => a + b, 0) / pkt.length;
      const radius = Math.max(...pkt.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
      const h = huelle(pkt);
      // Verwaltungsgemeinschaft: Hof um die Mitglieder (breite, runde Kontur) und darüber die Linie von Gemeinde zu Gemeinde.
      const d = pkt.length >= 3 ? "M" + h.map((p) => p.map(z).join(" ")).join("L") + "Z" : pkt.length === 2 ? "M" + pkt.map((p) => p.map(z).join(" ")).join("L") : "";
      const form = d ? '<path class="karte__hof" d="' + d + '"/><path class="karte__flaeche" pathLength="1" d="' + d + '"/>' : "";
      const punkte = pkt.map((p, n) => '<circle class="karte__punkt" style="--k:' + n + '" cx="' + z(p[0]) + '" cy="' + z(p[1]) + '" r="3"/>').join("");
      // Schild: rechts, links, oben oder unten von der Gruppe (kundenkarte.json: beschriftung), sonst rechts.
      const seite = v.beschriftung || "rechts";
      const ab = radius + (pkt.length > 1 ? 15 : 10);
      const [sx, sy, anker] =
        seite === "links" ? [cx - ab, cy - 2, "end"] : seite === "oben" ? [cx, cy - ab - 14, "middle"] : seite === "unten" ? [cx, cy + ab + 10, "middle"] : [cx + ab, cy - 2, "start"];
      const zeile1 = zeigt(v) ? v.name : "Lkr. " + v.landkreis;
      const schild =
        '<text class="karte__schild" x="' + z(sx) + '" y="' + z(sy) + '" text-anchor="' + anker + '">' +
        "<tspan>" + esc(zeile1) + "</tspan>" +
        '<tspan class="karte__schild-klein" x="' + z(sx) + '" dy="14">' + anzahl(pkt.length) + "</tspan></text>";
      return (
        '<g class="karte__gruppe" data-i="' + i + '" data-n="' + pkt.length + '" data-bezirk="' + BEZIRKE.indexOf(v.regierungsbezirk) + '" data-x="' + z(cx) + '" data-y="' + z(cy) + '" style="--i:' + i + '">' +
        '<circle class="karte__ring" cx="' + z(cx) + '" cy="' + z(cy) + '" r="' + z(radius + 9) + '"/>' +
        form + punkte + schild + "</g>"
      );
    })
    .join("\n            ");

  const beschreibung =
    "Karte von Bayern: " + zahlGemeinden + " Gemeinden in " + verwaltungen.length + " Verwaltungen mit FlächenKlar, verteilt über " +
    (alle ? "alle sieben Regierungsbezirke" : mitKunde.length + " von sieben Regierungsbezirken") + ". Die Liste daneben nennt sie je Regierungsbezirk.";

  const svg =
    '<svg class="karte__blatt" viewBox="0 0 ' + BREITE + " " + HOEHE + '" role="img" aria-label="' + esc(beschreibung) + '">\n' +
    "            <defs>\n" +
    '              <clipPath id="karte-land"><path d="' + pfad(umriss) + '"/></clipPath>\n' +
    '              <pattern id="karte-raster" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#FFFFFF" stroke-opacity="0.07" stroke-width="1"/></pattern>\n' +
    '              <pattern id="karte-raster-5" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1"/></pattern>\n' +
    "            </defs>\n" +
    '            <g class="karte__land" clip-path="url(#karte-land)">\n' +
    '            <rect class="karte__grund" width="' + BREITE + '" height="' + HOEHE + '"/>\n' +
    '            <rect width="' + BREITE + '" height="' + HOEHE + '" fill="url(#karte-raster)"/><rect width="' + BREITE + '" height="' + HOEHE + '" fill="url(#karte-raster-5)"/>\n' +
    "            " + bezirksFlaechen + "\n" +
    "            </g>\n" +
    '            <path class="karte__umriss" pathLength="1" d="' + pfad(umriss) + '"/>\n' +
    '            <g class="karte__bezirksnamen" aria-hidden="true">\n            ' + bezirksNamen + "\n            </g>\n" +
    '            <g class="karte__faeden" aria-hidden="true"><line class="karte__faden karte__faden--h" x1="0" x2="' + BREITE + '" y1="0" y2="0"/><line class="karte__faden karte__faden--v" x1="0" x2="0" y1="0" y2="' + HOEHE + '"/></g>\n' +
    '            <g class="karte__gruppen" aria-hidden="true">\n            ' + gruppen + "\n            </g>\n" +
    "          </svg>";

  // ---------- Liste je Regierungsbezirk
  const liste = BEZIRKE.filter((b) => mitKunde.includes(b))
    .map((b) => {
      const eintraege = verwaltungen
        .map((v, i) => ({ v, i }))
        .filter((e) => e.v.regierungsbezirk === b)
        .map(({ v, i }) => {
          const n = v.gemeinden.length;
          const kopf = zeigt(v) ? esc(v.name) : "Lkr. " + esc(v.landkreis);
          const zusatz = zeigt(v)
            ? (n > 1 ? esc(v.gemeinden.map((g) => g.name).join(", ")) : "Lkr. " + esc(v.landkreis))
            : anzahl(n) + (n > 1 ? " (VG)" : "");
          return '<li data-i="' + i + '"><strong>' + kopf + "</strong><span>" + zusatz + "</span></li>";
        })
        .join("");
      return "            <div><dt>" + esc(b) + "</dt><dd><ul>" + eintraege + "</ul></dd></div>";
    })
    .join("\n");

  const satz = alle
    ? "Gemeinden aus allen sieben Regierungsbezirken Bayerns haben FlächenKlar lizenziert."
    : "Gemeinden aus " + (ZAHLWORT[mitKunde.length] || mitKunde.length) + " von sieben Regierungsbezirken Bayerns haben FlächenKlar lizenziert.";

  return (
    "      <!-- Erzeugt von scripts/kundenkarte.mjs aus src/content/kundenkarte.json. Nicht von Hand ändern. -->\n" +
    '      <div class="block block--verbreitung" id="verbreitung">\n' +
    '        <div class="block__kopf">\n' +
    '          <h2 class="anzeige">Hier wird schon damit gerechnet.</h2>\n' +
    "          <p>" + satz + " Jeder Punkt ist eine Gemeinde, jede Fläche eine Verwaltungsgemeinschaft.</p>\n" +
    '          <dl class="verbreitung__zahlen">\n' +
    '            <div><dt>Gemeinden</dt><dd data-zahl="gemeinden" data-ziel="' + zahlGemeinden + '">' + zahlGemeinden + "</dd></div>\n" +
    '            <div><dt>Verwaltungen</dt><dd data-zahl="verwaltungen" data-ziel="' + verwaltungen.length + '">' + verwaltungen.length + "</dd></div>\n" +
    '            <div><dt>Regierungsbezirke</dt><dd><span data-zahl="bezirke" data-ziel="' + mitKunde.length + '">' + mitKunde.length + "</span><small> von 7</small></dd></div>\n" +
    "          </dl>\n" +
    '          <p class="verbreitung__stand">Stand ' + esc(stand) + ".</p>\n" +
    "        </div>\n" +
    '        <div class="verbreitung">\n' +
    '          <figure class="karte" data-karte>\n' +
    "          " + svg + "\n" +
    '            <figcaption>Kartengrundlage: ' + esc(geo.quelle.replace(/ dl-de\/by-2-0$/, "")) +
    ' <a href="https://www.govdata.de/dl-de/by-2-0" rel="noopener">dl-de/by-2-0</a>, vereinfacht. ' +
    '<a href="https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf" rel="noopener">Datenquellen</a></figcaption>\n' +
    "          </figure>\n" +
    '          <dl class="verbreitung__liste" data-sc-in data-sc-stagger="50">\n' + liste + "\n          </dl>\n" +
    "        </div>\n" +
    "      </div>"
  );
}
