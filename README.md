# website-flaechenklar

Marketing-Seite für **FlächenKlar** — das Aufmaß-Werkzeug für bayerische
Bauämter. PDF rein, Polygon zeichnen, druckreifes Aufmaßprotokoll als
Berechnungsgrundlage für den Herstellungsbeitrag nach Art. 5 KAG Bayern.

## Stack

- Vite 5 + React 19 + TypeScript (strict)
- Tailwind CSS 3 mit Theme-Tokens via CSS-Variablen
- Cloudflare Workers (Static Assets binding)
- Deploy via GitHub Actions

## Entwicklung

```bash
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run typecheck    # TS check
```

## Lokaler Worker-Test

```bash
npm run build
npm run preview      # wrangler dev (http://localhost:8787)
```

Im lokalen Worker-Modus funktionieren die Routen `/`, `/impressum` und
`/datenschutz` exakt wie in Produktion.

## Deployment

Bei jedem Push auf `main` deployt GitHub Actions automatisch zu Cloudflare
Workers (siehe `.github/workflows/deploy.yml`). Erforderliche Repo-Secrets:

- `CLOUDFLARE_API_TOKEN` (Cloudflare Dashboard → My Profile → API Tokens →
  Template „Edit Cloudflare Workers")
- `CLOUDFLARE_ACCOUNT_ID` (Cloudflare Dashboard, rechte Sidebar)

Manuell deployen geht auch:

```bash
npm run deploy
```

## Struktur

```
src/
├── sections/       # Sektionen der Landing Page
├── components/     # Wiederverwendbare Bausteine
└── content/        # Listen-Daten (Funktionen, Sicherheit, Preise)
public/
├── impressum.html  # statisch, vom Worker unter /impressum ausgeliefert
└── datenschutz.html
worker/
└── index.ts        # Routing für Legal-Pages
```

## Lizenz

MIT — siehe [LICENSE](./LICENSE).
