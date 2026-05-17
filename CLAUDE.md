# FlächenKlar-Website — Session-Memory für Claude

Letzter Stand: 2026-05-16, nach Welle 2 (PR #6, Merge `3c9cf99`) — Founder-Story-Block mit Alexander-Foto zwischen ProblemChance und Funktionen, 5-Tier-Preise-Card-Grid mit Pilot-Banner und Counter-Animationen, Hero-H1-Word-Stagger, ScrollProgressBar, Hero-Parallax, Vollgeschoss-Counter, Card-Hover-Glow auf allen Karten. PSI nach Welle 2: Mobile 100/100/96/92, Desktop 100/97/96/92 (Mobile Performance +3, Mobile A11y +3 ggü. Welle 1).

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

**Letzter Major-Schritt:** Welle 2 (PR #6 als Restore von PR #4 + Cleanup-Commit, Merge `3c9cf99`) — neuer Founder-Block (`src/sections/Founder.tsx`) zwischen ProblemChance und Funktionen mit Alexander-Portrait in Polaroid-Frame + Ghost-Panel, 5-Tier-Preise-Card-Grid (`Preise.tsx`) mit Pilot-Banner und `useCountUp`-animierten Preisen, Hero-H1-Word-Stagger via `.stagger-word`-CSS-Klasse, ScrollProgressBar (`src/components/animations/ScrollProgressBar.tsx`) fixed top, Hero-Parallax (`BlueprintGrid` bewegt sich 30 % langsamer beim Scrollen), Vollgeschoss-Counter auf Beispiel-Berechnung, Card-Hover-Glow-Token auf allen Card-Grids.

Davor: Design-Upgrade (PR #3, Merge `a803055`) — zentrales Token-System in `src/components/ui/tokens.ts`, Bento-Grid für Funktionen, asymmetrische Layouts, Hero-PolygonDemo mit Ghost-Panel, TealUnderline-Highlights, animiertes FAQ-Akkordeon, Focus-Visible, IntersectionObserver-Active-Section-Nav, Skip-Link, theme-color.

| Bereich | Status |
|---|---|
| Marketing-Sektionen (Hero, Funktionen, Preise, FAQ, Kontakt) | ✅ vollständig |
| Kontaktformular via Formspree | ✅ aktiv |
| Impressum, Datenschutz | ✅ separate Cloudflare-served HTML-Seiten |
| 60-Sek-Teaser auf Homepage | ✅ live mit echten R2-URLs |
| `/tour`-Route mit Walkthrough-Player | ✅ live mit echten R2-URLs |
| 4 Walkthrough-Kapitel produziert | ✅ alle 4 hochgeladen + Tour.tsx aktualisiert |
| `/tutorial`-Route mit 8-Kapitel-Player | ✅ Code live (2026-05-17), MP4s noch nicht hochgeladen |
| 8 Tutorial-Kapitel produziert (~28 min Onboarding-Ersatz) | ⏸ offen, User dreht selbst |
| Zentrales Design-Token-System | ✅ `src/components/ui/tokens.ts` (Cards, Buttons, Focus-Rings, Typo, Icon-Sizes, Hover-Glow) |
| Premium-Polish + a11y-Essentials | ✅ PR #3 merged, live |
| Founder-Story-Block mit Foto | ✅ PR #6 merged, `public/alexander-portrait.webp` (87.9 KB) |
| 5-Tier-Preise-Card-Grid + Pilot-Banner | ✅ PR #6 merged, mit Counter-Animationen |
| Premium-Animationen (Stagger / Parallax / ScrollProgress / Counter) | ✅ PR #6 merged, live |

## Architektur-Eckpunkte

- **Routing:** Eigener Mini-Router (`src/router.tsx`, ~55 Zeilen) für 3
  Routen (`/`, `/tour`, `/tutorial`). Kein React Router. `useRoute()`-Hook
  plus `navigate(to: RoutePath)`-Helper. Typ
  `RoutePath = "/" | "/tour" | "/tutorial"`.
- **SPA-Fallback** in `wrangler.toml` aktiv: alle URLs → `index.html`.
- **VideoPlayer-Komponente** (`src/components/VideoPlayer.tsx`):
  wiederverwendbar für 1 Quelle (Teaser) oder n Kapitel (Tour). Features:
  scroll-autoplay-stumm, Mute-Toggle-Overlay, Mobile-Tap-Fullscreen,
  Kapitel-Sidebar, optionale VTT-Captions.
- **Layout:** `App.tsx` = Nav + `<Router />` + Footer. Router-Output ist
  `<Home />`, `<Tour />` oder `<Tutorial />`.
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
- **Premium-Animationen (Welle 2):**
  - `useCountUp` mit Options-Object-Signature (`durationMs`, `enabled`,
    `startDelayMs`, `decimals`) — staggered Counter auf Preise + Vollgeschoss
  - `.stagger-word` CSS-Klasse + `stagger-in`-Keyframe für Hero-H1 Word-Stagger
    (60 ms je Wort, 600 ms total)
  - `ScrollProgressBar` (`src/components/animations/ScrollProgressBar.tsx`) —
    rAF-throttled scroll-listener, 0.5 px teal-Bar fixed top
  - Hero-Parallax: `useScrollY`-Hook im Hero, `transform3d` auf `BlueprintGrid`
    via neuem `style`-Prop (BlueprintGrid 30 % langsamer als Content)
  - `CARD_HOVER_GLOW` Token (`shadow-[...]` mit teal-Tint) — auf Cards
    in Funktionen / Sicherheit / DemoBanner / Preise
  - Alle Animationen respektieren `prefers-reduced-motion`

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
tutorial-kapitel-{1..8}.mp4 (gesamt ~28 min)         ⏸ noch nicht aufgenommen
tutorial-kapitel-{1..8}.vtt (Untertitel)             ⏸ noch nicht aufgenommen
tutorial-kapitel-{1..8}-poster.webp                  ⏸ noch nicht aufgenommen
```

Tutorial-Naming-Konvention bewusst analog zu Tour gewählt (kein
`.de.`-Infix). Drehbuch + Workflow-Integration siehe Plan-Datei
`C:\Users\Alexander\.claude\plans\fl-chenklar-kurzzusammenfassung-immutable-liskov.md`.

Upload-Workflow: Dashboard-Drag&Drop oder Wrangler CLI (`wrangler login`
nötig). Details in `docs/video-assets.md`.

## Wichtige Dateien

| Pfad | Zweck |
|---|---|
| `src/App.tsx` | Layout-Shell mit Router + Skip-to-Content-Link + `<main id="main">` + `<ScrollProgressBar />` |
| `src/router.tsx` | Mini-Router (useRoute, navigate, RoutePath) |
| `src/components/ui/tokens.ts` | Zentrales Design-Token-System (Cards, Buttons, Focus, Typo, Icons, Hover-Glow) |
| `src/components/VideoPlayer.tsx` | Custom HTML5-Player |
| `src/components/Nav.tsx` | Route-aware Anchor-Nav + IntersectionObserver-basierte aktive-Section-Highlight |
| `src/components/Reveal.tsx` | Scroll-triggered Fade-Slide-In, IntersectionObserver-basiert |
| `src/components/TealUnderline.tsx` | In-View-getriggerte teal Underline-Animation für Headline-Akzente |
| `src/components/BlueprintGrid.tsx` | Drift-animiertes Hintergrund-Grid, optionaler `style`-Prop für Parallax |
| `src/components/animations/ScrollProgressBar.tsx` | rAF-throttled Scroll-Progress-Bar fixed top |
| `src/sections/Founder.tsx` | Founder-Story-Block, Portrait-Foto in Polaroid-Frame + Ghost-Panel |
| `src/hooks/useCountUp.ts` | Counter-Animation mit Options-Object (enabled, startDelayMs, decimals) |
| `public/alexander-portrait.webp` | Portrait Alexander Geitner (B&W, 600×800, 87.9 KB) |
| `scripts/build-portrait.mjs` | sharp-basiertes Optimierungs-Script für das Portrait (`npm run build-portrait`) |
| `src/pages/Home.tsx` | Homepage mit allen Sektionen |
| `src/pages/Tour.tsx` | `/tour`-Seite mit 4-Kapitel-Player + Footer-Hinweis zum Tutorial |
| `src/pages/Tutorial.tsx` | `/tutorial`-Seite mit 8-Kapitel-Player (~28 min Onboarding-Ersatz) + CTA-Block (Demo + Kontakt-Mail) |
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

_Aktuell keine offenen Punkte. Letzter Diskussionsstand 2026-05-16:
SEO 92 (Mobile + Desktop) ist **bewusst so akzeptiert** — siehe
„Erkenntnisse" unten. Nicht versuchen zu „fixen"._

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
- _**PR #6 — Welle 2 (Restore + Cleanup).** Saga: PR #4 wurde gemerged
  in dem Augenblick als nur der erste Welle-2-Commit `e1368d7` auf der
  Branch war (Mit-Switcher-Version). Mein Cleanup-Commit `6005e85`
  (Switcher raus, Foto rein, Variant C als Baseline) wurde unmittelbar
  danach gepusht — kam aber nicht in den Merge. User reverted dann den
  ganzen Merge via PR #5. Restore via PR #6: `git revert f4327d9`
  (bringt e1368d7-Inhalt zurück) + cherry-pick `6005e85` (Cleanup).
  Ergebnis Live: Founder-Block mit Portrait, 5-Tier-Preise-Cards mit
  Pilot-Banner und Counter-Animationen, Hero-H1 Word-Stagger,
  ScrollProgressBar, Hero-Parallax, Vollgeschoss-Counter,
  Card-Hover-Glow auf allen Card-Grids. Variant-Switcher und
  `useAnimVariant`-Hook sind weg (waren nur für die Vergleichsphase).
  Build: CSS 31.72 KB (6.31 KB gzipped), JS 262.45 KB (79.59 KB gzipped),
  bleibt unter 90 KB gzip-Budget._
- _**PSI-Audit nach Welle 2.** Mobile: Performance **100**,
  Accessibility **100**, Best Practices **96**, SEO **92**. Desktop:
  Performance **100**, Accessibility **97**, Best Practices **96**,
  SEO **92**. Gegenüber Welle 1 (Mobile 97/97/96/92, Desktop 100/97/96/92):
  Mobile Performance **+3** auf 100, Mobile A11y **+3** auf 100, alle
  anderen Werte identisch. Erstaunlich, weil Welle 2 echt was draufgepackt
  hat: Hero-Word-Stagger, Parallax-BlueprintGrid (rAF-throttled Scroll-
  Listener), ScrollProgressBar, useCountUp-Counter in Preise (5×) und
  Vollgeschoss (4 Zeilen), Card-Hover-Glow. Funktioniert weil alle
  Animationen GPU-beschleunigt via `transform`/`opacity` laufen
  (kein Layout-Reflow), Scroll-Handler `passive: true` + rAF-Throttling
  haben, IntersectionObserver-getriggerte Animationen nur beim Reveal
  ausführen, und `prefers-reduced-motion: reduce` durchgängig respektiert
  wird. SEO bleibt bei 92 (Cloudflare `Content-Signal:`, bewusst akzeptiert
  — siehe SEO-92-Diagnose unten)._
- _**PSI-Audit nach Design-Upgrade.** Mobile: Performance **97**,
  Accessibility **97**, Best Practices **96**, SEO **92**. Desktop:
  Performance **100**, Accessibility **97**, Best Practices **96**,
  SEO **92**. Performance 100 Desktop / 97 Mobile ist deutlich über dem
  90er-Ziel — Mobile-Lighthouse drosselt CPU 4× und simuliert 3G, was
  das beachtlich macht. A11y 97 zeigt, dass Skip-Link + Focus-Visible +
  ARIA-Arbeit messbar zählen. SEO 92 ist auf beiden Strategien identisch
  — siehe nächster Punkt._
- _**SEO-92-Diagnose + Entscheidung (Commit `54a405f` + Diskussion).**
  Cloudflare injiziert seit dem AI-Crawl-Control-Feature einen
  „Cloudflare Managed Content"-Block in jede robots.txt mit eigenem
  `User-agent: *` + non-standard `Content-Signal:`-Direktive.
  Unser `public/robots.txt` hatte zusätzlich noch einen eigenen
  `User-agent: *` Block — Lighthouse meldete „robots.txt ist ungültig".
  Fix `54a405f`: eigenen User-agent-Block entfernt, nur Sitemap-Verweis
  behalten. SEO blieb trotzdem auf 92 — Trigger war die `Content-Signal:`
  Zeile selbst, die als non-standard gilt. Theoretisch deaktivierbar im
  CF-Dashboard unter AI Crawl Control → Managed robots.txt → toggle off
  (radikal) oder Zone Overview → Control AI Crawlers → Display Content
  Signals Policy → uncheck (chirurgisch, falls UI das anbietet).
  **Bewusst nicht umgesetzt**, weil:
  (1) 92 ist im Lighthouse-grünen Bereich, Google indexiert problemlos
  (Search Console „URL ist auf Google", FAQs erkannt);
  (2) Cloudflare-Docs bestätigen selbst „no impact on crawling rates
  or SEO" — Lighthouse-Validator-Tick, kein echtes Ranking-Problem;
  (3) die `Content-Signal: ai-train=no`-Zeile schützt aktiv vor
  AI-Training auf unseren Bauamts-/KAG-Bayern-Texten, das wegen 8
  Punkten im Dev-Tool aufzugeben wäre ein echter Verlust.
  Score 92 ist **intentional, nicht open todo**._

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
- Letzter Merge: PR #6 (Welle 2 Restore) → Merge-Commit `3c9cf99`
- Letzte Pushes auf main: `e0ba298` (Cleanup) + `693e7ea` (Reapply von revertiertem Welle-2-Inhalt)
- Davor: PR #5 hatte PR #4 komplett revertiert (siehe Welle-2-Saga in Erkenntnissen)

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
- **Don't merge PRs zu früh, wenn noch Folge-Commits pending sind.**
  Klassische Race-Condition zwischen Welle 2: PR #4 hatte nur den ersten
  Commit (mit Switcher), Cleanup-Commit lag noch lokal. User merged
  während Cleanup gepusht wurde — Cleanup landete nicht in main, sondern
  nur auf der toten Feature-Branch. Lehre: warten bis explizit „ist alles
  in der Branch" gesagt wird, dann erst mergen. Oder: PR-Beschreibung
  klar markieren wenn weitere Commits folgen (Draft-PR + readyForReview-
  Flag). Recovery klappte aber sauber: revert-of-revert + cherry-pick
  des verlorenen Cleanup-Commits über PR #6.
- **Welle-2-Animations-Stack:** Hero-Parallax via `useScrollY`-Hook +
  `transform3d` auf `BlueprintGrid.style` Prop (kein expensive Repaint,
  GPU-composited). ScrollProgressBar als eigene Komponente in
  `src/components/animations/`, rAF-throttled, `passive: true`-listener.
  Hero-H1 Word-Stagger via CSS-Klasse `.stagger-word` + Keyframe (kein JS
  pro Frame). Counter via `useCountUp` mit Options-Object (`enabled`,
  `startDelayMs`, `decimals`) — letzteres unterstützt Vollgeschoss-
  Dezimalwerte ohne externe Lib. Alle Animationen respektieren
  `prefers-reduced-motion: reduce`.
- **Portrait-Asset-Pipeline:** Original 117 MB / 4000×6000 PNG aus
  User-Ablage → optimiertes 87.9 KB / 600×800 WebP via
  `scripts/build-portrait.mjs` (sharp-basiert, parallel zu
  `build-favicons.mjs` und `build-og-image.mjs`). Fallback-Initial-Avatar-
  Platzhalter (`AG`) in Founder.tsx via `onError`-Handler, falls Datei
  fehlt — Block strukturell trotzdem korrekt.
