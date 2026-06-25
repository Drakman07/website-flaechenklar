import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { useInView } from "@/hooks/useInView";
import { polygonArea, svgAreaToM2, SVG_TO_METER } from "@/lib/polygonArea";
import {
  AREA_M2,
  MEASURE_POLYGON,
  TEILFLAECHEN,
  VB_H,
  VB_W,
  polyPathD,
} from "@/components/animations/planSvg";
import { AufmassProtokoll } from "@/components/animations/AufmassProtokoll";

const N = MEASURE_POLYGON.length;
const BREITE_M = (360 - 120) * SVG_TO_METER; // 12,00 m
const HOEHE_M = (300 - 110) * SVG_TO_METER; // 9,50 m

function de2(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Interaktive Aufmass-Demo fuer den Hero: ein Haus-Grundriss ist als Vorlage
 * vorgegeben; der Nutzer klickt die Eckpunkte der Reihe nach ab, das
 * Messpolygon zeichnet sich, die Flaeche wird berechnet und ein Aufmassblatt
 * entsteht. Zeigt nur Flaechen (m²) — keine Beitrags-/Satzungsrechnung.
 */
export function PlanMessDemo() {
  const [hostRef, inView] = useInView<HTMLDivElement>(0.3);
  const [placed, setPlaced] = useState(0);
  const [closed, setClosed] = useState(false);
  const startedRef = useRef(false);

  // Reduced-Motion: fertiges Ergebnis sofort zeigen (kein manuelles Klicken noetig).
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    if (reducedMotion()) {
      setPlaced(N);
      setClosed(true);
    }
  }, [inView]);

  function placeCorner(i: number) {
    if (closed || i !== placed) return; // nur der naechste Eckpunkt zaehlt
    const next = placed + 1;
    setPlaced(next);
    if (next === N) setClosed(true); // alle Ecken gesetzt -> schliessen
  }

  function reset() {
    setPlaced(0);
    setClosed(false);
  }

  const placedPts = MEASURE_POLYGON.slice(0, placed);
  const drawnPath = polyPathD(placedPts, closed);
  const area = closed ? AREA_M2 : svgAreaToM2(polygonArea(placedPts));
  const started = placed > 0;
  const pulse = !closed && !reducedMotion();

  return (
    <div className="w-full max-w-[520px]">
      <div
        ref={hostRef}
        className="relative aspect-[520/380] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-feature"
      >
        <BlueprintGrid className="rounded-2xl" />

        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Interaktive Aufmass-Demo: die Eckpunkte des Grundrisses der Reihe nach anklicken, um die Flaeche zu berechnen."
        >
          {/* Haus-Grundriss als Vorlage */}
          <path
            d={polyPathD(MEASURE_POLYGON, true)}
            fill="none"
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            pointerEvents="none"
          />

          {/* gezeichnetes Messpolygon */}
          {drawnPath && (
            <path
              d={drawnPath}
              fill={closed ? "hsl(var(--teal) / 0.12)" : "transparent"}
              stroke="hsl(var(--teal))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
              style={{ transition: "fill 400ms ease-out" }}
            />
          )}

          {/* Massketten nach Abschluss */}
          {closed && (
            <g className="fade-rise" pointerEvents="none">
              <path d="M120 332 L360 332" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <line x1="120" y1="326" x2="120" y2="338" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <line x1="360" y1="326" x2="360" y2="338" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <rect x="216" y="322" width="48" height="16" rx="3" fill="hsl(var(--navy))" />
              <text x="240" y="334" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="11">
                {de2(BREITE_M)} m
              </text>
              <path d="M92 110 L92 300" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <line x1="86" y1="110" x2="98" y2="110" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <line x1="86" y1="300" x2="98" y2="300" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
              <g transform="rotate(-90 92 205)">
                <rect x="68" y="197" width="48" height="16" rx="3" fill="hsl(var(--navy))" />
                <text x="92" y="209" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="11">
                  {de2(HOEHE_M)} m
                </text>
              </g>
            </g>
          )}

          {/* Klickbare Eckpunkte */}
          {MEASURE_POLYGON.map((pt, i) => {
            const isPlaced = i < placed;
            const isNext = !closed && i === placed;
            return (
              <g key={i}>
                {isNext && pulse && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="11"
                    fill="none"
                    stroke="hsl(var(--teal))"
                    strokeWidth="2"
                    className="corner-pulse"
                    pointerEvents="none"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPlaced ? 6 : 7}
                  fill={isPlaced ? "white" : "hsl(var(--navy))"}
                  stroke="hsl(var(--teal))"
                  strokeWidth="2"
                  className={!closed && i === placed ? "cursor-pointer" : "cursor-default"}
                  style={{ pointerEvents: closed ? "none" : "auto" }}
                  onClick={() => placeCorner(i)}
                />
              </g>
            );
          })}

          {/* Flaechen-Badge */}
          <g pointerEvents="none">
            <rect x="16" y="16" width="124" height="30" rx="15" fill="hsl(var(--teal) / 0.2)" />
            <text x="78" y="36" textAnchor="middle" fill="hsl(var(--teal))" fontSize="15" fontWeight="600">
              {de2(area)} m²
            </text>
          </g>
        </svg>

        {!started && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
            Eckpunkte der Reihe nach anklicken
          </div>
        )}
        {started && (
          <button
            type="button"
            onClick={reset}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <RotateCcw size={12} /> Neu
          </button>
        )}
      </div>

      {/* Aufmassblatt erscheint nach Abschluss */}
      {closed && (
        <div className="fade-rise mt-4">
          <AufmassProtokoll teilflaechen={TEILFLAECHEN} gesamt={AREA_M2} />
        </div>
      )}
    </div>
  );
}
