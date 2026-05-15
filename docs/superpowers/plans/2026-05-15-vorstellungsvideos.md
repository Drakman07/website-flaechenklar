# Vorstellungsvideos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zwei Vorstellungsvideos (60-Sek-Teaser auf Homepage + 4-Kapitel-Walkthrough auf eigener `/tour`-Route) in die FlächenKlar-Marketing-Website integrieren.

**Architecture:** Mini-Router (~30 Zeilen, kein React Router) für `/` und `/tour`. Eine wiederverwendbare `<VideoPlayer>`-Komponente unterstützt sowohl den Single-Video-Teaser (mit Scroll-Autoplay-muted) als auch den Mehr-Kapitel-Walkthrough (mit Sidebar und Mobile-Fullscreen). Videos selbst hosten auf Cloudflare R2 mit Custom-Domain `videos.flaechenklar.de` — keine Third-Party-Cookies, keine Cookie-Banner-Pflicht.

**Tech Stack:** React 19 + TypeScript (strict) + Tailwind 3 + Vite + Cloudflare Workers + R2. Bestehende Helfer: `useInView`-Hook (IntersectionObserver) und `Reveal`-Komponente (Fade-In-Animation) sind wiederverwendbar.

**Test-Strategie:** Das Projekt hat keine Test-Infrastruktur (Vitest o.ä.). Jede Task verifiziert über `npm run typecheck` (strict TS-Gate) plus manuelle Browser-Smoke-Tests via `npm run dev`. Tests-First-Setup wäre für eine statische Marketing-Site mit 2 Routen Overengineering. Begründung steht im Spec-Doc `C:\Users\Alexander\.claude\plans\fl-chenklar-kurzzusammenfassung-immutable-liskov.md`.

**Spec-Referenz:** `C:\Users\Alexander\.claude\plans\fl-chenklar-kurzzusammenfassung-immutable-liskov.md`

**Vereinfachungen aus Code-Inspection:**
- `wrangler.toml` hat schon `not_found_handling = "single-page-application"` → kein Edit nötig
- `useInView` (`src/hooks/useInView.ts`) bietet IntersectionObserver-Wrapper → Scroll-Autoplay nutzt das
- `@/`-Path-Alias auf `src/` ist in Vite + tsconfig.app.json gesetzt

---

## File Structure

**Neue Dateien:**
| Pfad | Zweck | Umfang |
|---|---|---|
| `src/router.tsx` | `useRoute` Hook + `navigate()` Helper | ~50 Zeilen |
| `src/pages/Home.tsx` | Umzug bisheriger App.tsx-Sektionen | bestehender Code |
| `src/pages/Tour.tsx` | `/tour`-Seite mit Kapitel-Player + Bottom-CTA | ~80 Zeilen |
| `src/components/VideoPlayer.tsx` | Wiederverwendbarer HTML5-Player | ~250 Zeilen |
| `src/sections/TeaserSection.tsx` | Homepage-Block direkt nach Hero | ~50 Zeilen |

**Geänderte Dateien:**
- `src/App.tsx` — wird zu reinem Layout (`<Nav /> <Router /> <Footer />`)

**R2-Assets (separat, manueller Upload — nicht Teil dieses Plans):**
- `teaser.mp4`, `teaser.de.vtt`, `teaser-poster.webp`
- `tour-kapitel-{1..4}.mp4`, `.de.vtt`, `-poster.webp`

Für die Implementation werden Platzhalter-URLs verwendet (sample-MP4 von test-videos.co.uk). Die Production-URLs werden in Task 8 final eingesetzt.

---

## Commit-Konvention

Deutsche Commit-Messages, ASCII-only-Subject, Conventional-Commit-Prefix (`feat:`, `fix:`, `refactor:`, `chore:`). Beispiel: `feat(router): Mini-Router fuer Home und Tour`. Pro Task ein Commit am Ende.

---

## Task 1: Mini-Router

**Files:**
- Create: `src/router.tsx`

- [ ] **Step 1: Create router file**

`src/router.tsx`:

```tsx
import { useEffect, useState } from "react";

export type Route = "home" | "tour";

const TITLES: Record<Route, string> = {
  home: "FlächenKlar — Aufmaß für bayerische Bauämter",
  tour: "FlächenKlar — Komplette Tour",
};

const DESCRIPTIONS: Record<Route, string> = {
  home: "FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF laden, Polygon zeichnen, druckreifes Aufmaßprotokoll nach Art. 5 KAG Bayern. Komplett offline.",
  tour: "Komplette Tour durch FlächenKlar: 4 Kapitel à 60 Sekunden zu Schnellstart, Vollgeschossen, mehrgeschossigen Gebäuden und Export.",
};

function pathToRoute(pathname: string): Route {
  return pathname === "/tour" ? "tour" : "home";
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    pathToRoute(window.location.pathname),
  );

  useEffect(() => {
    function onPopState(): void {
      setRoute(pathToRoute(window.location.pathname));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", DESCRIPTIONS[route]);
    }
  }, [route]);

  return route;
}

export function navigate(to: string): void {
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (no errors)

- [ ] **Step 3: Commit**

```bash
git add src/router.tsx
git commit -m "feat(router): Mini-Router fuer Home und Tour"
```

---

## Task 2: App.tsx → Home.tsx Umzug + Router-Integration

**Files:**
- Create: `src/pages/Home.tsx`
- Modify: `src/App.tsx` (komplette Neuschreibung)

- [ ] **Step 1: Create Home.tsx with current App content**

`src/pages/Home.tsx`:

```tsx
import { Hero } from "@/sections/Hero";
import { ProblemChance } from "@/sections/ProblemChance";
import { Funktionen } from "@/sections/Funktionen";
import { Vollgeschoss } from "@/sections/Vollgeschoss";
import { Sicherheit } from "@/sections/Sicherheit";
import { DemoBanner } from "@/sections/DemoBanner";
import { Preise } from "@/sections/Preise";
import { FAQ } from "@/sections/FAQ";
import { Kontakt } from "@/sections/Kontakt";

export function Home() {
  return (
    <>
      <Hero />
      <ProblemChance />
      <Funktionen />
      <Vollgeschoss />
      <Sicherheit />
      <DemoBanner />
      <Preise />
      <FAQ />
      <Kontakt />
    </>
  );
}
```

- [ ] **Step 2: Rewrite App.tsx as layout shell**

`src/App.tsx`:

```tsx
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { useRoute } from "./router";

export function App() {
  const route = useRoute();
  return (
    <>
      <Nav />
      <main>{route === "home" ? <Home /> : <Home />}</main>
      <Footer />
    </>
  );
}
```

Note: `route === "tour"` rendert in dieser Task noch `<Home />`. Die echte `<Tour />`-Komponente wird in Task 7 angeschlossen. Damit bleibt der Typecheck grün und die Homepage funktioniert wie vorher.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Manuelle Smoke**

Run: `npm run dev`
Im Browser http://localhost:5173 — die Homepage sieht identisch aus wie vorher (Hero, ProblemChance, alle Sektionen).

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/App.tsx
git commit -m "refactor(app): App.tsx in Layout-Shell + Home.tsx aufgeteilt"
```

---

## Task 3: VideoPlayer-Komponente (Skeleton mit Single-Video + Captions)

**Files:**
- Create: `src/components/VideoPlayer.tsx`

- [ ] **Step 1: Create VideoPlayer with single-source rendering**

`src/components/VideoPlayer.tsx`:

```tsx
import { useRef } from "react";

export type VideoSource = {
  src: string;
  poster: string;
  captions: string;
  title: string;
};

type Props = {
  sources: VideoSource[];
  autoplay?: boolean;
  muted?: boolean;
  captionsDefaultOn?: boolean;
  className?: string;
};

export function VideoPlayer({
  sources,
  autoplay = false,
  muted = false,
  captionsDefaultOn = true,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = sources[0];

  if (!current) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-black ${className}`}>
      <video
        ref={videoRef}
        src={current.src}
        poster={current.poster}
        autoPlay={autoplay}
        muted={muted}
        controls
        playsInline
        preload="metadata"
        className="block w-full"
      >
        <track
          kind="subtitles"
          src={current.captions}
          srcLang="de"
          label="Deutsch"
          default={captionsDefaultOn}
        />
      </video>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoPlayer.tsx
git commit -m "feat(video): VideoPlayer-Skeleton mit Single-Source und Captions"
```

---

## Task 4: VideoPlayer mit Kapitel-Switching und Sidebar

**Files:**
- Modify: `src/components/VideoPlayer.tsx` (komplette Neuschreibung)

- [ ] **Step 1: Add chapter state and sidebar UI**

Ersetze den Inhalt von `src/components/VideoPlayer.tsx` mit:

```tsx
import { useEffect, useRef, useState } from "react";

export type VideoSource = {
  src: string;
  poster: string;
  captions: string;
  title: string;
};

type Props = {
  sources: VideoSource[];
  autoplay?: boolean;
  muted?: boolean;
  captionsDefaultOn?: boolean;
  className?: string;
  onChapterChange?: (index: number) => void;
};

export function VideoPlayer({
  sources,
  autoplay = false,
  muted = false,
  captionsDefaultOn = true,
  className = "",
  onChapterChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = sources[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Source-Wechsel: explizit load() um Poster neu zu rendern
    video.load();
    if (autoplay || activeIndex > 0) {
      void video.play().catch(() => {
        // Autoplay durch Browser blockiert — ignorieren, User klickt selbst
      });
    }
  }, [activeIndex, autoplay]);

  function selectChapter(index: number): void {
    if (index === activeIndex) return;
    setActiveIndex(index);
    onChapterChange?.(index);
  }

  if (!current) {
    return null;
  }

  const hasChapters = sources.length > 1;

  return (
    <div
      className={`overflow-hidden rounded-lg bg-black ${
        hasChapters ? "grid gap-0 md:grid-cols-[1fr_280px]" : ""
      } ${className}`}
    >
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={current.src}
          poster={current.poster}
          autoPlay={autoplay}
          muted={muted}
          controls
          playsInline
          preload="metadata"
          className="block w-full"
        >
          <track
            kind="subtitles"
            src={current.captions}
            srcLang="de"
            label="Deutsch"
            default={captionsDefaultOn}
          />
        </video>
      </div>

      {hasChapters && (
        <aside className="bg-navy text-white">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-teal">
            Kapitel
          </div>
          <ol className="divide-y divide-white/10">
            {sources.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => selectChapter(i)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-teal/15 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                      i === activeIndex
                        ? "bg-teal text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoPlayer.tsx
git commit -m "feat(video): Kapitel-Sidebar mit Klick-Navigation"
```

---

## Task 5: VideoPlayer mit Scroll-Autoplay-muted und „Ton an"-Overlay

**Files:**
- Modify: `src/components/VideoPlayer.tsx`

- [ ] **Step 1: Add scrollAutoplay prop and mute-overlay**

Ersetze den Inhalt von `src/components/VideoPlayer.tsx` mit:

```tsx
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export type VideoSource = {
  src: string;
  poster: string;
  captions: string;
  title: string;
};

type Props = {
  sources: VideoSource[];
  autoplay?: boolean;
  muted?: boolean;
  scrollAutoplay?: boolean;
  captionsDefaultOn?: boolean;
  className?: string;
  onChapterChange?: (index: number) => void;
};

export function VideoPlayer({
  sources,
  autoplay = false,
  muted = false,
  scrollAutoplay = false,
  captionsDefaultOn = true,
  className = "",
  onChapterChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [containerRef, inView] = useInView<HTMLDivElement>(0.5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(muted || scrollAutoplay);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const current = sources[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (autoplay || activeIndex > 0) {
      void video.play().catch(() => {
        /* Autoplay-Block: Nutzer muss klicken */
      });
    }
  }, [activeIndex, autoplay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !scrollAutoplay) return;
    if (inView && !hasUserInteracted) {
      void video.play().catch(() => {
        /* still blockiert — ignorieren */
      });
    }
  }, [inView, scrollAutoplay, hasUserInteracted]);

  function selectChapter(index: number): void {
    if (index === activeIndex) return;
    setHasUserInteracted(true);
    setActiveIndex(index);
    onChapterChange?.(index);
  }

  function toggleMute(): void {
    const video = videoRef.current;
    if (!video) return;
    setHasUserInteracted(true);
    const next = !isMuted;
    setIsMuted(next);
    video.muted = next;
    if (!next) {
      void video.play().catch(() => {
        /* ignorieren */
      });
    }
  }

  if (!current) {
    return null;
  }

  const hasChapters = sources.length > 1;
  const showMuteOverlay = scrollAutoplay && isMuted;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-lg bg-black ${
        hasChapters ? "grid gap-0 md:grid-cols-[1fr_280px]" : ""
      } ${className}`}
    >
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={current.src}
          poster={current.poster}
          autoPlay={autoplay}
          muted={isMuted}
          controls
          playsInline
          preload="metadata"
          className="block w-full"
        >
          <track
            kind="subtitles"
            src={current.captions}
            srcLang="de"
            label="Deutsch"
            default={captionsDefaultOn}
          />
        </video>
        {showMuteOverlay && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/85"
            aria-label="Ton einschalten"
          >
            <VolumeX size={14} />
            Ton an
          </button>
        )}
        {!showMuteOverlay && scrollAutoplay && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/85"
            aria-label="Ton ausschalten"
          >
            <Volume2 size={14} />
          </button>
        )}
      </div>

      {hasChapters && (
        <aside className="bg-navy text-white">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-teal">
            Kapitel
          </div>
          <ol className="divide-y divide-white/10">
            {sources.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => selectChapter(i)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-teal/15 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                      i === activeIndex
                        ? "bg-teal text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoPlayer.tsx
git commit -m "feat(video): Scroll-Autoplay-muted mit Ton-an-Overlay"
```

---

## Task 6: VideoPlayer Mobile-Tap-Fullscreen

**Files:**
- Modify: `src/components/VideoPlayer.tsx`

- [ ] **Step 1: Add fullscreen-on-tap for mobile width**

Im bestehenden `src/components/VideoPlayer.tsx`: füge **innerhalb** der `VideoPlayer`-Funktion nach `function toggleMute()` diese Funktion hinzu:

```tsx
  function handleVideoTap(): void {
    if (window.innerWidth >= 768) return; // nur Mobile
    const video = videoRef.current;
    if (!video) return;
    const target = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    if (target.requestFullscreen) {
      void target.requestFullscreen().catch(() => {
        /* Browser unterstützt nicht — ignorieren */
      });
    } else if (typeof target.webkitEnterFullscreen === "function") {
      // iOS Safari benötigt webkitEnterFullscreen auf dem Video-Element
      target.webkitEnterFullscreen();
    }
  }
```

Dann erweitere das `<video>`-Element um `onClick={handleVideoTap}`:

```tsx
        <video
          ref={videoRef}
          src={current.src}
          poster={current.poster}
          autoPlay={autoplay}
          muted={isMuted}
          controls
          playsInline
          preload="metadata"
          onClick={handleVideoTap}
          className="block w-full"
        >
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoPlayer.tsx
git commit -m "feat(video): Mobile-Tap oeffnet Vollbild"
```

---

## Task 7: TeaserSection auf Homepage

**Files:**
- Create: `src/sections/TeaserSection.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Create TeaserSection**

`src/sections/TeaserSection.tsx`:

```tsx
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";

// Platzhalter — wird in Task 8 durch echte R2-URLs ersetzt
const TEASER: VideoSource = {
  src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  poster: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
  captions: "",
  title: "FlächenKlar in 60 Sekunden",
};

export function TeaserSection() {
  function handleTourClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/tour");
  }

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              In 60 Sekunden
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Sehen Sie es selbst.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Vom Bauplan zum Aufmaßprotokoll — der komplette Workflow in einer
              Minute.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10">
            <VideoPlayer
              sources={[TEASER]}
              scrollAutoplay
              muted
              captionsDefaultOn
              className="mx-auto max-w-4xl shadow-lg"
            />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <a
              href="/tour"
              onClick={handleTourClick}
              className="group inline-flex items-center gap-2 rounded border border-teal/40 bg-teal/5 px-5 py-3 text-sm font-semibold text-teal transition-colors hover:bg-teal/10"
            >
              Komplette Tour ansehen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire TeaserSection into Home**

Modify `src/pages/Home.tsx` — füge `TeaserSection` direkt nach `Hero` ein:

```tsx
import { Hero } from "@/sections/Hero";
import { TeaserSection } from "@/sections/TeaserSection";
import { ProblemChance } from "@/sections/ProblemChance";
import { Funktionen } from "@/sections/Funktionen";
import { Vollgeschoss } from "@/sections/Vollgeschoss";
import { Sicherheit } from "@/sections/Sicherheit";
import { DemoBanner } from "@/sections/DemoBanner";
import { Preise } from "@/sections/Preise";
import { FAQ } from "@/sections/FAQ";
import { Kontakt } from "@/sections/Kontakt";

export function Home() {
  return (
    <>
      <Hero />
      <TeaserSection />
      <ProblemChance />
      <Funktionen />
      <Vollgeschoss />
      <Sicherheit />
      <DemoBanner />
      <Preise />
      <FAQ />
      <Kontakt />
    </>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Manuelle Smoke**

Run: `npm run dev`
Im Browser: Homepage zeigt nach Hero den neuen Teaser-Block. Beim Scroll-in-View startet das Sample-Video stumm. Klick auf das Lautsprecher-Icon schaltet Ton ein. Klick auf „Komplette Tour ansehen" — der Tab-Title wechselt zu „FlächenKlar — Komplette Tour" und die Adressleiste zeigt `/tour`. Browser-Zurück bringt zurück zur Homepage.

- [ ] **Step 5: Commit**

```bash
git add src/sections/TeaserSection.tsx src/pages/Home.tsx
git commit -m "feat(homepage): TeaserSection nach Hero einbauen"
```

---

## Task 8: Tour-Seite + Router-Anbindung

**Files:**
- Create: `src/pages/Tour.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Tour.tsx**

`src/pages/Tour.tsx`:

```tsx
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";

// Platzhalter — werden durch echte R2-URLs ersetzt sobald Videos produziert
const KAPITEL: VideoSource[] = [
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    captions: "",
    title: "Schnellstart — vom PDF zum Protokoll",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    captions: "",
    title: "Vollgeschosse nach KAG Bayern",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    captions: "",
    title: "Mehrere Geschosse & Maßstab",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    captions: "",
    title: "Export & Aufmaßprotokoll",
  },
];

export function Tour() {
  function handleBack(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
  }

  function handleDemoAnfragen(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
    // nach Route-Switch im nächsten Tick zum Kontakt-Anchor scrollen
    window.setTimeout(() => {
      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <a
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal/80"
          >
            <ArrowLeft size={14} />
            Zurück zur Übersicht
          </a>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Komplette Tour
            </p>
            <h1 className="mt-3 text-3xl font-bold text-navy md:text-5xl">
              FlächenKlar im Detail.
            </h1>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Vier Kapitel à 60 Sekunden. Springen Sie zum gewünschten Thema —
              jedes Kapitel ist eigenständig verständlich.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10">
            <VideoPlayer
              sources={KAPITEL}
              captionsDefaultOn
              className="shadow-lg"
            />
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-16 rounded-lg border border-teal/20 bg-teal/[0.04] px-8 py-10 text-center">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">
              Bereit für eine Demo?
            </h2>
            <p className="mt-3 text-base text-ink/70">
              14 Tage kostenlos testen, voller Funktionsumfang, ohne Account.
            </p>
            <a
              href="/#kontakt"
              onClick={handleDemoAnfragen}
              className="group mt-6 inline-flex items-center gap-2 rounded bg-teal px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Demo anfragen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire Tour into App router-switch**

Modify `src/App.tsx`:

```tsx
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Tour } from "./pages/Tour";
import { useRoute } from "./router";

export function App() {
  const route = useRoute();
  return (
    <>
      <Nav />
      <main>{route === "tour" ? <Tour /> : <Home />}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Manuelle Smoke**

Run: `npm run dev`

- Homepage → Teaser-Section → Klick „Komplette Tour ansehen" → URL wechselt zu `/tour` (kein Page-Reload, kein weißer Flash)
- Tour-Seite zeigt 4-Kapitel-Player mit Sidebar. Klick auf Kapitel 3 wechselt Video.
- Klick „Zurück zur Übersicht" → zurück zur Homepage
- Klick „Demo anfragen" auf Tour → wechselt zur Homepage und scrollt zum Kontakt-Anchor
- Browser-Tab-Title: auf Homepage „FlächenKlar — Aufmaß für bayerische Bauämter", auf /tour „FlächenKlar — Komplette Tour"
- Direkt-Aufruf von http://localhost:5173/tour lädt die Tour-Seite (Vite-Dev-Server hat SPA-Fallback auto)

- [ ] **Step 5: Production-Build verifizieren**

Run: `npm run build && npm run preview`
Im Browser: gleiche Smoke-Tests auf Wrangler-Preview (Port aus Konsole). Besonders: Direkt-Aufruf von `/tour` muss funktionieren — das beweist dass der SPA-Fallback in `wrangler.toml` greift.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Tour.tsx src/App.tsx
git commit -m "feat(tour): Tour-Seite mit Kapitel-Player und CTA"
```

---

## Task 9: README-Notiz für R2-Asset-Upload

**Files:**
- Create: `docs/video-assets.md`

- [ ] **Step 1: Document the R2-asset-upload workflow**

`docs/video-assets.md`:

```markdown
# Video-Assets (Cloudflare R2)

Die Vorstellungsvideos (Teaser + 4 Walkthrough-Kapitel) liegen in
einem R2-Bucket mit Custom-Domain.

## Bucket-Setup (einmalig)

1. R2-Bucket `flaechenklar-videos` über Cloudflare-Dashboard anlegen
2. Custom-Domain `videos.flaechenklar.de` mit dem Bucket verknüpfen
   (Cloudflare → R2 → Bucket → Settings → Custom Domains)
3. CORS-Regel hinzufügen, damit VTT-Captions vom Browser geladen werden:
   ```json
   [{
     "AllowedOrigins": ["https://flaechenklar.de", "https://www.flaechenklar.de"],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["Range"],
     "MaxAgeSeconds": 3600
   }]
   ```

## Asset-Upload pro Video

Jedes fertig produzierte Video besteht aus drei Dateien:

| Datei | Content-Type | Zweck |
|---|---|---|
| `<name>.mp4` | `video/mp4` | Das Video selbst, H.264 1080p CRF 23 |
| `<name>.de.vtt` | `text/vtt` | Deutsche Untertitel |
| `<name>-poster.webp` | `image/webp` | Standbild aus dem ersten Frame |

Upload per Wrangler:

```bash
wrangler r2 object put flaechenklar-videos/teaser.mp4 \
  --file=./produktion/teaser.mp4 \
  --content-type=video/mp4

wrangler r2 object put flaechenklar-videos/teaser.de.vtt \
  --file=./produktion/teaser.de.vtt \
  --content-type=text/vtt

wrangler r2 object put flaechenklar-videos/teaser-poster.webp \
  --file=./produktion/teaser-poster.webp \
  --content-type=image/webp
```

Cache-Control wird automatisch auf den Bucket-Default gesetzt. Falls
nicht: `--cache-control "public, max-age=31536000"` anhängen.

## Asset-Liste (final)

```
videos.flaechenklar.de/teaser.mp4
videos.flaechenklar.de/teaser.de.vtt
videos.flaechenklar.de/teaser-poster.webp
videos.flaechenklar.de/tour-kapitel-1.mp4
videos.flaechenklar.de/tour-kapitel-1.de.vtt
videos.flaechenklar.de/tour-kapitel-1-poster.webp
videos.flaechenklar.de/tour-kapitel-2.mp4
videos.flaechenklar.de/tour-kapitel-2.de.vtt
videos.flaechenklar.de/tour-kapitel-2-poster.webp
videos.flaechenklar.de/tour-kapitel-3.mp4
videos.flaechenklar.de/tour-kapitel-3.de.vtt
videos.flaechenklar.de/tour-kapitel-3-poster.webp
videos.flaechenklar.de/tour-kapitel-4.mp4
videos.flaechenklar.de/tour-kapitel-4.de.vtt
videos.flaechenklar.de/tour-kapitel-4-poster.webp
```

## Echte URLs einsetzen (nach Video-Produktion)

Sobald die Videos hochgeladen sind:
1. `src/sections/TeaserSection.tsx` — `TEASER`-Objekt mit echter URL ersetzen
2. `src/pages/Tour.tsx` — `KAPITEL`-Array (4 Einträge) mit echten URLs ersetzen
3. `npm run build && npm run deploy`
4. Smoke-Test auf Produktion: alle 5 Videos starten, Captions sichtbar,
   keine Cross-Origin-Errors in DevTools

## Asset-Erreichbarkeit prüfen

```bash
curl -I https://videos.flaechenklar.de/teaser.mp4
```

Expected: `HTTP/2 200`, `content-type: video/mp4`, `cache-control: public, max-age=31536000` (oder vom Bucket-Default).
```

- [ ] **Step 2: Commit**

```bash
git add docs/video-assets.md
git commit -m "docs: R2-Asset-Upload-Workflow fuer Videos"
```

---

## Verification (End-to-End nach allen Tasks)

**Typecheck:**
```bash
npm run typecheck
```
Erwartung: 0 Errors.

**Production-Build:**
```bash
npm run build
```
Erwartung: Build durchläuft. Bundle-Size-Zuwachs ~5-10 KB für Router + VideoPlayer (kleine Komponenten).

**Manuelle Smoke-Liste (gegen `npm run preview`):**

- [ ] Homepage `/` lädt — Nav, Hero, Teaser-Section, ProblemChance, …, Footer in dieser Reihenfolge
- [ ] Teaser-Video startet autoplay-stumm sobald Scroll-into-View
- [ ] Klick auf Lautsprecher-Icon (oben rechts im Player) schaltet Ton ein, Icon wechselt
- [ ] Klick „Komplette Tour ansehen →" navigiert zu `/tour` ohne weißen Flash
- [ ] Tour-Seite zeigt 4-Kapitel-Player mit Sidebar rechts (Desktop) bzw. unten (Mobile)
- [ ] Klick auf Kapitel 2/3/4 wechselt das Video, aktives Kapitel ist hervorgehoben
- [ ] Klick „Zurück zur Übersicht" bringt zurück zur Homepage
- [ ] Klick „Demo anfragen" auf Tour-Seite scrollt auf Homepage zum Kontakt-Block
- [ ] Browser-Back/Forward funktioniert zwischen `/` und `/tour`
- [ ] Direkt-Aufruf `http://localhost:8788/tour` (oder welcher Port wrangler nutzt) lädt Tour-Seite (SPA-Fallback)
- [ ] Tab-Title pro Seite korrekt
- [ ] Bei Bildschirm-Breite < 768 px: Kapitel-Sidebar erscheint unter dem Video, Tap auf Video → Vollbild
- [ ] DevTools-Network-Tab: keine YouTube/Google/Vimeo-Domains, keine Third-Party-Cookies

**Lighthouse:**

```bash
# Lighthouse-CLI oder Browser-DevTools
# Vorher-Score messen (vor Task 1), Nachher-Score nach Task 9
```

Erwartung: Performance/Best-Practices auf `/` und `/tour` jeweils > 90. Falls Performance fällt: Teaser-Video lazy-loaden (preload="metadata" sollte das schon machen).

---

## Out of Scope

- **R2-Bucket-Setup, Custom-Domain-Verknüpfung, CORS-Konfiguration** — manuelle Schritte über Cloudflare-Dashboard, dokumentiert in `docs/video-assets.md` aber nicht ausführbar im Plan
- **Video-Produktion** (Aufnahme, Schnitt, Voiceover) — separater User-Workflow, Plan referenziert nur das Spec-Doc
- **Echte Video-URLs einsetzen** — wird gemacht sobald erstes Video produziert ist; bis dahin laufen Platzhalter-MP4s
- **Test-Framework-Setup** (Vitest, Testing-Library) — siehe Begründung im Header
- **Picture-in-Picture, Speed-Wahl, Position-Memorize** — bewusst weggelassen (Pack C im Brainstorming verworfen)
- **Mehrsprachige Captions** — nur Deutsch in v1
- **Video-Analytics** — bewusst nicht, DSGVO-Versprechen

---

## Recommended Next Steps

1. Plan abarbeiten Task 1–9 (etwa 2-3 h für jemanden der den Stack kennt)
2. R2-Bucket einrichten via Cloudflare-Dashboard (siehe `docs/video-assets.md`)
3. Erstes Video (Teaser) produzieren — Vorlage aus dem Spec-Doc
4. Echte URLs einsetzen, deployen, in Produktion smoken
5. Walkthrough-Kapitel sukzessive nachschieben
