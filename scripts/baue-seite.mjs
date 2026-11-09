// Baut flaechenklar.de aus den statischen Seiten in seite/ nach dist/ (ersetzt seit 09.11.2026 den Vite-Build).
//
// 1. public/ und seite/ nach dist/ kopieren.
// 2. Aus src/content/versionen.ts: Versionsliste (/versionen), Block „Neu in Version“ (/tutorial) und die
//    Programmversion in Fußzeile und Standzeile. versionen.ts bleibt am Ort, das Release-Werkzeug des
//    Programms (tool/tools/bump-version.js) schreibt dort jeden Release hinein.
// 3. Aus src/content/preise.ts: Preisliste des Preiswählers (Startseite) und das Angebot im JSON-LD.
// 4. Saubere Adressen: demo.html -> /demo, index.html -> /, relative assets/ und fonts/ -> absolut.
// 5. Kopf je Seite: canonical, Open Graph, Twitter-Karte, Favicons; JSON-LD auf der Startseite.
//
// Bricht ab, wenn eine Marke fehlt oder ein interner .html-Link übrig bleibt.
// Aufruf: npm run build
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEITE = path.join(WURZEL, "seite");
const PUBLIC = path.join(WURZEL, "public");
const DIST = path.join(WURZEL, "dist");
const HOST = "https://flaechenklar.de";

const SEITEN = ["index", "demo", "tutorial", "versionen", "impressum", "datenschutz", "404"];
const pfadVon = (name) => (name === "index" ? "/" : "/" + name);

function abbruch(text) {
  console.error("baue-seite: " + text);
  process.exit(1);
}

// ---------- Quellen lesen (TypeScript-Literal ohne Typangaben auswerten)
function literal(datei, name, typ) {
  const ts = fs.readFileSync(path.join(WURZEL, "src", "content", datei), "utf8");
  const start = ts.indexOf("export const " + name);
  if (start < 0) abbruch(datei + ': "export const ' + name + '" nicht gefunden');
  const roh = ts
    .slice(start)
    .replace(new RegExp("^export const " + name + "\\s*:\\s*readonly " + typ + "\\[\\]\\s*=\\s*"), "")
    .replace(/\]\s*as const\s*;\s*$/, "]");
  return new Function("return (" + roh + ");")();
}
const versionen = literal("versionen.ts", "versionen", "Version");
const preise = literal("preise.ts", "preise", "Preisstufe");
const aktuell = versionen[0];
const oeffentlich = versionen
  .filter((v) => v.oeffentlich !== false)
  .map((v) => ({ ...v, punkte: v.punkte.filter((p) => p.oeffentlich !== false) }));
const mitPreis = preise.filter((p) => !p.aufAnfrage);
if (!aktuell || !oeffentlich.length || !mitPreis.length) abbruch("versionen.ts oder preise.ts leer");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const js = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";

// ---------- 1. Kopieren
// Nur den Inhalt leeren: unter Windows hält ein laufendes wrangler dev den Ordner selbst fest (EPERM).
fs.mkdirSync(DIST, { recursive: true });
for (const eintrag of fs.readdirSync(DIST)) fs.rmSync(path.join(DIST, eintrag), { recursive: true, force: true });
fs.cpSync(PUBLIC, DIST, { recursive: true });
fs.cpSync(SEITE, DIST, { recursive: true });

// ---------- Ersetzungen
function marke(text, datei, name, inhalt, kommentar) {
  const [a, b] = kommentar ? ["/\\* " + name + ":START \\*/", "/\\* " + name + ":ENDE \\*/"] : ["<!-- " + name + ":START -->", "<!-- " + name + ":ENDE -->"];
  const re = new RegExp("(" + a + ")[\\s\\S]*?(" + b + ")");
  if (!re.test(text)) abbruch(datei + ": Marken " + name + " fehlen");
  return text.replace(re, (_, s, e) => s + "\n" + inhalt + "\n" + (kommentar ? "  " : "") + e);
}

function genau(text, datei, re, ersatz, was) {
  const n = (text.match(re) || []).length;
  if (n === 0) abbruch(datei + ": " + was + " nicht gefunden");
  return text.replace(re, ersatz);
}

const versionsListe = oeffentlich
  .map(
    (v) =>
      '        <li class="version" data-quelle="versionen.ts">\n' +
      '          <h2 class="version__kopf"><span class="version__nr">Version ' + esc(v.version) + '</span> <time datetime="' + esc(v.iso) + '">' + esc(v.datum) + "</time></h2>\n" +
      '          <ul class="version__punkte">\n' +
      v.punkte.map((p) => "            <li><strong>" + esc(p.titel) + "</strong><span>" + esc(p.text) + "</span></li>").join("\n") + "\n" +
      "          </ul>\n" +
      "        </li>",
  )
  .join("\n");

const n0 = oeffentlich[0];
const neuBlock =
  '          <div class="neu" data-quelle="versionen.ts">\n' +
  '            <p class="neu__kopf"><span class="marke">Neu in Version ' + esc(n0.version) + '</span><time datetime="' + esc(n0.iso) + '">' + esc(n0.datum) + "</time></p>\n" +
  '            <ul class="version__punkte">\n' +
  n0.punkte.map((p) => "              <li><strong>" + esc(p.titel) + "</strong><span>" + esc(p.text) + "</span></li>").join("\n") + "\n" +
  "            </ul>\n" +
  "          </div>";

const preisListe =
  "  var PREISE = [\n" +
  preise
    .map((p) => {
      const klasse = js(p.einwohner.replace(" – ", " bis "));
      return p.aufAnfrage
        ? "    { klasse: " + klasse + ", aufAnfrage: true }"
        : "    { klasse: " + klasse + ", auf: " + js(p.einmalig) + ", bes: " + js(p.bescheidModul) + ", warAuf: " + js(p.wartung) + ", war: " + js(p.wartungMitModul) + " }";
    })
    .join(",\n") +
  "\n  ];";

function textOhneTags(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
}

function jsonLd(html, beschreibung) {
  const faq = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({
    "@type": "Question",
    name: textOhneTags(m[1]),
    acceptedAnswer: { "@type": "Answer", text: textOhneTags(m[2]) },
  }));
  if (!faq.length) abbruch("index.html: keine FAQ (<details>) für das JSON-LD gefunden");
  const zahlen = mitPreis.map((p) => p.einmaligNumeric);
  const bloecke = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "FlächenKlar",
      operatingSystem: "Windows, macOS, Linux (Browser)",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Bauamt-Aufmaß-Software",
      softwareVersion: aktuell.version,
      dateModified: aktuell.iso,
      description: beschreibung,
      url: HOST + "/",
      image: HOST + "/og-image.png",
      inLanguage: "de-DE",
      author: { "@type": "Person", name: "Alexander Geitner" },
      publisher: { "@type": "Organization", name: "FlächenKlar", url: HOST + "/" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: String(Math.min(...zahlen)),
        highPrice: String(Math.max(...zahlen)),
        offerCount: String(mitPreis.length),
        description: "Einmalkauf gestaffelt nach Einwohnerklasse der Kommune, über 30.000 Einwohner auf Anfrage.",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "FlächenKlar",
      url: HOST + "/",
      logo: HOST + "/logo-512.png",
      founder: { "@type": "Person", name: "Alexander Geitner" },
      address: { "@type": "PostalAddress", streetAddress: "Lärchenstraße 18", postalCode: "92361", addressLocality: "Berngau", addressCountry: "DE" },
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "info@flaechenklar.de", telephone: "+49-151-61481639", areaServed: "DE", availableLanguage: "de" },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq },
  ];
  return bloecke.map((b) => '<script type="application/ld+json">\n' + JSON.stringify(b, null, 2).replace(/</g, "\\u003c") + "\n</script>").join("\n");
}

function kopf(name, html) {
  const titel = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const beschreibung = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!titel || !beschreibung) abbruch(name + ".html: <title> oder description fehlt");
  const icons =
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n' +
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">\n' +
    '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">\n' +
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">';
  // Das SVG-Favicon als data-URI aus dem Entwurf weicht den Dateien aus public/.
  html = genau(html, name + ".html", /<link rel="icon" href="data:image\/svg\+xml,[^"]*">/, icons, "Favicon (data-URI)");
  if (name === "404") return html;
  const url = HOST + pfadVon(name);
  const meta =
    '<meta name="robots" content="index,follow">\n' +
    '<meta name="theme-color" content="#0F2D5A">\n' +
    '<link rel="canonical" href="' + url + '">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="FlächenKlar">\n' +
    '<meta property="og:locale" content="de_DE">\n' +
    '<meta property="og:url" content="' + url + '">\n' +
    '<meta property="og:title" content="' + titel + '">\n' +
    '<meta property="og:description" content="' + beschreibung + '">\n' +
    '<meta property="og:image" content="' + HOST + '/og-image.png">\n' +
    '<meta property="og:image:width" content="1200">\n' +
    '<meta property="og:image:height" content="630">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:image" content="' + HOST + '/og-image.png">';
  html = html.replace(/(<meta name="description" content="[^"]*">)/, "$1\n" + meta);
  if (name === "index") html = html.replace("</head>", jsonLd(html, textOhneTags(beschreibung)) + "\n</head>");
  return html;
}

function adressen(text) {
  return text
    .replace(/(["'])(index|demo|tutorial|versionen|impressum|datenschutz|404)\.html/g, (_, q, n) => q + pfadVon(n))
    .replace(/(["'(])(assets|fonts)\//g, "$1/$2/")
    .replace(/(["'])(seiten|rechtstext|scrollcraft)\.(css|js)\b/g, "$1/$2.$3");
}

// ---------- 2. bis 5.
const stand = (v) => v.version + " vom " + v.datum + ".";
for (const name of SEITEN) {
  const datei = path.join(DIST, name + ".html");
  if (!fs.existsSync(datei)) abbruch(name + ".html fehlt in seite/");
  let html = fs.readFileSync(datei, "utf8");
  html = genau(html, name + ".html", /(<p class="fuss__stand">Version )\d+\.\d+\.\d+ vom \d{2}\.\d{2}\.\d{4}\./g, "$1" + stand(aktuell), "Fußzeile mit Version");
  if (name === "versionen") {
    html = genau(html, "versionen.html", /(<p class="stand">Aktuelle Programmversion: )\d+\.\d+\.\d+ vom \d{2}\.\d{2}\.\d{4}\./, "$1" + stand(aktuell), "Standzeile");
    html = marke(html, "versionen.html", "VERSIONEN", versionsListe);
  }
  if (name === "tutorial") html = marke(html, "tutorial.html", "NEU", neuBlock);
  if (name === "index") html = marke(html, "index.html", "PREISE", preisListe, true);
  html = kopf(name, html);
  html = adressen(html);
  const rest = html.match(/(["'])(?!https?:)[a-z0-9-]+\.html\b/g);
  if (rest) abbruch(name + ".html: interne .html-Links übrig: " + [...new Set(rest)].join(", "));
  fs.writeFileSync(datei, html);
}
for (const css of ["seiten.css", "rechtstext.css", "scrollcraft.css"]) {
  const datei = path.join(DIST, css);
  fs.writeFileSync(datei, adressen(fs.readFileSync(datei, "utf8")));
}

console.log(
  "baue-seite: " + SEITEN.length + " Seiten nach dist/, Programmversion " + aktuell.version + " (" + aktuell.datum + "), " +
    oeffentlich.length + " von " + versionen.length + " Versionen öffentlich, neueste öffentliche " + n0.version + ", " +
    mitPreis.length + " Preisstufen mit Preis.",
);
