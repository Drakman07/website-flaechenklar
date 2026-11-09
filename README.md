# website-flaechenklar

Marketing-Seite für **FlächenKlar**, das Aufmaß-Werkzeug für bayerische
Bauämter: Geschossflächen aus dem Bauantrags-PDF messen, Aufmaßprotokoll für
die Akte, Bescheid-Entwurf nach Art. 5 KAG Bayern auf Wunsch.

## Stack

- Statische Seiten in `seite/` (HTML, CSS, Scroll-Engine `scrollcraft.js`), seit 09.11.2026
- Bau-Skript `scripts/baue-seite.mjs` (Node, ohne Abhängigkeiten)
- Cloudflare Workers (Static Assets binding), Deploy via GitHub Actions

Die frühere React-/Vite-/Tailwind-Seite liegt im Tag `react-letzter-stand`.

## Entwicklung

```bash
npm install
npm run dev          # baut dist/ und startet wrangler dev (http://localhost:8787)
npm run typecheck    # TS-Check für src/content und worker
```

Nach Änderungen in `seite/` oder `src/content/` neu bauen (`npm run build`), wrangler
übernimmt `dist/` dann von selbst.

## Was das Bau-Skript macht

- kopiert `public/` und `seite/` nach `dist/`
- füllt aus `src/content/versionen.ts` die Versionsliste (`/versionen`), den Block
  „Neu in Version“ (`/tutorial`) und die Programmversion in jeder Fußzeile
- füllt aus `src/content/preise.ts` den Preiswähler der Startseite und das Angebot im JSON-LD
- schreibt Links auf saubere Adressen um (`demo.html` → `/demo`, `assets/` → `/assets/`)
- ergänzt je Seite canonical, Open Graph, Twitter-Karte und Favicons, auf der Startseite JSON-LD

`src/content/versionen.ts` bleibt an diesem Ort: das Release-Werkzeug des Programms
(`tool/tools/bump-version.js`) schreibt dort bei jedem Release einen Eintrag hinein.

## Adressen

| Adresse | Inhalt |
|---|---|
| `/` | Startseite (`/#kontakt` aus alten Mails leitet auf `/demo`) |
| `/demo` | Demo- und Angebotsanfrage (Formspree) |
| `/tutorial` | Tutorial in 13 Kapiteln (Videos von `videos.flaechenklar.de`) |
| `/versionen` | Versionsverlauf |
| `/impressum`, `/datenschutz` | Rechtstexte |

Der Worker leitet per 301 um: `www.` und `http:` auf `https://flaechenklar.de`,
`/tour` auf `/tutorial`, `/<seite>.html` und `/<seite>/` auf `/<seite>`.
Unbekannte Adressen bekommen `404.html` mit Status 404.

## Deployment

Bei jedem Push auf `main` deployt GitHub Actions automatisch zu Cloudflare
Workers (siehe `.github/workflows/deploy.yml`). Die CI fährt vorher `npm run typecheck` und `npm run build`; schlägt eines fehl, bleibt die alte Version live. Erforderliche Repo-Secrets:

- `CLOUDFLARE_API_TOKEN` (Cloudflare Dashboard → My Profile → API Tokens →
  Template „Edit Cloudflare Workers")
- `CLOUDFLARE_ACCOUNT_ID` (Cloudflare Dashboard, rechte Sidebar)

Manuell deployen geht auch:

```bash
npm run deploy
```

## Struktur

```
seite/              # die Seiten (Quelle), Assets und Schriften
src/content/        # versionen.ts und preise.ts (Datenquellen für den Bau)
public/             # Favicons, OG-Bild, robots.txt, sitemap.xml
scripts/            # baue-seite.mjs, Favicon- und OG-Bild-Erzeugung
worker/index.ts     # Canonical-Host, Weiterleitungen
```

## Lizenz

MIT — siehe [LICENSE](./LICENSE).
