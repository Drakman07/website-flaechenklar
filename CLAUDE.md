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

- **Routing:** eigener Mini-Router (`src/router.tsx`), kein React Router; SPA-Fallback in `wrangler.toml`.
- **Tailwind-Klassen nur als Literale** (Design-Tokens in `src/components/ui/tokens.ts`). Keine dynamische Concat wie `bg-${color}-500`, sonst entfernt der Purge die Klasse.
- **Animationen** respektieren `prefers-reduced-motion`; Schatten bewusst zurückhaltend (Bauamts-Tonalität).
- Komponenten, Tokens und Animationen im Einzelnen: im Code, Stand der Anlage in `../anleitungen/website-historie.md`.

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

Asset-Namen, Status und Upload: `docs/video-assets.md`.

Upload-Workflow: Dashboard-Drag&Drop oder Wrangler CLI (`wrangler login`
nötig). Details in `docs/video-assets.md`.

## Conventions

- **Commits:** Deutsche Botschaften, ASCII-only-Subject (keine Umlaute),
  Conventional-Commit-Prefix (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
  mit Scope wie `feat(router): …`, `feat(video): …`
- **Branches:** Für größere Features eigene `feature/<name>`-Branches,
  via PR (gh CLI) + `--merge` (Merge-Commit, no-ff) nach main. Kleine
  Doku-Fixes direkt auf main commiten ist ok.
- **PR-Merge:** nur auf ausdrückliche Freigabe des Users (meist merged er selbst auf GitHub).
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

## Offene Punkte / Roadmap

Der frühere Statusdump (Roadmap-Kopf + PR-Historie bis 2026-05-17) ist am 20.08.2026 nach `memory\project_website_status_verlauf.md` ausgelagert (Kern-Schicht-Diät, Welle 2 des Anweisungs-Audits) — reine Textmigration, kein Wissensverlust, nur seltener geladen.

## GitHub

- Repo: https://github.com/Drakman07/website-flaechenklar (private)

## Erkenntnisse aus diesem Projektabschnitt

- **Cloudflare R2 ist DSGVO-mäßig die saubere Wahl** für selbst gehostete
  Videos. Kein Cookie-Banner, eigene Custom-Domain, kein Tracker,
  Egress kostenlos. Ein Bauamt-User wird das schätzen.
- **`window.setTimeout(..., 50)` für Cross-Route-Scroll** ist
  pragmatisch, hat in den Reviews einen „nice but not necessary"-Tag
  bekommen. Wenn's mal komisch wirkt, durch effect-basiertes
  scroll-on-route-change ersetzen.
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
- **Worktree-Workflow + Dubious-Ownership auf F:.** Das Repo liegt auf
  einem Laufwerk ohne Filesystem-Ownership (NTFS auf externer Platte),
  daher refused git Operations im Worktree mit „dubious ownership".
  Workaround pro Befehl: `git -c safe.directory='<path>' ...` (modifiziert
  globale Config nicht). `gh`-Befehle stolpern genauso → `--repo
  <owner>/<name>` explizit angeben, dann kann gh die Repo-Detection
  überspringen.
- **Don't merge PRs zu früh, wenn noch Folge-Commits pending sind.**
  Klassische Race-Condition zwischen Welle 2: PR #4 hatte nur den ersten
  Commit (mit Switcher), Cleanup-Commit lag noch lokal. User merged
  während Cleanup gepusht wurde — Cleanup landete nicht in main, sondern
  nur auf der toten Feature-Branch. Lehre: warten bis explizit „ist alles
  in der Branch" gesagt wird, dann erst mergen. Oder: PR-Beschreibung
  klar markieren wenn weitere Commits folgen (Draft-PR + readyForReview-
  Flag). Recovery klappte aber sauber: revert-of-revert + cherry-pick
  des verlorenen Cleanup-Commits über PR #6.

Rückblick ohne Fallstrick-Charakter (SDD, Video, Animationen, A11y-Muster, Portrait-Pipeline): `../anleitungen/website-historie.md`.
