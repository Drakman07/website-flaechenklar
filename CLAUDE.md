# FlächenKlar-Website — Session-Memory für Claude

Letzter Stand: 2026-07-19, **Tutorial v1.3 komplett neu produziert** —
13 Kapitel statt 10 (neues Drehbuch, s. `tutorial-spicker-v1.3.pdf`),
alle Kapitel neu gedreht + geschnitten (ffmpeg, CRF 23 1080p) + auf R2
hochgeladen (`tutorial-kapitel-{1..13}.mp4/-poster.webp`, gleiche
Objekte überschrieben, `Tutorial.tsx`-KAPITEL-Array + Hero-Text
aktualisiert). VTT-Untertitel bewusst ausgelassen diese Runde (alte
Kapitel-1..10-VTTs passen inhaltlich nicht mehr zum neuen Video —
`captions`-Feld komplett entfernt statt falsche Untertitel zu zeigen).
Details in `docs/video-assets.md` → Abschnitt „Tutorial v1.3".

Vorgänger-Stand 2026-06-25, **Welle 3 (Wow-Upgrade, PRs #10 + #11 gemerged)** — interaktives Aufmass-Tool im Hero (oben rechts, `src/components/PlanMessDemo.tsx`): vorgegebener L-Haus-Grundriss, Eckpunkte der Reihe nach abklicken → Messpolygon zeichnet sich → Flaeche 100,50 m² + Massketten → Aufmassblatt (`AufmassProtokoll`) entsteht darunter. Ersetzt die alte `PolygonDemo`. Dazu: choreografierter Hero-Auftritt (`fade-rise`), Zahlen-Mini-Viz (Ring/Sparkline/Balken auf den echten Stats 100 % / 0 / 1), editorial Typo-Skala + Micro-Interaktionen. PSI live (mobile): A11y 100 / BP 96 / SEO 100, LCP 423 ms, CLS 0,00. Null Animations-Lib (gsap war kurz für eine Scroll-Sequenz drin, wieder entfernt). Main-Bundle 82,95 KB gz.

Vorgänger-Stand 2026-05-17, Tutorial-Release (PRs #7 + #8) — `/tutorial`-Route live mit allen 8 Kapitel-MP4s (~45 min Onboarding-Ersatz) auf R2. /tour bekam Footer-Funnel zum Tutorial. Welle 2 (PR #6): Founder-Story-Block + Alexander-Foto, 5-Tier-Preise mit Pilot-Banner + Counter-Animationen, Hero-H1-Word-Stagger, ScrollProgressBar, Hero-Parallax, Card-Hover-Glow. PSI Welle 2: Mobile 100/100/96/92, Desktop 100/97/96/92.

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
| `/tutorial`-Route mit 13-Kapitel-Player | ✅ live mit echten R2-URLs (v1.3-Neuproduktion 2026-07-19) |
| 13 Tutorial-Kapitel produziert (~58 min, v1.3-Drehbuch) | ✅ alle 13 MP4s + 13 Poster auf R2, Player spielt ab |
| VTT-Untertitel für Tutorial (BFSG-relevant) | ⏸ offen — Whisper-Transkription empfohlen, Modell-Download noch offen |
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
- **CORS-Origins:** `https://flaechenklar.de`, `https://www.flaechenklar.de`,
  `http://localhost:5173` (Vite-Dev), `http://localhost:8787` (wrangler dev) —
  gesetzt am 12.09.2026 per `npx wrangler r2 bucket cors set flaechenklarvideos --file <json>`
  (JSON-Format: `{"rules":[{"allowed":{"origins":[...],"methods":[...],"headers":[...]},"maxAgeSeconds":3600}]}`)
- **CORS-Methods:** GET, HEAD — **CORS-Headers:** `Range`
- **Achtung `<track>`:** Die CORS-Regel allein reicht nicht. Ein Cross-Origin-VTT
  laedt der Browser nur, wenn das `<video>` `crossOrigin="anonymous"` traegt
  (`src/components/VideoPlayer.tsx`, gesetzt sobald `captions` da ist). Dann laufen
  MP4 und Poster ebenfalls im CORS-Modus. Beim Umschalten Asset-URLs per `?v=N`
  neu versionieren, sonst kann der `immutable`-Cache eine alte Antwort ohne
  `Access-Control-Allow-Origin` wiederverwenden. Details: `docs/video-assets.md`.
- **CF-Account-ID:** `3604225b1ae285729146aa3a0c8fdf13`

Asset-Konventionen (siehe `docs/video-assets.md`):
```
teaser.mp4              (60 Sek, H.264 1080p)       ✅ hochgeladen
teaser.de.vtt           (deutsche Untertitel)        ✅ hochgeladen
teaser-poster.webp      (Standbild)                  ✅ hochgeladen
tour-kapitel-{1..4}.mp4 (à 60 Sek)                   ✅ hochgeladen
tour-kapitel-{1..4}.vtt (Untertitel)                 ✅ hochgeladen (ohne .de.-Infix)
tour-kapitel-{1..4}-poster.webp                      ✅ hochgeladen
tutorial-kapitel-{1..8}.mp4 (gesamt 42:24 / 152 MB)  ✅ alle 8 hochgeladen
tutorial-kapitel-{1..8}-poster.webp                  ✅ alle 8 hochgeladen
tutorial-kapitel-{1..8}.vtt (Untertitel)             ⏸ noch offen (BFSG-relevant)
```

Tutorial-Naming-Konvention bewusst analog zu Tour gewählt (kein
`.de.`-Infix). Drehbuch + Workflow-Integration siehe Plan-Datei
`C:\Users\Alexander\.claude\plans\fl-chenklar-kurzzusammenfassung-immutable-liskov.md`.

**Tutorial-Drehbuch wich vs Plan-Spec leicht ab:** K5 jetzt
„Aufmaßprotokoll exportieren" (statt VG), K6 „Vollgeschoss-Berechnung"
(statt Aufmaß), K7 „Updates & Hilfe" (statt „Projekt speichern"), K8
„Schlussworte / Positive Aspekte". Plan war Skelett, Drehbuch ergab
sich beim Drehen. Manifest in `Tutorial.tsx` reflektiert die finale
Reihenfolge.

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
| `src/components/PlanMessDemo.tsx` | **Interaktives Hero-Aufmass-Tool** (Welle 3): Haus-Grundriss als Vorlage, Eckpunkte abklicken → Fläche → Aufmassblatt. Ersetzt `PolygonDemo` (gelöscht) |
| `src/components/animations/planSvg.tsx` | Geometrie der Aufmass-Demo (`MEASURE_POLYGON`, `AREA_M2`, `TEILFLAECHEN`, `polyPathD`) — nur Flächen, kein €/Beitrag |
| `src/components/animations/AufmassProtokoll.tsx` | Aufmassblatt-Karte (Teilflächen + Gesamtfläche in m²), erscheint nach Abschluss |
| `src/lib/easing.ts` | Geteilte Easing-Helfer (`easeOutCubic`, `clamp01`, `lerp`) für `useCountUp` + Demo |
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

### Verhältnis zum Prüf-Gate des Hauptordners

- `website/src/content/` ist Änderungsklasse **Bagatelle** (kein Review, kein Gate); die übrigen Website-Dateien haben keinen zugeordneten Prüf-Agent (Quelle: `../.claude/hooks/pruef_mapping.py`).
- Wird aus einer Session im Hauptordner committet/gepusht, läuft trotzdem `../.claude/hooks/fk_pruef_gate.py` (PreToolUse) — es blockt nur, wenn seit dem letzten Marker Pfade mit Prüf-Agent editiert wurden.
- Vor `git push`: `py fk.py done` im Hauptordner (Lint, Source↔Live, offene Prüfungen). Regeln: `../CLAUDE.md`, Abschnitte „Prüf-Pflicht“ und „Änderungs-Klassen“.

## Cloudflare-MCP

Es gibt einen Cloudflare-MCP-Server der R2-Verwaltung kann
(MCP-ID `401059e7-e63d-4465-a0b2-295dc67797a7`). Hat:
- `accounts_list`, `set_active_account`
- `r2_buckets_list`, `r2_bucket_create`, `r2_bucket_get`, `r2_bucket_delete`
- KEINE Custom-Domain- oder CORS-Endpoints → das muss Dashboard
- KEINE Object-Upload-Endpoints → das muss Dashboard oder `wrangler r2 object put`

## Offene Punkte / Roadmap

Der frühere Statusdump (Roadmap-Kopf + PR-Historie bis 2026-05-17) ist am 20.08.2026 nach `memory\project_website_status_verlauf.md` ausgelagert (Kern-Schicht-Diät, Welle 2 des Anweisungs-Audits) — reine Textmigration, kein Wissensverlust, nur seltener geladen.

## Bei nächster Session-Aufnahme

1. `git log --oneline -10` für letzten Stand
2. `npm run typecheck` als Smoke
3. Diese CLAUDE.md lesen
4. Live-Seite https://flaechenklar.de checken
5. Mit User klären was als nächstes — wahrscheinlich Walkthrough-Produktion
   oder ein anderer Marketing-Block

## Lokale Pfade

- Repo-Wurzel: `F:\Geschaeft\Unternehmen\Claude Code\FlaechenKlar\website\`
- Tool-Schwester-Repo: `F:\Geschaeft\Unternehmen\Claude Code\FlaechenKlar\tool\`
  (eigene CLAUDE.md dort)
- Implementation-Plan: `docs/superpowers/plans/2026-05-15-vorstellungsvideos.md`

## GitHub

- Repo: https://github.com/Drakman07/website-flaechenklar (private)
- Letzter Merge: PR #11 (interaktives Hero-Aufmass-Tool, Scroll-Sequenz entfernt) → Merge-Commit `8ef72ae`
- Davor: PR #10 (Welle-3 Wow-Upgrade: Hero-Choreografie + Scroll-Scrub-Sequenz + Feinschliff) → `2ebba51`
- Auto-Deploy nach beiden Merges grün (GitHub Actions → Cloudflare)
- Selbst-Merge via `gh pr merge` lief in dieser Session durch (nicht mehr blockiert); Merge dennoch nur auf ausdrückliche Freigabe

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
