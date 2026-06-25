import { Fragment, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { PlanMessDemo } from "@/components/PlanMessDemo";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import {
  BTN_PRIMARY,
  BTN_SECONDARY_ON_DARK,
  ICON_SIZE,
} from "@/components/ui/tokens";

/** Liefert die Scroll-Position des Fensters, throttled auf rAF. */
function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    let queued = false;
    const update = () => {
      setY(window.scrollY);
      queued = false;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

export function Hero() {
  const scrollY = useScrollY();

  // Zahlen zaehlen nach der Headline hoch (gestaffelt); die Mini-Viz laeuft mit.
  const [ref100, n100] = useCountUp<HTMLDivElement>(100, { startDelayMs: 1400 });
  const [ref0, n0] = useCountUp<HTMLDivElement>(0, { startDelayMs: 1550 });
  const [ref1, n1] = useCountUp<HTMLDivElement>(1, { startDelayMs: 1700 });
  // Fraktionaler Begleitwert fuer den wachsenden Balken (Text bleibt ganzzahlig).
  const [refBar, barFill] = useCountUp<SVGSVGElement>(1, {
    decimals: 2,
    startDelayMs: 1700,
  });
  // Sparkline zeichnet sich, sobald sie sichtbar wird.
  const [sparkRef, sparkIn] = useInView<SVGSVGElement>(0.5);

  // Parallax: BlueprintGrid bewegt sich ~30% langsamer als der Content.
  // Positiver translateY = Grid scrollt mit, aber weniger -> Tiefe-Effekt.
  const parallaxStyle = {
    transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
  };

  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid style={parallaxStyle} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <div className="fade-rise inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Von Praktikern für Praktiker entwickelt
          </div>
          <h1 className="mt-6 text-display">
            <HeroHeadline />
          </h1>
          <p
            className="fade-rise mt-6 max-w-2xl text-lead text-white/70"
            style={{ animationDelay: "480ms" }}
          >
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div
            className="fade-rise mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "620ms" }}
          >
            <a href="#kontakt" className={`group ${BTN_PRIMARY}`}>
              Kostenlose Demo anfragen
              <ArrowRight
                size={ICON_SIZE.inline}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
            <a href="#funktionen" className={BTN_SECONDARY_ON_DARK}>
              Funktionen ansehen
            </a>
          </div>

          <div className="mt-14 grid max-w-xl grid-cols-3 gap-8 text-sm">
            <div className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0">
              {/* 100 % offline -> Fortschrittsring, fuellt sich mit dem Zaehler */}
              <svg viewBox="0 0 36 36" className="h-8 w-8" aria-hidden="true">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.15"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="hsl(var(--teal))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 - n100}
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div
                ref={ref100}
                className="mt-2 text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n100} <span className="text-xl md:text-2xl">%</span>
              </div>
              <div className="mt-1 text-white/70">offline</div>
            </div>
            <div className="border-l border-white/15 pl-4">
              {/* 0 Cloud-Calls -> flache Linie auf der Nulllinie (nichts passiert) */}
              <svg
                ref={sparkRef}
                viewBox="0 0 56 20"
                className="h-8 w-14"
                aria-hidden="true"
              >
                <line
                  x1="2"
                  y1="16"
                  x2="54"
                  y2="16"
                  stroke="white"
                  strokeOpacity="0.12"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M2 16 L54 16"
                  className="self-draw-path"
                  fill="none"
                  stroke="hsl(var(--teal))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={sparkIn ? 0 : 1}
                />
                <circle
                  cx="54"
                  cy="16"
                  r="2.5"
                  fill="none"
                  stroke="hsl(var(--teal))"
                  strokeWidth="1.5"
                />
              </svg>
              <div
                ref={ref0}
                className="mt-2 text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n0}
              </div>
              <div className="mt-1 text-white/70">Cloud-Calls</div>
            </div>
            <div className="border-l border-white/15 pl-4">
              {/* 1 Doppelklick -> ein Balken waechst auf volle Hoehe */}
              <svg
                ref={refBar}
                viewBox="0 0 24 24"
                className="h-8 w-6"
                aria-hidden="true"
              >
                <rect
                  x="9"
                  y="3"
                  width="6"
                  height="18"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.12"
                />
                <rect
                  x="9"
                  width="6"
                  rx="1.5"
                  fill="hsl(var(--teal))"
                  height={18 * barFill}
                  y={21 - 18 * barFill}
                />
              </svg>
              <div
                ref={ref1}
                className="mt-2 text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n1}
              </div>
              <div className="mt-1 text-white/70">Doppelklick</div>
            </div>
          </div>
        </div>

        <div className="relative flex items-start justify-center">
          <PlanMessDemo />
        </div>
      </div>
    </section>
  );
}

/**
 * Hero-Headline mit Wort-Stagger-Effekt — jedes Wort fadet einzeln rein
 * (60-70ms Stagger, ~600ms total). Das letzte Wort bekommt zusaetzlich
 * TealUnderline.
 */
const HEADLINE_WORDS = ["Das", "Lineal", "bleibt", "in", "der"] as const;
const WORD_STAGGER_MS = 70;

function HeroHeadline() {
  return (
    <>
      {HEADLINE_WORDS.map((word, i) => (
        <Fragment key={i}>
          <span
            className="stagger-word"
            style={{ animationDelay: `${i * WORD_STAGGER_MS}ms` }}
          >
            {word}
          </span>{" "}
        </Fragment>
      ))}
      <span
        className="stagger-word"
        style={{
          animationDelay: `${HEADLINE_WORDS.length * WORD_STAGGER_MS}ms`,
        }}
      >
        <TealUnderline>Schublade</TealUnderline>
      </span>
    </>
  );
}
