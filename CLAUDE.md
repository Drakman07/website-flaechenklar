# FlächenKlar-Website — Session-Memory für Claude

VTT-Untertitel fehlen beim Tutorial bewusst (die alten Kapitel-VTTs passen nicht zum v1.3-Video, das `captions`-Feld ist entfernt). Details: `docs/video-assets.md` → Abschnitt „Tutorial v1.3“.

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

## GitHub

- Repo: https://github.com/Drakman07/website-flaechenklar (private)
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
