# Animationen & Polygon-Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dezente Scroll-Animationen + interaktive Polygon-Mini-Demo im Hero einbauen, ohne neue Library-Abhängigkeiten und mit voller `prefers-reduced-motion`-Unterstützung.

**Architecture:** Eigener `useInView`-Hook (IntersectionObserver, einmaliges Trigger) als Basis. `Reveal`-Wrapper für Sektionen, `useCountUp` für Hero-Zahlen. Polygon-Demo als eigenständige Komponente — pure-function-Math (`polygonArea`) + SVG-Rendering + lokaler State. Animationen via CSS-Transitions/Keyframes; keine Animations-Library.

**Tech Stack:** React 19 + TypeScript strict, Tailwind 3, Vite 5, native `IntersectionObserver` + `requestAnimationFrame`. Kein Test-Framework im Projekt → Verifikation pro Task per `npm run typecheck`, `npm run build` und manuellem Browser-Check (`npm run dev`).

**Spec / Design Source:** `C:\Users\Alexander\.claude\plans\c-users-alexander-downloads-datenschutz-wondrous-puppy.md`

**Working Directory:** `F:\Geschäft\Unternehmen\Claude Code\Website FlächenKlar`

---

## File Map

**Neu:**
- `src/hooks/useInView.ts` — IntersectionObserver-Hook, fired-once
- `src/hooks/useCountUp.ts` — rAF-basierter Counter mit ease-out, In-View-getriggert
- `src/components/Reveal.tsx` — Wrapper, fadet Kinder beim Eintreten ein
- `src/components/PolygonDemo.tsx` — Hero-Centerpiece (Auto-Demo + User-Modus + Reset)
- `src/lib/polygonArea.ts` — Shoelace-Formel + Einheiten-Konversion

**Geändert:**
- `src/index.css` — `grid-drift` keyframe, `.teal-underline` scaleX-Logik, `.is-drawn`-Klasse, `motion-reduce`-Fallbacks
- `src/components/TealUnderline.tsx` — `useInView` + Klassen-Toggle
- `src/sections/Hero.tsx` — Icon-Box rechts durch `<PolygonDemo />` ersetzen, Stats mit `useCountUp`, CTA-Pfeil mit `group-hover:translate-x-1`
- `src/sections/ProblemChance.tsx` — `<Reveal>` für beide Spalten
- `src/sections/Funktionen.tsx` — `<Reveal>` mit Stagger-Delay, Hover-Stripe + Lift auf Kacheln
- `src/sections/Vollgeschoss.tsx` — `<Reveal>` für Bullets und Beispiel-Karte
- `src/sections/Sicherheit.tsx` — `<Reveal>` mit Stagger-Delay, Hover-Stripe + Lift
- `src/sections/DemoBanner.tsx` — `<Reveal>` für Headline + Drei-Karten-Stagger
- `src/sections/Preise.tsx` — `<Reveal>` für Tabelle + Karten, Hover-Lift auf Pilot-Box
- `src/sections/Kontakt.tsx` — `<Reveal>` für Formular

---

## Verifikations-Konventionen

Da kein Test-Framework installiert ist, ersetzt folgendes Trio die TDD-Schleife pro Task:

1. **Typecheck:** `npm run typecheck` → erwartet `Done` (oder leere Ausgabe, exit 0)
2. **Build:** `npm run build` → erwartet kompletter Vite-Build ohne Errors, Bundle in `dist/`
3. **Browser-Check:** `npm run dev` → manuell verifizieren laut "Manual Check" pro Task

Sobald **alle drei** grün sind: commit.

---

## Task 1: `useInView`-Hook

**Files:**
- Create: `src/hooks/useInView.ts`

- [ ] **Step 1: Datei anlegen**

`src/hooks/useInView.ts`:
```ts
import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLDivElement>(
  threshold = 0.2,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, inView]);

  return [ref, inView] as const;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0, keine Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useInView.ts
git commit -m "feat(hooks): add useInView for fire-once IntersectionObserver triggers"
```

---

## Task 2: `Reveal`-Wrapper-Komponente

**Files:**
- Create: `src/components/Reveal.tsx`

- [ ] **Step 1: Datei anlegen**

`src/components/Reveal.tsx`:
```tsx
import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className = "" }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Reveal.tsx
git commit -m "feat(components): add Reveal wrapper for on-scroll fade-up"
```

---

## Task 3: `useCountUp`-Hook

**Files:**
- Create: `src/hooks/useCountUp.ts`

- [ ] **Step 1: Datei anlegen**

`src/hooks/useCountUp.ts`:
```ts
import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useCountUp<T extends Element = HTMLElement>(
  target: number,
  durationMs = 800,
) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setValue(target);
      return;
    }

    let raf = 0;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        setValue(target * easeOutCubic(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    obs.observe(node);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return [ref, Math.round(value)] as const;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCountUp.ts
git commit -m "feat(hooks): add useCountUp with rAF easing and reduced-motion fallback"
```

---

## Task 4: BlueprintGrid-Drift + reduced-motion in `index.css`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Keyframe + Animation auf `.grid-blueprint-dark` ergänzen**

`src/index.css` — innerhalb von `@layer components`, ersetze den `.grid-blueprint-dark`-Block:
```css
  .grid-blueprint-dark {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    animation: grid-drift 60s linear infinite;
  }
  @keyframes grid-drift {
    from { background-position: 0 0; }
    to   { background-position: 32px 32px; }
  }
```

- [ ] **Step 2: Globale `motion-reduce`-Regel ans Datei-Ende anhängen (außerhalb aller `@layer`-Blöcke)**

`src/index.css` — am Datei-Ende:
```css
@media (prefers-reduced-motion: reduce) {
  .grid-blueprint-dark { animation: none; }
}
```

- [ ] **Step 3: Manual Check**

Run: `npm run dev`
- Hero im Browser öffnen → BlueprintGrid driftet langsam diagonal (1 Periode = 60 s, kaum wahrnehmbar)
- DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" aktivieren → Drift stoppt sofort

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat(css): add subtle 60s drift animation to BlueprintGrid"
```

---

## Task 5: TealUnderline Draw-in

**Files:**
- Modify: `src/components/TealUnderline.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: TealUnderline mit useInView verdrahten**

Ersetze den kompletten Inhalt von `src/components/TealUnderline.tsx`:
```tsx
import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

export function TealUnderline({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6);
  return (
    <span
      ref={ref}
      className={`teal-underline ${inView ? "is-drawn" : ""}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: CSS für draw-in ergänzen**

`src/index.css` — innerhalb von `@layer components`, ersetze den `.teal-underline::after`-Block durch:
```css
  .teal-underline {
    @apply relative inline-block;
  }
  .teal-underline::after {
    content: "";
    @apply absolute left-0 right-0 -bottom-1.5 h-1 bg-teal rounded-sm;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 300ms;
  }
  .teal-underline.is-drawn::after {
    transform: scaleX(1);
  }
```

- [ ] **Step 3: reduced-motion-Fallback ergänzen**

`src/index.css` — innerhalb des bestehenden `@media (prefers-reduced-motion: reduce)`-Blocks am Datei-Ende:
```css
@media (prefers-reduced-motion: reduce) {
  .grid-blueprint-dark { animation: none; }
  .teal-underline::after {
    transform: scaleX(1);
    transition: none;
  }
}
```

- [ ] **Step 4: Typecheck + Manual Check**

Run: `npm run typecheck`
Expected: exit 0.

Run: `npm run dev` → Hero im Browser:
- Beim ersten Scroll auf das Wort „Schublade" zeichnet sich die teal Underline horizontal von links nach rechts in ~700 ms ein
- Reload → reduced-motion an → Underline sofort voll sichtbar, kein Animation

- [ ] **Step 5: Commit**

```bash
git add src/components/TealUnderline.tsx src/index.css
git commit -m "feat(underline): animate teal underline draw-in on first view"
```

---

## Task 6: Hero — useCountUp auf Stats + CTA-Pfeil-Nudge

**Files:**
- Modify: `src/sections/Hero.tsx`

- [ ] **Step 1: Imports + Hooks-Aufrufe einbauen**

`src/sections/Hero.tsx` — ersetze den kompletten Datei-Inhalt (außer Polygon-Demo, die kommt in Task 10) durch:
```tsx
import { ArrowRight } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { useCountUp } from "@/hooks/useCountUp";
import iconUrl from "@/assets/logo-icon.svg";

export function Hero() {
  const [ref100, n100] = useCountUp<HTMLElement>(100);
  const [ref0, n0] = useCountUp<HTMLElement>(0);
  const [ref1, n1] = useCountUp<HTMLElement>(1);

  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Von Praktikern für Praktiker entwickelt
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
            Das Lineal bleibt in der{" "}
            <TealUnderline>Schublade</TealUnderline>.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2 rounded bg-teal px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Kostenlose Demo anfragen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
            <a
              href="#funktionen"
              className="rounded border border-white/25 px-5 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Funktionen ansehen
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-8 text-sm">
            <div>
              <dt
                ref={ref100}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n100} <span className="text-xl md:text-2xl">%</span>
              </dt>
              <dd className="mt-1 text-white/70">offline</dd>
            </div>
            <div>
              <dt
                ref={ref0}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n0}
              </dt>
              <dd className="mt-1 text-white/70">Cloud-Calls</dd>
            </div>
            <div>
              <dt
                ref={ref1}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n1}
              </dt>
              <dd className="mt-1 text-white/70">Doppelklick</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative h-[420px] w-[420px] rounded-2xl border border-white/10 bg-white/[0.02]">
            <BlueprintGrid className="rounded-2xl" />
            <div className="absolute inset-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <img
                src={iconUrl}
                alt=""
                aria-hidden="true"
                className="h-40 w-40"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Hinweis: `useCountUp<HTMLElement>(0)` mit Target 0 bleibt korrekt (animiert von 0 zu 0, keine sichtbare Bewegung) und behält die identische Hook-Struktur über alle drei Stats.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Manual Check**

Run: `npm run dev` → Hero im Browser:
- Bei Page-Load zählt 100 hörbar von 0 → 100 in ~800 ms
- CTA "Kostenlose Demo anfragen" hovern → Pfeil schiebt 4 px nach rechts, ease-out
- DevTools → reduced-motion ON → Zahlen direkt 100/0/1, Pfeil bleibt statisch

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero.tsx
git commit -m "feat(hero): count-up stats + arrow nudge on CTA hover"
```

---

## Task 7: Polygon-Math-Library

**Files:**
- Create: `src/lib/polygonArea.ts`

- [ ] **Step 1: Datei anlegen**

`src/lib/polygonArea.ts`:
```ts
export type Point = { x: number; y: number };

export function polygonArea(points: readonly Point[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

export const SVG_TO_METER = 0.05;

export function svgAreaToM2(svgArea: number): number {
  return svgArea * SVG_TO_METER * SVG_TO_METER;
}

export function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

- [ ] **Step 2: Smoke-Test via tsx-Eval**

Run (PowerShell, inline):
```powershell
node -e "const m = require('./src/lib/polygonArea.ts'); console.log(m)"
```

Falls Node ESM/TS-Probleme macht: stattdessen einen kurzen Sanity-Check in der DevTools-Konsole nach dem Wiring (siehe Task 8). Kein zwingender Check hier, weil reine pure Function.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/lib/polygonArea.ts
git commit -m "feat(lib): add Shoelace polygon area math + SVG→m² conversion"
```

---

## Task 8: PolygonDemo — Phase 1 (Auto-Demo)

**Files:**
- Create: `src/components/PolygonDemo.tsx`

- [ ] **Step 1: Komponente mit Auto-Demo anlegen (User-Modus folgt in Task 9)**

`src/components/PolygonDemo.tsx`:
```tsx
import { useEffect, useRef, useState } from "react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { useInView } from "@/hooks/useInView";
import {
  polygonArea,
  svgAreaToM2,
  type Point,
} from "@/lib/polygonArea";

const SIZE = 420;

const DEMO_POLYGON: readonly Point[] = [
  { x: 110, y: 140 },
  { x: 310, y: 140 },
  { x: 310, y: 260 },
  { x: 250, y: 260 },
  { x: 250, y: 320 },
  { x: 110, y: 320 },
];

const POINT_INTERVAL_MS = 150;
const FILL_DELAY_MS = 250;
const HINT_DELAY_MS = 4000;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PolygonDemo() {
  const [hostRef, inView] = useInView<HTMLDivElement>(0.3);
  const [demoPoints, setDemoPoints] = useState<Point[]>([]);
  const [demoClosed, setDemoClosed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (reducedMotion()) {
      setDemoPoints([...DEMO_POLYGON]);
      setDemoClosed(true);
      setShowHint(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    DEMO_POLYGON.forEach((pt, i) => {
      timers.push(
        setTimeout(() => {
          setDemoPoints((prev) => [...prev, pt]);
        }, i * POINT_INTERVAL_MS),
      );
    });
    timers.push(
      setTimeout(
        () => setDemoClosed(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + FILL_DELAY_MS,
      ),
    );
    timers.push(
      setTimeout(
        () => setShowHint(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + HINT_DELAY_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const area = demoClosed
    ? svgAreaToM2(polygonArea(DEMO_POLYGON))
    : svgAreaToM2(polygonArea(demoPoints));

  const pathD =
    demoPoints.length === 0
      ? ""
      : demoPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ") +
        (demoClosed ? " Z" : "");

  return (
    <div
      ref={hostRef}
      className="relative h-[420px] w-[420px] rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <BlueprintGrid className="rounded-2xl" />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {pathD && (
          <path
            d={pathD}
            fill={demoClosed ? "hsl(var(--teal) / 0.12)" : "transparent"}
            stroke="hsl(var(--teal))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "fill 400ms ease-out" }}
          />
        )}
        {demoPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 7 : 5.5}
            fill="white"
            stroke="hsl(var(--teal))"
            strokeWidth={2}
          />
        ))}
      </svg>

      <div className="absolute left-4 top-4 rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold text-teal backdrop-blur-sm">
        {area > 0 ? `${area.toFixed(1)} m²` : "0,0 m²"}
      </div>

      <div
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm transition-opacity duration-500 ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        Jetzt selbst probieren — klicken, um zu zeichnen
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Temporäres Wiring zum Test in Hero**

Damit wir die Auto-Demo isoliert verifizieren können, ohne den finalen Hero-Umbau (kommt in Task 10) jetzt schon zu machen, **kein** Hero-Edit in diesem Task. Stattdessen:

Run: `npm run dev`

Dann in DevTools-Konsole (auf der laufenden Seite):
- Importer-Test überspringen — wir verifizieren PolygonDemo erst nach Wiring in Task 10.

Stattdessen sicherstellen:
- `npm run build` läuft durch → Komponente compiliert clean

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/PolygonDemo.tsx
git commit -m "feat(polygon): add auto-demo phase with point-by-point draw-in"
```

---

## Task 9: PolygonDemo — Phase 2 (User-Modus + Reset)

**Files:**
- Modify: `src/components/PolygonDemo.tsx`

- [ ] **Step 1: User-State, Klick-Handler und Reset-Button ergänzen**

Ersetze den kompletten Inhalt von `src/components/PolygonDemo.tsx` durch:
```tsx
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { RotateCcw } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { useInView } from "@/hooks/useInView";
import {
  distance,
  polygonArea,
  svgAreaToM2,
  type Point,
} from "@/lib/polygonArea";

const SIZE = 420;
const SNAP_PX = 12;

const DEMO_POLYGON: readonly Point[] = [
  { x: 110, y: 140 },
  { x: 310, y: 140 },
  { x: 310, y: 260 },
  { x: 250, y: 260 },
  { x: 250, y: 320 },
  { x: 110, y: 320 },
];

const POINT_INTERVAL_MS = 150;
const FILL_DELAY_MS = 250;
const HINT_DELAY_MS = 4000;

type Mode = "auto" | "user";

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PolygonDemo() {
  const [hostRef, inView] = useInView<HTMLDivElement>(0.3);
  const svgRef = useRef<SVGSVGElement>(null);

  const [mode, setMode] = useState<Mode>("auto");
  const [demoPoints, setDemoPoints] = useState<Point[]>([]);
  const [demoClosed, setDemoClosed] = useState(false);
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [userClosed, setUserClosed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (reducedMotion()) {
      setDemoPoints([...DEMO_POLYGON]);
      setDemoClosed(true);
      setShowHint(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    DEMO_POLYGON.forEach((pt, i) => {
      timers.push(
        setTimeout(() => {
          setDemoPoints((prev) => [...prev, pt]);
        }, i * POINT_INTERVAL_MS),
      );
    });
    timers.push(
      setTimeout(
        () => setDemoClosed(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + FILL_DELAY_MS,
      ),
    );
    timers.push(
      setTimeout(
        () => setShowHint(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + HINT_DELAY_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  function toSvgPoint(evt: MouseEvent): Point | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * SIZE;
    const y = ((evt.clientY - rect.top) / rect.height) * SIZE;
    return { x, y };
  }

  function handleClick(evt: MouseEvent<SVGSVGElement>) {
    const pt = toSvgPoint(evt);
    if (!pt) return;

    if (mode === "auto") {
      setMode("user");
      setUserPoints([pt]);
      setUserClosed(false);
      setShowHint(false);
      return;
    }

    if (userClosed) {
      setUserPoints([pt]);
      setUserClosed(false);
      return;
    }

    if (userPoints.length >= 3 && distance(pt, userPoints[0]) <= SNAP_PX) {
      setUserClosed(true);
      return;
    }

    setUserPoints((prev) => [...prev, pt]);
  }

  function handleDoubleClick() {
    if (mode === "user" && userPoints.length >= 3 && !userClosed) {
      setUserClosed(true);
    }
  }

  function handleReset() {
    setUserPoints([]);
    setUserClosed(false);
  }

  const showingUser = mode === "user";
  const activePoints = showingUser ? userPoints : demoPoints;
  const isClosed = showingUser ? userClosed : demoClosed;

  const pathD =
    activePoints.length === 0
      ? ""
      : activePoints
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
          .join(" ") + (isClosed ? " Z" : "");

  const area = isClosed
    ? svgAreaToM2(polygonArea(activePoints))
    : svgAreaToM2(polygonArea(activePoints));

  const cursor = showingUser ? "cursor-crosshair" : "cursor-pointer";

  return (
    <div
      ref={hostRef}
      className="relative h-[420px] w-[420px] rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <BlueprintGrid className="rounded-2xl" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`absolute inset-0 h-full w-full ${cursor}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="img"
        aria-label="Polygon-Demo: klicken um Punkte zu setzen"
      >
        {pathD && (
          <path
            d={pathD}
            fill={isClosed ? "hsl(var(--teal) / 0.12)" : "transparent"}
            stroke="hsl(var(--teal))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "fill 400ms ease-out" }}
          />
        )}
        {activePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 7 : 5.5}
            fill="white"
            stroke="hsl(var(--teal))"
            strokeWidth={2}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold text-teal backdrop-blur-sm">
        {area > 0 ? `${area.toFixed(1)} m²` : "0,0 m²"}
      </div>

      {showingUser && userPoints.length > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10"
        >
          <RotateCcw size={12} /> Zurücksetzen
        </button>
      )}

      <div
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm transition-opacity duration-500 ${
          showHint && !showingUser ? "opacity-100" : "opacity-0"
        }`}
      >
        Jetzt selbst probieren — klicken, um zu zeichnen
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/PolygonDemo.tsx
git commit -m "feat(polygon): add user draw mode with snap-close, doubleclick close, reset"
```

---

## Task 10: Hero — Icon-Box durch PolygonDemo ersetzen

**Files:**
- Modify: `src/sections/Hero.tsx`

- [ ] **Step 1: Imports anpassen, rechte Spalte ersetzen**

Ersetze den kompletten Inhalt von `src/sections/Hero.tsx` durch:
```tsx
import { ArrowRight } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { PolygonDemo } from "@/components/PolygonDemo";
import { useCountUp } from "@/hooks/useCountUp";

export function Hero() {
  const [ref100, n100] = useCountUp<HTMLElement>(100);
  const [ref0, n0] = useCountUp<HTMLElement>(0);
  const [ref1, n1] = useCountUp<HTMLElement>(1);

  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Von Praktikern für Praktiker entwickelt
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
            Das Lineal bleibt in der{" "}
            <TealUnderline>Schublade</TealUnderline>.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2 rounded bg-teal px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Kostenlose Demo anfragen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
            <a
              href="#funktionen"
              className="rounded border border-white/25 px-5 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Funktionen ansehen
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-8 text-sm">
            <div>
              <dt
                ref={ref100}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n100} <span className="text-xl md:text-2xl">%</span>
              </dt>
              <dd className="mt-1 text-white/70">offline</dd>
            </div>
            <div>
              <dt
                ref={ref0}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n0}
              </dt>
              <dd className="mt-1 text-white/70">Cloud-Calls</dd>
            </div>
            <div>
              <dt
                ref={ref1}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n1}
              </dt>
              <dd className="mt-1 text-white/70">Doppelklick</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <PolygonDemo />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + Build**

Run: `npm run typecheck`
Expected: exit 0.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Manual Check**

Run: `npm run dev` → Hero im Browser (Desktop ≥ 1024 px breite):
- Beim Page-Load: Polygon zeichnet sich Punkt für Punkt von links oben (6 Punkte über ~900 ms), schließt sich, Fläche füllt sich teal/12 %, Aufmaß-Pin oben links zeigt Wert
- Nach 4 s: „Jetzt selbst probieren"-Hinweis fadet ein unten zentriert
- Click ins Canvas: vorheriges Polygon weg, Cursor wird crosshair, erster Punkt erscheint
- 2 weitere Klicks → 3 Punkte sichtbar, noch offen
- Klick nahe dem Startpunkt (innerhalb ~12 px) → Polygon schließt
- ODER: Doppelklick irgendwo bei ≥3 Punkten → schließt
- „Zurücksetzen"-Button unten rechts erscheint sobald User-Punkte da sind, beim Klick leeren sich Punkte
- Mobile (< 1024 px, in DevTools Responsive): rechte Spalte verschwindet, kein PolygonDemo sichtbar
- DevTools → reduced-motion ON, Reload → Polygon sofort geschlossen + Fläche sofort sichtbar, kein Punkt-für-Punkt-Aufbau

- [ ] **Step 4: Commit**

```bash
git add src/sections/Hero.tsx
git commit -m "feat(hero): replace icon-box with interactive PolygonDemo"
```

---

## Task 11: Reveal-Wraps für Sektionen ohne Stagger

Wir wickeln zunächst die einfachen Sektionen ein (ein Reveal pro Spalte/Block, kein Stagger). Funktionen + Sicherheit (mit Stagger) folgen in Task 12.

**Files:**
- Modify: `src/sections/ProblemChance.tsx`
- Modify: `src/sections/Vollgeschoss.tsx`
- Modify: `src/sections/DemoBanner.tsx`
- Modify: `src/sections/Preise.tsx`
- Modify: `src/sections/Kontakt.tsx`

- [ ] **Step 1: ProblemChance einwickeln**

Ersetze den kompletten Inhalt von `src/sections/ProblemChance.tsx` durch:
```tsx
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const chancePunkte = [
  "Maße direkt aus dem digitalen Bauantrag",
  "Polygone mit automatischer Flächenberechnung",
  "Vollgeschoss nach Art. 83 Abs. 7 BayBO als Modul",
  "Druckreifes PDF-Aufmaßprotokoll auf Knopfdruck",
  "Wiederholbar, nachvollziehbar, archivierbar",
];

export function ProblemChance() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Das Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Der digitale Bauantrag ist da. Das Lineal nicht.
          </h2>
          <p className="mt-6 text-base text-ink/80 md:text-lg">
            Seit 1. Januar 2025 gehen Bauanträge nach der Bayerischen
            Bauordnung direkt beim Landratsamt ein — die Gemeinde wird digital
            beteiligt, der Vorgang landet als PDF in der Akte. Papierpläne zum
            Ausmessen mit dem Lineal gibt es nicht mehr. Die Geschossflächen
            müssen aber trotzdem ermittelt werden: für den Herstellungsbeitrag,
            für die Akte, für jede Plan-Korrektur.
          </p>
          <p className="mt-4 text-base text-ink/80 md:text-lg">
            Wer darin nur eine Last sieht, übersieht die Chance: Ein digitaler
            Bauantrag lässt sich mit dem richtigen Werkzeug schneller und
            präziser auswerten als jeder Papierplan mit dem Lineal. Kein
            Ausdrucken, kein Abgreifen, kein Abtippen — und bei Planänderungen
            einfach neu zeichnen, nicht neu anfangen.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Mit FlächenKlar
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            PDF rein, Aufmaßprotokoll raus.
          </h2>
          <ul className="mt-6 space-y-3">
            {chancePunkte.map((punkt) => (
              <li key={punkt} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-teal"
                  size={22}
                  strokeWidth={2}
                />
                <span className="text-base text-ink/80 md:text-lg">{punkt}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Vollgeschoss einwickeln**

In `src/sections/Vollgeschoss.tsx`:
- Oben ergänzen: `import { Reveal } from "@/components/Reveal";`
- Beide Top-Level-Spalten (das `<div>` mit Bullets und das `<div className="rounded-lg border ...">` mit Beispiel-Karte) jeweils in `<Reveal>...</Reveal>` wickeln. Die Beispiel-Karte bekommt `delay={120}`.

Exakte Stelle: das Grid `<div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16">` enthält genau zwei Kind-`<div>`s. Beide werden gewrappt:
```tsx
<Reveal>
  <div>...erste Spalte (Bullets)...</div>
</Reveal>
<Reveal delay={120}>
  <div className="rounded-lg border border-white/15 bg-white/5 p-6 md:p-8">
    ...zweite Spalte (Beispiel-Karte)...
  </div>
</Reveal>
```

- [ ] **Step 3: DemoBanner einwickeln**

In `src/sections/DemoBanner.tsx`:
- Oben ergänzen: `import { Reveal } from "@/components/Reveal";`
- Die Headline-Group (`<div className="max-w-2xl">...`) in `<Reveal>...</Reveal>` wickeln.
- Die Drei-Karten-Reihe (`<div className="mt-12 grid gap-4 md:grid-cols-3">`) — die `.map`-Iteration bleibt; ersetze die `<article ...>` direkt durch ein Wrap pro Karte:
```tsx
{punkte.map(({ icon: Icon, title, text }, i) => (
  <Reveal key={title} delay={i * 90}>
    <article className="rounded-lg border border-teal/20 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded bg-teal text-white">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-ink/70">{text}</p>
    </article>
  </Reveal>
))}
```

- [ ] **Step 4: Preise einwickeln**

In `src/sections/Preise.tsx`:
- Oben ergänzen: `import { Reveal } from "@/components/Reveal";`
- Die Headline-Group (`<div className="max-w-2xl">`) in `<Reveal>` wickeln.
- Die Tabellen-Hülle (`<div className="mt-10 overflow-x-auto rounded-lg border border-outline bg-white">`) in `<Reveal delay={120}>` wickeln.
- Das Karten-Grid darunter (`<div className="mt-8 grid gap-6 md:grid-cols-2">`) in `<Reveal delay={200}>` wickeln.
- Auf die Pilot-Box (`<div className="rounded-lg border border-teal/30 bg-teal/5 p-6">`) zusätzlich `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md` ergänzen.

- [ ] **Step 5: Kontakt einwickeln**

In `src/sections/Kontakt.tsx`:
- Oben ergänzen: `import { Reveal } from "@/components/Reveal";`
- Das `<form ...>`-Element in `<Reveal delay={120}>...</Reveal>` wickeln. Die Headline-Group darüber bleibt unverpackt (oder optional auch in `<Reveal>` — empfohlen: Headline-`<p>`, `<h2>` und `<p>` zusammen in `<Reveal>` wickeln, Formular `delay={120}`).

Konkret: ersetze
```tsx
<p className="text-xs font-semibold uppercase tracking-wider text-teal">Kontakt</p>
<h2 ...>Demo, Pilot oder einfach Fragen.</h2>
<p ...>Formular ausfüllen...</p>

<form onSubmit={onSubmit} className="mt-10 grid gap-4 md:grid-cols-2">
```
durch:
```tsx
<Reveal>
  <p className="text-xs font-semibold uppercase tracking-wider text-teal">Kontakt</p>
  <h2 className="mt-3 text-3xl font-bold md:text-4xl">Demo, Pilot oder einfach Fragen.</h2>
  <p className="mt-4 text-white/70 md:text-lg">
    Formular ausfüllen, abschicken — Ihr E-Mail-Programm öffnet sich mit
    der fertigen Nachricht an info@flaechenklar.de.
  </p>
</Reveal>

<Reveal delay={120}>
  <form onSubmit={onSubmit} className="mt-10 grid gap-4 md:grid-cols-2">
```
und schließe den `<Reveal>`-Wrapper nach dem schließenden `</form>`-Tag.

- [ ] **Step 6: Typecheck + Build**

Run: `npm run typecheck`
Expected: exit 0.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Manual Check**

Run: `npm run dev`:
- Scroll langsam von Hero nach unten: jede Sektion (ProblemChance, Vollgeschoss, DemoBanner, Preise, Kontakt) fadet einmalig sanft von unten ein, ~700 ms Dauer
- DemoBanner-Karten staffeln sich (0 / 90 / 180 ms Delay)
- Preise Pilot-Box hovern → leicht hebt sich an, Schatten erscheint
- Reload mit reduced-motion ON → alles sofort sichtbar, keine Transitions

- [ ] **Step 8: Commit**

```bash
git add src/sections/ProblemChance.tsx src/sections/Vollgeschoss.tsx src/sections/DemoBanner.tsx src/sections/Preise.tsx src/sections/Kontakt.tsx
git commit -m "feat(sections): add Reveal wrappers for fade-in on scroll"
```

---

## Task 12: Funktionen + Sicherheit — Stagger-Reveals + Hover-Stripe

**Files:**
- Modify: `src/sections/Funktionen.tsx`
- Modify: `src/sections/Sicherheit.tsx`

- [ ] **Step 1: Funktionen umbauen**

Ersetze den kompletten Inhalt von `src/sections/Funktionen.tsx` durch:
```tsx
import { funktionen } from "@/content/funktionen";
import { Reveal } from "@/components/Reveal";

export function Funktionen() {
  return (
    <section id="funktionen" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Funktionen
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Alles, was ein Aufmaß braucht.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Entstanden im Bauamt. Geblieben für das Bauamt.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {funktionen.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <article className="group h-full rounded-lg border border-outline border-l-2 border-l-transparent bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-l-teal hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Sicherheit umbauen**

Ersetze den kompletten Inhalt von `src/sections/Sicherheit.tsx` durch:
```tsx
import { sicherheit } from "@/content/sicherheit";
import { Reveal } from "@/components/Reveal";

export function Sicherheit() {
  return (
    <section id="sicherheit" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Sicherheit & Datenschutz
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Bauherrendaten verlassen nie den Rechner.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Kein Cloud-Service, kein Account, kein Tracking. Genau so, wie der
              Datenschutzbeauftragte es haben will.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sicherheit.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <article className="group h-full rounded-lg border border-outline border-l-2 border-l-transparent bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-l-teal hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-navy/5 text-navy transition-colors group-hover:bg-teal/15 group-hover:text-teal">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + Build**

Run: `npm run typecheck`
Expected: exit 0.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 4: Manual Check**

Run: `npm run dev`:
- Scroll zu „Funktionen" → 8 Kacheln staffeln sich (0/70/140/.../490 ms), insgesamt cascade ~560 ms
- Hover auf jede Kachel → leichter Lift, linke Border wird teal, Icon-Box wird heller teal, Schatten erscheint
- Gleiches Verhalten in Sektion „Sicherheit & Datenschutz" (6 Kacheln, Icon-Box switcht von navy zu teal)
- reduced-motion ON → alle Kacheln sofort sichtbar, Hover-Effekte funktionieren weiter (Hover ist nicht transition-betroffen, weil Tailwind `transition-all` durch `motion-reduce:transition-none` in `<Reveal>` aufgehoben wird, aber die `<article>`-Hover-Transitions bleiben — das ist gewünscht, Hover ist User-Intent, kein „eye-candy")

Hinweis: Falls reduced-motion Hover-Transitions auch killen soll, ergänze in beiden `<article>`-Klassen `motion-reduce:transition-none`. Wir lassen das bewusst weg, weil Hover-Feedback explizit gewollt ist.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Funktionen.tsx src/sections/Sicherheit.tsx
git commit -m "feat(sections): stagger reveals + hover stripe on tile cards"
```

---

## Task 13: Full Verification + Deploy

**Files:** (read-only Verifikation)

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: exit 0, keine Fehler.

- [ ] **Step 2: Production Build**

Run: `npm run build`
Expected:
- Vite-Build durchläuft
- Bundle-Wachstum gegenüber Pre-Animation-State: ≤ 8 KB JS (Reveal/Hooks/PolygonDemo)
- Keine Warnings über fehlende Imports

- [ ] **Step 3: Lokales Preview**

Run: `npm run preview`
Expected: Wrangler dev-Server startet, Seite verhält sich identisch zu `npm run dev`-Verifikation.

- [ ] **Step 4: Full Browser-Sanity am lokalen Build**

Im Browser auf der Preview-URL:
- Hero: PolygonDemo läuft, Stats zählen, TealUnderline zeichnet sich
- ProblemChance, Vollgeschoss, Sicherheit, Funktionen, DemoBanner, Preise, Kontakt: fadet einmalig je beim ersten In-View ein
- Funktionen + Sicherheit: Stagger sichtbar
- Hover-States auf allen Kacheln (Funktionen, Sicherheit, Preise Pilot-Box) funktionieren
- BlueprintGrid in Hero/Vollgeschoss/Kontakt driftet langsam
- Polygon-User-Modus: 3 Punkte → Snap auf Start schließt; 3 Punkte → Doppelklick schließt; Reset leert; mehrfaches Resetten möglich
- Mobile (DevTools < 1024 px): PolygonDemo unsichtbar, restliche Reveals funktionieren

- [ ] **Step 5: Reduced-Motion-Sanity**

DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" → Reload:
- Keine Fades, kein Stagger
- Hero-Zahlen direkt 100/0/1
- Polygon sofort geschlossen + Fläche sichtbar (Auto-Demo skipped)
- TealUnderline statisch
- BlueprintGrid statisch
- Polygon-User-Modus weiterhin klick-funktional

- [ ] **Step 6: Push & Auto-Deploy**

```bash
git push origin main
```

GitHub Actions sollte "Deploy to Cloudflare Workers"-Workflow starten und nach ~1 Min grün sein.

Run zur Verifikation:
```bash
gh run list --branch main --limit 1
```
Expected: status=completed, conclusion=success.

- [ ] **Step 7: Live-Smoke-Test**

Öffne https://flaechenklar-website.geitner97.workers.dev und prüfe Hero-Polygon-Demo + Scroll-Reveals identisch zur lokalen Verifikation.

- [ ] **Step 8: Lighthouse-Quickcheck**

Chrome DevTools → Lighthouse → Performance auf Live-URL (Desktop):
Expected: Performance ≥ 90 (Reveals via opacity/transform = kein CLS, Bundle-Wachstum gering)

Falls < 90: in der Konsole die größten Time-Konsumenten checken und kommunizieren — kein Auto-Fix in diesem Task.

---

## Self-Review

**1. Spec coverage:**
- Mechanik & Library-Wahl (keine Lib, IntersectionObserver, rAF, motion-reduce) → Tasks 1, 2, 3 (Hooks + Wrapper) + Tasks 4, 5 (CSS-Layer)
- Hero Polygon-Mini-Demo (Auto-Demo + User-Modus + Reset + Snap + reduced-motion) → Tasks 7, 8, 9, 10
- Subtle Polituren (Stats Count-Up, CTA-Pfeil-Nudge, Section-Reveals, Funktionen+Sicherheit-Stagger, Hover-Stripe, Pilot-Box-Lift) → Tasks 6, 11, 12
- Atmosphäre (BlueprintGrid-Drift, TealUnderline-Draw-in) → Tasks 4, 5
- Verifikation (Typecheck, Build, Browser, reduced-motion, Mobile, Live-Smoke, Lighthouse) → Task 13
- Out of Scope-Items (Vollgeschoss-Slider, Animation-Lib, Parallax, Sound) → bewusst nicht im Plan, korrekt.

Keine Lücken.

**2. Placeholder scan:**
- Kein "TBD", "TODO", "implement later"
- Kein "Add appropriate error handling" / "validation"
- Kein "Similar to Task N" — Code in Task 9 wiederholt Task 8 vollständig (richtig so)
- Alle Code-Steps mit kompletten Blöcken
- Keine Referenzen auf undefinierte Symbole

**3. Type consistency:**
- `useInView<T>(threshold?)` → konsistent in Reveal (`HTMLDivElement`), TealUnderline (`HTMLSpanElement`), PolygonDemo (`HTMLDivElement`)
- `useCountUp<T>(target, durationMs?)` → konsistent in Hero (`HTMLElement` × 3)
- `Point` Typ aus `polygonArea.ts` → konsistent in PolygonDemo
- `polygonArea(points)` / `svgAreaToM2(svgArea)` / `distance(a, b)` Signaturen → konsistent
- CSS-Klassen: `.teal-underline`, `.is-drawn`, `.grid-blueprint-dark` → identisch in CSS + JSX
- Konstanten: `SIZE=420`, `SNAP_PX=12`, `POINT_INTERVAL_MS=150`, `FILL_DELAY_MS=250`, `HINT_DELAY_MS=4000`, `DEMO_POLYGON` → einmal in Task 8 definiert, in Task 9 unverändert übernommen
- `Mode` Type-Union (`"auto" | "user"`) und State-Properties (`demoPoints`, `userPoints`, `demoClosed`, `userClosed`, `showHint`) konsistent

Plan ist konsistent und vollständig.

---

## Out of Scope (aus Spec übernommen)

- Kein interaktives Vollgeschoss-Modul mit Slidern
- Keine Animation-Library (Framer Motion, GSAP)
- Keine Auto-Scroll-Effekte (Parallax, Scroll-jacking)
- Keine Sound- oder Haptik-Effekte
- Keine Hero-Hintergrund-Video- oder WebGL-Spielerei
