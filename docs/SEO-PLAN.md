# SEO-Plan für flaechenklar.de

Stand: 2026-05-15. Vollständiger strategischer Plan liegt unter
`C:\Users\Alexander\.claude\plans\fl-chenklar-kurzzusammenfassung-immutable-liskov.md`.

## Stufe 1 — Quick-Wins (✅ erledigt mit Commit `1be27d6`)

| Maßnahme | Datei | Status |
|---|---|---|
| Meta-Description | `index.html` | ✅ vorher schon da |
| Canonical-Link | `index.html` | ✅ neu |
| OpenGraph-Tags (title/desc/image/url/locale) | `index.html` | ✅ neu |
| Twitter-Card (summary_large_image) | `index.html` | ✅ neu |
| JSON-LD `SoftwareApplication` mit AggregateOffer | `index.html` | ✅ neu |
| noscript-Fallback mit H1/H2/Sektionen | `index.html` | ✅ neu |
| og-image.png (1200×630) | `public/og-image.png` | ✅ neu, aus SVG generiert |
| sitemap.xml | `public/sitemap.xml` | ✅ neu |
| robots.txt | `public/robots.txt` | ✅ neu |

### OG-Image regenerieren

Wenn das Design-SVG geändert wird:

```bash
npm run build-og-image    # erzeugt public/og-image.png aus public/og-image.svg
npm run build             # neuer Vite-Build inkl. der neuen PNG
```

## Aufgaben für dich — vor/nach dem ersten Deploy

### 1. Push auf `main` → GitHub-Actions deployt automatisch

```bash
git push origin main
```

Sobald grün, ist Commit `1be27d6` live auf flaechenklar.de.

### 2. Validator-Checks direkt nach Deploy (5 Min)

| Was | Tool | Erwartung |
|---|---|---|
| OG-Preview | https://developers.facebook.com/tools/debug/ → URL `https://flaechenklar.de/` eingeben, „Scrape Again" | Bild + Title + Description angezeigt |
| Twitter-Card | https://cards-dev.twitter.com/validator | Card erscheint mit Bild |
| Rich Results | https://search.google.com/test/rich-results | JSON-LD wird als „SoftwareApplication" erkannt, ohne Fehler |
| Sitemap erreichbar | `curl -sI https://flaechenklar.de/sitemap.xml` | `HTTP/2 200`, `content-type: application/xml` |
| Robots erreichbar | `curl -sI https://flaechenklar.de/robots.txt` | `HTTP/2 200`, `content-type: text/plain` |
| Crawler-Sicht | `curl -A "Googlebot/2.1" https://flaechenklar.de/ \| grep -E "<h1>\|<h2>"` | Mindestens 5 H1/H2 sichtbar (aus noscript-Fallback) |
| Lighthouse-Score | https://pagespeed.web.dev → URL eingeben | SEO 100, Performance >85, Accessibility >90, Best Practices >90 |

### 3. Google Search Console einrichten (15 Min, einmalig)

1. https://search.google.com/search-console öffnen
2. „Property hinzufügen" → **Domain** (nicht URL-Präfix!) → `flaechenklar.de`
3. DNS-TXT-Record-Eintrag bekommen → bei deinem Domain-Anbieter eintragen
4. Verifizieren (kann ein paar Minuten dauern)
5. Im Search Console Dashboard: links „Sitemaps" → `https://flaechenklar.de/sitemap.xml` einreichen
6. „URL-Inspektion" oben → `https://flaechenklar.de/` einfügen → „Indexierung beantragen"

**Ergebnis nach ~1 Woche:** Erste Klick-Impressions in Search Console sichtbar,
Indexierungs-Fehler (falls vorhanden) erscheinen unter „Seiten".

### 4. Bing Webmaster Tools (optional, +5 Min)

Bing hat zwar wenig Marktanteil, aber Behörden-Browser nutzen oft Edge mit
Bing als Default:

1. https://www.bing.com/webmasters
2. Property hinzufügen → kann Search-Console-Property importieren (1 Klick)
3. Sitemap einreichen

## Stufe 2 — Marketing-Layer (✅ größtenteils erledigt)

Stufe 2 war im Plan vorgesehen, ist aber im Repo schon umgesetzt:
- `src/sections/` mit Hero, ProblemChance, Funktionen, Sicherheit, Vollgeschoss,
  Preise, Kontakt, DemoBanner
- `public/impressum.html` + `public/datenschutz.html` mit Worker-Routing
- Cloudflare-Pages-Deploy via GitHub Actions

**Offene Restpunkte aus Stufe 2 (TODO bei Bedarf):**
- [ ] Impressum/Datenschutz inhaltlich review (Anschrift korrekt? USt-ID? DSGVO vollständig?)
- [ ] Kontaktformular statt nur mailto-Link (optional — Cloudflare Workers + KV oder Email-Worker)
- [ ] Referenz-Sektion mit Markt Postbauer-Heng (Einverständnis vorausgesetzt)
- [ ] Logo-Verfeinerung für Mobile-Header

## Stufe 3 — Content + Off-Page (Roadmap, kontinuierlich)

Nach Stufe 1+2 sind die technischen Voraussetzungen für organisches Wachstum
gegeben. Stufe 3 ist Marketing-Arbeit, keine Code-Änderung:

**Content-Bausteine (priorisiert):**
1. Blog-Artikel „Was ist eine Geschossfläche?" (Glossar/Erklär-Artikel, ~1500 Wörter)
2. Glossar/FAQ-Seite: KAG Bayern Art. 5, Art. 83 Abs. 7 BayBO, GFZ-Berechnung
3. Case-Study Markt Postbauer-Heng (mit Einverständnis)
4. „Beitragspflicht Bayern" — Long-Tail-Keyword-Artikel

**Off-Page:**
- Eintrag in Kommunalsoftware-Verzeichnisse (komuna.net, bauamt24.de)
- LinkedIn-Posts zu Bauamts-Themen
- Bayerischer Gemeindetag / Städtetag — Kontakt für Verlinkung
- Gastbeitrag in „Der Bayerische Bürgermeister" / BWK

**Monitoring (wöchentlich, 10 Min):**
- Search Console: Klicks, Impressions, CTR, Position
- Crawl-Errors checken
- Nach 3 Monaten: Backlink-Profil via ahrefs.com (kostenlos für eigene Domain)

## Bekannte Risiken / offene Fragen

1. **Cloudflare-SPA-Fallback:** `wrangler.toml` hat `not_found_handling = "single-page-application"`. Static-Assets-Resolver liefert echte Dateien zuerst (vor SPA-Fallback) — sitemap.xml/robots.txt/og-image.png sollten korrekt geliefert werden. Falls Validator-Test fehlschlägt: in worker/index.ts explizite Routes für `/sitemap.xml` und `/robots.txt` ergänzen.
2. **JSON-LD-Preis-Range:** Ich habe `lowPrice: 1600` / `highPrice: 14500` aus `src/content/preise.ts` übernommen. Wenn sich die Preise ändern, JSON-LD in `index.html` mit-ändern.
3. **JSON-LD-Author:** „Alexander Geitner" als Person. Falls du auf GmbH/Einzelunternehmen umstellst, würde das später ein `Organization`-Schema werden (Anschrift, Kontakt, USt-ID).
4. **noscript-Fallback-Wartung:** Wenn sich Hero-/Funktionen-/Preise-Texte ändern, sollte der Fallback synchronisiert werden — sonst sieht Google veraltete Inhalte. Falls das nervt: später Stufe 2.5 als Build-Step (z. B. via vite-plugin), der den Fallback aus `src/content/` automatisch generiert.
