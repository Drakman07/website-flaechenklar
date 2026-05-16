# FlächenKlar-Website — Session-Memory für Claude

Letzter Stand: 2026-05-16, nach Design-Upgrade (PR #3) — zentrales Token-System, Premium-Visuals (Bento, asymmetrische Layouts, Hero-Layering), Polish (Card-Hover-Konsistenz, Button-System, Focus-Visible), a11y-Essentials (Skip-Link, aktive-Section-Nav, theme-color).

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

**Letzter Major-Schritt:** Design-Upgrade (PR #3, Merge-Commit `a803055`) — zentrales Token-System in `src/components/ui/tokens.ts`, Bento-Grid für Funktionen, asymmetrische Layouts (Vollgeschoss 5fr_7fr, Sicherheit Headline-links-Karten-rechts), Hero-PolygonDemo mit Ghost-Panel + `shadow-feature`, strategische TealUnderline-Highlights, animiertes FAQ-Akkordeon, Focus-Visible auf allen interaktiven Elementen, IntersectionObserver-basierte aktive-Section-Highlight in der Nav, Skip-to-Content-Link, theme-color Meta-Tag.

| Bereich | Status |
|---|---|
| Marketing-Sektionen (Hero, Funktionen, Preise, FAQ, Kontakt) | ✅ vollständig |
| Kontaktformular via Formspree | ✅ aktiv |
| Impressum, Datenschutz | ✅ separate Cloudflare-served HTML-Seiten |
| 60-Sek-Teaser auf Homepage | ✅ live mit echten R2-URLs |
| `/tour`-Route mit Walkthrough-Player | ✅ live mit echten R2-URLs |
| 4 Walkthrough-Kapitel produziert | ✅ alle 4 hochgeladen + Tour.tsx aktualisiert |
| Zentrales Design-Token-System | ✅ `src/components/ui/tokens.ts` (Cards, Buttons, Focus-Rings, Typo, Icon-Sizes) |
| Premium-Polish + a11y-Essentials | ✅ PR #3 merged, live |

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
- **Marken-Farben:** `navy` + `teal` (HSL-CSS-Custom-Properties in
  `src/index.css`, gemappt in `tailwind.config.ts`).
- **Schrift:** Geist Sans (lokal via `@fontsource/geist-sans`).
- **Design-Tokens:** `src/components/ui/tokens.ts` — wiederverwendbare
  Tailwind-Klassen-Bundles (`CARD_BASE`, `CARD_HOVER`, `BTN_PRIMARY`,
  `FOCUS_RING`/`FOCUS_RING_DARK`, `LABEL`, `LEAD`, `INPUT_ON_DARK`,
  `ICON_SIZE`). Statisch typisierte Strings, keine dynamische Klassen-Concat
  → Tailwind-Purge-safe.
- **Shadow-System:** `shadow-card` / `shadow-card-hover` / `shadow-feature`
  (semantisch in `tailwind.config.ts` ergänzt), bewusst zurückhaltend
  (~12% Opacity max) — passt zur Bauamts-Tonalität.
- **Reveal-Motion:** `transition-[opacity,transform]` 700ms + `translate-y-4`,
  `motion-reduce:transition-none` respektiert.

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
| `src/App.tsx` | Layout-Shell mit Router + Skip-to-Content-Link + `<main id="main">` |
| `src/router.tsx` | Mini-Router (useRoute, navigate, RoutePath) |
| `src/components/ui/tokens.ts` | Zentrales Design-Token-System (Cards, Buttons, Focus, Typo, Icons) |
| `src/components/VideoPlayer.tsx` | Custom HTML5-Player |
| `src/components/Nav.tsx` | Route-aware Anchor-Nav + IntersectionObserver-basierte aktive-Section-Highlight |
| `src/components/Reveal.tsx` | Scroll-triggered Fade-Slide-In, IntersectionObserver-basiert |
| `src/components/TealUnderline.tsx` | In-View-getriggerte teal Underline-Animation für Headline-Akzente |
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

1. **Lighthouse-Audit mit harten Zahlen** — manuelle Schätzung
   (Performance 88-95 Mobile / 95-100 Desktop, A11y/BP/SEO je 95-100)
   liegt vor, aber Live-PSI-API hat unauthenticated Rate-Limit (429) auf
   die Test-IP geworfen. Wenn echte Zahlen gebraucht: entweder
   `https://pagespeed.web.dev/?url=https://flaechenklar.de/` im Browser
   (PSI-UI hat eigene Quota pro Browser-Session), Chrome-DevTools-
   Lighthouse-Tab lokal, oder PSI-API-Key in Google Cloud Console (~2 Min).

_Erledigt 2026-05-16:_
- _Alle 4 Walkthrough-Kapitel produziert, MP4+VTT+WebP-Poster in R2 hochgeladen
  (Naming: `tour-kapitel-{1..4}.{mp4,vtt}` und `-poster.webp` — Untertitel
  ohne `.de.`-Infix, abweichend vom Teaser)._
- _`KAPITEL`-Array in `Tour.tsx` auf echte R2-URLs umgestellt, deployt._
- _`docs/video-assets.md` auf das tatsächliche Naming nachgezogen._
- _**Tour-Subtitel-Fix (Commit `9657447`):** Der Subtitel auf `/tour`
  enthielt „Vier Kapitel à 60 Sekunden" — die echten Kapitel sind aber
  unterschiedlich lang, manche > 60 Sek. Neu: „Vier kompakte Kapitel zu
  den wichtigsten Funktionen." Hält das Brevity-Versprechen ohne falsche
  Sekundenangabe._
- _**PR #2 — Multi-Size-PNG-Favicons + Logo-URL fix.** Google zeigte in
  der Suche das generische Welt-Icon statt des FlächenKlar-Logos.
  Zwei Root-Causes: (1) nur SVG-Favicon ohne PNG-Fallback —
  Google-Crawler liest aber bevorzugt PNG. (2) `Organization`-JSON-LD
  hatte `logo: og-image.png` (Banner-Format, kein quadratisches Logo).
  Fix: `scripts/build-favicons.mjs` rendert via `sharp` aus
  `public/favicon.svg` ein komplettes PNG-Set (16/32/48/96/180/192/512
  + `logo-512.png` für Schema.org). `index.html`-Favicon-`<link>`s
  erweitert, `logo`-URL in JSON-LD auf `logo-512.png` korrigiert.
  Neues npm-script `build-favicons`, `sharp` als explizite
  devDependency. Anschließend in Google Search Console
  Indexierung beantragt — alle Checks grün („URL ist auf Google",
  HTTPS, FAQs erkannt)._
- _**PR #3 — Design-Upgrade (Commit `a7cf725`, Merge `a803055`).**
  Aus dem Eindruck „solide Basis aber wirkt etwas flach + uneinheitlich"
  ein vollständiger Polish-Pass. Foundation: neue Token-Datei
  `src/components/ui/tokens.ts` + Shadow-System (`shadow-card`,
  `shadow-card-hover`, `shadow-feature`) in `tailwind.config.ts`.
  Polish: alle Cards hovern jetzt einheitlich (DemoBanner + Preise hatten
  vorher abweichende Hover-Patterns), Button-System mit Primary/Secondary/
  Tertiary/Compact-Varianten, `:focus-visible`-Ring auf jedem
  interaktiven Element (Behörden-User mit Tab-Nav), Form-Input-Kontrast
  von `bg-white/5` auf `bg-white/10`, Icon-Größen-System (14/18/22/28)
  statt 16/20/22-Mix, FAQ nativer `<details>` ersetzt durch state-
  basiertes Akkordeon mit `grid-template-rows`-Animation.
  Premium-Visuals: Bento-Grid für Funktionen (erste Card als
  `lg:col-span-2`-Hero-Card), asymmetrische Layouts in Vollgeschoss
  (`lg:grid-cols-[5fr_7fr]`) und Sicherheit (Headline links über
  `lg:col-span-2`, Cards rechts in `sm:grid-cols-2`), Hero-PolygonDemo
  mit Ghost-Panel + `shadow-feature` für Layered-Composition,
  strategische TealUnderline-Highlights in Funktionen/Sicherheit/
  Preise/Vollgeschoss/Tour-Headlines, vertikale Divider zwischen den
  Hero-Stat-Countern. a11y-Essentials: Skip-to-Content-Link am Anfang
  von App.tsx (`sr-only` → beim Tab sichtbar), `<main id="main">` als
  Sprungziel, IntersectionObserver-basierte aktive-Section-Highlight
  in der Nav (animierte teal Hairline unter dem aktuellen Link),
  `theme-color="#0d1830"` Meta-Tag für mobile Browser-Chrome,
  Tour-Seite auf gleichen Token-Standard gehoben._
- _**CI auf Node 24 + Actions v5 (Commit `577377b`).**
  `.github/workflows/deploy.yml`: `actions/checkout@v4`→`v5`,
  `actions/setup-node@v4`→`v5`, `node-version: 20`→`24`. Deploy nach Bump
  weiterhin 34s. `cloudflare/wrangler-action` bleibt v3 (v4 noch nicht
  stable). Live-Smoke der Production-Seite gegen `theme-color` und
  CSS-Bundle-Hash erfolgreich._
- _**Branch-Cleanup.** Remote-Branches `claude/optimistic-ptolemy-461bc7`
  (Design-Upgrade) und `feature/vorstellungsvideos` (PR #1 aus Initial-
  Walkthrough-Implementation) auf GitHub gelöscht. Klassifizierer-Hinweis
  bleibt gültig: Remote-Branch-Löschung braucht weiterhin explizite
  Wort-Bestätigung pro Branch (z.B. „ja, lösche X auf GitHub")._

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
- Letzter Merge: PR #3 (Design-Upgrade) → Merge-Commit `a803055`
- Letzter Push auf main: `a7cf725` (Design-Token-System + Premium-Polish + a11y-Essentials)

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
- **Google-Suche braucht PNG-Favicons, nicht nur SVG.** Auch wenn moderne
  Browser SVG-Favicons mögen, liest der Googlebot bevorzugt PNG-Varianten
  in mehreren Größen (16/32/48/96/192). Zusätzlich muss das
  `Organization`-JSON-LD ein **quadratisches** `logo` referenzieren —
  ein Open-Graph-Banner taugt da nicht. Sichtbarer Favicon in den
  Suchergebnissen kann nach Anpassung 1–4 Wochen brauchen
  (separater Cache als das Knowledge Panel).
- **Branch-Merge-Reihenfolge:** User merged PR auf GitHub manuell,
  bestätigt dann im Chat („gemergt") — erst dann lokalen Branch löschen.
  Vorzeitiges `git branch -d` schlägt als „not yet merged to HEAD" fehl,
  wenn der Merge auf GitHub noch nicht abgeschlossen ist.
- **Zentrale Design-Tokens als String-Konstanten** (statt React-Wrapper-
  Komponenten) bleiben Tailwind-Purge-safe und IntelliSense-freundlich,
  weil alle Klassennamen als Literale im Source-Code stehen. Dynamische
  Concat à la `bg-${color}-500` würde Tailwind nicht sehen → Bug-Quelle
  vermeiden, immer Literale halten.
- **Worktree-Workflow + Dubious-Ownership auf F:.** Das Repo liegt auf
  einem Laufwerk ohne Filesystem-Ownership (NTFS auf externer Platte),
  daher refused git Operations im Worktree mit „dubious ownership".
  Workaround pro Befehl: `git -c safe.directory='<path>' ...` (modifiziert
  globale Config nicht). `gh`-Befehle stolpern genauso → `--repo
  <owner>/<name>` explizit angeben, dann kann gh die Repo-Detection
  überspringen.
- **IntersectionObserver für aktive-Section-Nav:** `rootMargin: "-80px
  0px -55% 0px"` mit `threshold: 0` ergibt das natürlichste Verhalten —
  Section wird aktiv sobald sie das obere Drittel des Viewports erreicht,
  bleibt aktiv bis die nächste hochrutscht. Mit `aria-current="true"` auch
  für Screen-Reader korrekt.
- **`grid-template-rows: 0fr → 1fr` für FAQ-Akkordeon-Animation** ist die
  moderne, JS-freie Lösung statt height-Messung. `motion-reduce`-safe,
  funktioniert auf allen aktuellen Browsern. Kombiniert mit
  `aria-expanded` und kontrolliertem `useState` für sauberes A11y.
- **Skip-to-Content-Link** als erstes Element in App.tsx mit
  `sr-only focus:not-sr-only focus:fixed ...` — beim Tab als allererstes
  fokussiert sichtbar, dann visuell vorhanden mit `shadow-feature` +
  Focus-Ring. Screen-Reader und Tastatur-User können die Nav überspringen.
  Kosten praktisch null, A11y-Gewinn substantiell.
