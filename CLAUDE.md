# FlächenKlar-Website — Session-Memory für Claude

Letzter Stand: 2026-05-15, nach Live-Schalten des Teaser-Videos.

## Projekt-Kurzbeschreibung

Marketing-Website für **FlächenKlar** (das Aufmaß-Tool für bayerische
Bauämter, lebt im Schwester-Repo `Geschossflächenberechnung Tool`). Diese
Website ist die Sales-Frontline: erklärt das Tool, fängt Interessenten ab,
führt zur Demo-Anfrage.

- Live: https://flaechenklar.de
- Stack: React 19 + TypeScript (strict) + Tailwind 3 + Vite + Cloudflare
  Workers + R2
- Auto-Deploy: GitHub Actions auf Push nach `main`
- DSGVO-bewusst: keine Third-Party-Tracker, keine Cookies, keine Drittanbieter-Embeds

## Aktueller Stand (Mai 2026)

**Letzter Major-Schritt:** 60-Sek-Teaser-Video integriert und live.

| Bereich | Status |
|---|---|
| Marketing-Sektionen (Hero, Funktionen, Preise, FAQ, Kontakt) | ✅ vollständig |
| Kontaktformular via Formspree | ✅ aktiv |
| Impressum, Datenschutz | ✅ separate Cloudflare-served HTML-Seiten |
| 60-Sek-Teaser auf Homepage | ✅ live mit echten R2-URLs |
| `/tour`-Route mit Walkthrough-Player | ✅ live mit echten R2-URLs |
| 4 Walkthrough-Kapitel produziert | ✅ alle 4 hochgeladen + Tour.tsx aktualisiert |

## Architektur-Eckpunkte

- **Routing:** Eigener Mini-Router (`src/router.tsx`, ~50 Zeilen) für 2
  Routen (`/` und `/tour`). Kein React Router. `useRoute()`-Hook plus
  `navigate(to: RoutePath)`-Helper. Typ `RoutePath = "/" | "/tour"`.
- **SPA-Fallback** in `wrangler.toml` aktiv: alle URLs → `index.html`.
- **VideoPlayer-Komponente** (`src/components/VideoPlayer.tsx`):
  wiederverwendbar für 1 Quelle (Teaser) oder n Kapitel (Tour). Features:
  scroll-autoplay-stumm, Mute-Toggle-Overlay, Mobile-Tap-Fullscreen,
  Kapitel-Sidebar, optionale VTT-Captions.
- **Layout:** `App.tsx` = Nav + `<Router />` + Footer. Router-Output ist
  entweder `<Home />` oder `<Tour />`.
- **Marken-Farben:** `navy` + `teal` (definiert in `tailwind.config.js`).
- **Schrift:** Geist Sans (lokal via `@fontsource/geist-sans`).

## R2-Asset-Hosting

- **Bucket:** `flaechenklarvideos` (ENAM-Jurisdiction, kein EU-Lock — für
  öffentliche Marketing-Videos akzeptabel)
- **Custom Domain:** `videos.flaechenklar.de` (verknüpft, SSL aktiv)
- **CORS-Origins:** `https://flaechenklar.de`, `https://www.flaechenklar.de`
- **CORS-Methods:** GET, HEAD
- **CF-Account-ID:** `3604225b1ae285729146aa3a0c8fdf13`

Asset-Konventionen (siehe `docs/video-assets.md`):
```
teaser.mp4              (60 Sek, H.264 1080p)       ✅ hochgeladen
teaser.de.vtt           (deutsche Untertitel)        ✅ hochgeladen
teaser-poster.webp      (Standbild)                  ✅ hochgeladen
tour-kapitel-{1..4}.mp4 (à 60 Sek)                   ✅ hochgeladen
tour-kapitel-{1..4}.vtt (Untertitel)                 ✅ hochgeladen (ohne .de.-Infix)
tour-kapitel-{1..4}-poster.webp                      ✅ hochgeladen
```

Upload-Workflow: Dashboard-Drag&Drop oder Wrangler CLI (`wrangler login`
nötig). Details in `docs/video-assets.md`.

## Wichtige Dateien

| Pfad | Zweck |
|---|---|
| `src/App.tsx` | Layout-Shell mit Router |
| `src/router.tsx` | Mini-Router (useRoute, navigate, RoutePath) |
| `src/components/VideoPlayer.tsx` | Custom HTML5-Player |
| `src/components/Nav.tsx` | Route-aware Anchor-Nav (von `/tour` aus zurück + scroll) |
| `src/pages/Home.tsx` | Homepage mit allen Sektionen |
| `src/pages/Tour.tsx` | `/tour`-Seite mit 4-Kapitel-Player |
| `src/sections/TeaserSection.tsx` | Teaser-Block direkt nach Hero (live!) |
| `wrangler.toml` | CF-Workers-Config, SPA-Fallback aktiv |
| `.github/workflows/deploy.yml` | Auto-Deploy auf Push → main |
| `docs/video-assets.md` | R2-Upload-Workflow + Asset-Liste |
| `docs/superpowers/plans/2026-05-15-vorstellungsvideos.md` | Implementation-Plan für die Videos |

## Conventions

- **Commits:** Deutsche Botschaften, ASCII-only-Subject (keine Umlaute),
  Conventional-Commit-Prefix (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
  mit Scope wie `feat(router): …`, `feat(video): …`
- **Branches:** Für größere Features eigene `feature/<name>`-Branches,
  via PR (gh CLI) + `--merge` (Merge-Commit, no-ff) nach main. Kleine
  Doku-Fixes direkt auf main commiten ist ok.
- **PR-Merge:** User merged auf GitHub manuell — Selbst-Merge via
  `gh pr merge` ist im Classifier blockiert
- **Voiceover-Stil:** „du"-Anrede (User-Entscheidung Mai 2026), nicht
  „Sie". Marketing-Sektionen sind weiter neutral/impersonal — nur
  Video-Voiceover hat „du".

## Verify-Gate (statt Tests)

Das Projekt hat **kein Test-Framework** (Vitest o.ä.) — bewusst, weil
statische Marketing-Site mit 2 Routen. Gate stattdessen:
- `npm run typecheck` (TS strict)
- `npm run build` (Vite-Build muss durchlaufen)
- Manuelle Browser-Smoke gegen `npm run preview` (Wrangler)
- Auf Live: PowerShell `Invoke-WebRequest`-basierter Bundle-Check ob
  Asset-URLs im JS auftauchen

## Cloudflare-MCP

Es gibt einen Cloudflare-MCP-Server der R2-Verwaltung kann
(MCP-ID `401059e7-e63d-4465-a0b2-295dc67797a7`). Hat:
- `accounts_list`, `set_active_account`
- `r2_buckets_list`, `r2_bucket_create`, `r2_bucket_get`, `r2_bucket_delete`
- KEINE Custom-Domain- oder CORS-Endpoints → das muss Dashboard
- KEINE Object-Upload-Endpoints → das muss Dashboard oder `wrangler r2 object put`

## Offene Punkte / Roadmap

1. **Walkthrough-Kapitel produzieren** (4 × 60 Sek)
   - Themen: Schnellstart / Vollgeschosse nach KAG / Mehrere Geschosse + Maßstab / Export + Aufmaßprotokoll
   - Plan-Doc hat Skript-Skizzen für jedes Kapitel
2. **Echte Tour-URLs einsetzen** in `src/pages/Tour.tsx` (`KAPITEL`-Array)
   sobald Videos produziert
3. **GitHub-Actions-Refresh** — Node 20 → 24, actions/{checkout,setup-node}
   auf v5, wrangler-action prüfen
4. **VTT-Captions** für Walkthrough-Kapitel — Workflow steht
5. **Lighthouse-Performance-Audit** auf der Produktiv-Seite einmal laufen
   lassen (Ziel > 90 für `/` und `/tour`)

## Bei nächster Session-Aufnahme

1. `git log --oneline -10` für letzten Stand
2. `npm run typecheck` als Smoke
3. Diese CLAUDE.md lesen
4. Live-Seite https://flaechenklar.de checken
5. Mit User klären was als nächstes — wahrscheinlich Walkthrough-Produktion
   oder ein anderer Marketing-Block

## Lokale Pfade

- Repo-Wurzel: `F:\Geschäft\Unternehmen\Claude Code\Website FlächenKlar\`
- Tool-Schwester-Repo: `F:\Geschäft\Unternehmen\Claude Code\Geschossflächenberechnung Tool\`
  (eigene CLAUDE.md dort)
- Implementation-Plan: `docs/superpowers/plans/2026-05-15-vorstellungsvideos.md`

## GitHub

- Repo: https://github.com/Drakman07/website-flaechenklar (private)
- Letzter Merge: PR #1 (Vorstellungsvideos) → Merge-Commit `ba74625`
- Letzter Push auf main: `8b3dc31` (echte R2-URLs einsetzen)

## Erkenntnisse aus diesem Projektabschnitt

- **Subagent-Driven-Development funktioniert sehr gut** für klar
  spezifizierte React/TS-Features. 9 Tasks à ~5-10 Min Implementer +
  Review-Round-Trips, gut parallelisierbar. Reviews fingen 1 echten
  Critical-Bug (Nav nicht route-aware) + 1 wichtigen Bug (leere
  Captions-URL) — ohne Review wäre beides live gegangen.
- **Cloudflare R2 ist DSGVO-mäßig die saubere Wahl** für selbst gehostete
  Videos. Kein Cookie-Banner, eigene Custom-Domain, kein Tracker,
  Egress kostenlos. Ein Bauamt-User wird das schätzen.
- **`<video>` mit nativen Controls + Custom-Mute-Overlay** ist
  ausreichend — keine externe Video-Lib nötig.
- **WebP für Poster-Bilder ist sehr effizient** — 170 KB für ein
  detailreiches 1080p-Bild aus dem Tool-Screenshot.
- **`window.setTimeout(..., 50)` für Cross-Route-Scroll** ist
  pragmatisch, hat in den Reviews einen „nice but not necessary"-Tag
  bekommen. Wenn's mal komisch wirkt, durch effect-basiertes
  scroll-on-route-change ersetzen.
- **GitHub Actions deployt schnell** (~2 Min für Install + Typecheck +
  Build + CF-Deploy) — schnell genug für iterative Smoke-Sessions.
