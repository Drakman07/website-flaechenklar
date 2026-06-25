/**
 * Geteilte Quelle fuer die "Plan -> Protokoll"-Sequenz.
 *
 * Alle drei Pfade (Scrub / Mobile / Static) rendern dieselbe Szene als reine
 * Funktion eines Fortschritts p in [0,1]. Dadurch ist der statische Endzustand
 * pixelgleich zum Ende der Animation, und es gibt nur EINE Markup-Quelle.
 *
 * Inhalt ist generisch (kein echter Plan, keine personenbezogenen Daten):
 * ein L-foermiger Gebaeudegrundriss, der vom Messpolygon nachgezeichnet wird,
 * Flaeche in m², zwei Massketten und ein Aufmassprotokoll. Es werden NUR
 * Flaechen gezeigt — keine Beitrags-, Satzungs- oder Geldberechnung.
 */
import { clamp01, easeOutCubic, lerp } from "@/lib/easing";
import {
  polygonArea,
  svgAreaToM2,
  SVG_TO_METER,
  type Point,
} from "@/lib/polygonArea";
import { AufmassProtokoll } from "@/components/animations/AufmassProtokoll";

export const VB_W = 520;
export const VB_H = 380;

/** L-foermiger Grundriss (gleiche Topologie wie die PolygonDemo). */
export const MEASURE_POLYGON: readonly Point[] = [
  { x: 120, y: 110 },
  { x: 360, y: 110 },
  { x: 360, y: 240 },
  { x: 270, y: 240 },
  { x: 270, y: 300 },
  { x: 120, y: 300 },
];

/** Gesamtflaeche des Polygons in m² (aus der Geometrie abgeleitet). */
export const AREA_M2 = svgAreaToM2(polygonArea(MEASURE_POLYGON));

/** Zerlegung in zwei Rechtecke (Summe = AREA_M2), fuer das Protokoll. */
export const TEILFLAECHEN = [
  // oberes Rechteck: 240 x 130 svg
  { label: "Teilfläche A", m2: svgAreaToM2(240 * 130) },
  // unteres Rechteck: 150 x 60 svg
  { label: "Teilfläche B", m2: svgAreaToM2(150 * 60) },
] as const;

function de2(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function polyPathD(points: readonly Point[], closed: boolean): string {
  if (points.length === 0) return "";
  return (
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ") +
    (closed ? " Z" : "")
  );
}

const POLY_D = polyPathD(MEASURE_POLYGON, true);

type Scene = {
  drawProgress: number;
  closed: boolean;
  fillOpacity: number;
  areaM2: number;
  areaOpacity: number;
  masskette: number;
  protokoll: number;
  snapPulse: number;
};

/**
 * Bildet den Fortschritt p in [0,1] auf alle Beats ab.
 * Das Plan-Chrome (Blatt + Grundriss) ist immer sichtbar — so wirkt die
 * Sektion auch vor dem Pin (beim Hereinscrollen) wie ein fertiges Planblatt,
 * und das Messpolygon zeichnet sich ab dem ersten Scroll-Pixel.
 */
export function sceneFromP(p: number): Scene {
  const drawProgress = clamp01(p / 0.34);
  const closed = p >= 0.34;
  const areaBeat = clamp01((p - 0.42) / 0.2);
  const snapBeat = clamp01((p - 0.34) / 0.08);
  return {
    drawProgress,
    closed,
    fillOpacity: closed ? 0.12 * clamp01((p - 0.34) / 0.06) : 0,
    areaM2: AREA_M2 * easeOutCubic(areaBeat),
    areaOpacity: clamp01((p - 0.38) / 0.06),
    masskette: clamp01((p - 0.62) / 0.16),
    protokoll: clamp01((p - 0.78) / 0.18),
    snapPulse: Math.sin(snapBeat * Math.PI),
  };
}

/** Reines SVG der Plan-Szene als Funktion von p. */
export function PlanSvg({ p }: { p: number }) {
  const s = sceneFromP(p);
  const n = MEASURE_POLYGON.length;
  const startR = 6 + s.snapPulse * 3;

  // Massketten-Laengen aus der Geometrie (1 svg = 0,05 m).
  const breite = (360 - 120) * SVG_TO_METER; // 12,00 m
  const hoehe = (300 - 110) * SVG_TO_METER; // 9,50 m

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      role="img"
      aria-label="Stilisierter Bauplan: ein L-foermiger Grundriss wird vom Messpolygon nachgezeichnet, die Flaeche in Quadratmetern berechnet und in einem Aufmassprotokoll zusammengefasst."
    >
      {/* Plan-Chrome (Blatt, Grundriss, Nordpfeil, Massstab) — immer sichtbar */}
      <g>
        <rect
          x="8"
          y="8"
          width={VB_W - 16}
          height={VB_H - 16}
          rx="12"
          fill="none"
          stroke="white"
          strokeOpacity="0.12"
        />
        {/* Gebaeude-Grundriss (das, was gemessen wird) */}
        <path
          d={POLY_D}
          fill="none"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        {/* Nordpfeil */}
        <g stroke="white" strokeOpacity="0.45" fill="white" fillOpacity="0.45">
          <path d="M470 30 L466 42 L470 38 L474 42 Z" />
        </g>
        <text
          x="470"
          y="58"
          textAnchor="middle"
          fill="white"
          fillOpacity="0.45"
          fontSize="11"
        >
          N
        </text>
        {/* Massstab */}
        <g stroke="white" strokeOpacity="0.4">
          <line x1="380" y1="356" x2="460" y2="356" strokeWidth="1.5" />
          <line x1="380" y1="352" x2="380" y2="360" strokeWidth="1.5" />
          <line x1="420" y1="353" x2="420" y2="359" strokeWidth="1" />
          <line x1="460" y1="352" x2="460" y2="360" strokeWidth="1.5" />
        </g>
        <text
          x="420"
          y="372"
          textAnchor="middle"
          fill="white"
          fillOpacity="0.4"
          fontSize="10"
        >
          1:100
        </text>
      </g>

      {/* Massketten — Beat 5 */}
      <g style={{ opacity: s.masskette }}>
        {/* horizontal (Breite) */}
        <path
          d="M120 332 L360 332"
          className="self-draw-path"
          fill="none"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - s.masskette}
        />
        <line x1="120" y1="326" x2="120" y2="338" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
        <line x1="360" y1="326" x2="360" y2="338" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
        <rect x="216" y="322" width="48" height="16" rx="3" fill="hsl(var(--navy))" />
        <text x="240" y="334" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="11">
          {de2(breite)} m
        </text>
        {/* vertikal (Hoehe) */}
        <path
          d="M92 110 L92 300"
          className="self-draw-path"
          fill="none"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - s.masskette}
        />
        <line x1="86" y1="110" x2="98" y2="110" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
        <line x1="86" y1="300" x2="98" y2="300" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
        <g transform="rotate(-90 92 205)">
          <rect x="68" y="197" width="48" height="16" rx="3" fill="hsl(var(--navy))" />
          <text x="92" y="209" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="11">
            {de2(hoehe)} m
          </text>
        </g>
      </g>

      {/* Messpolygon — Beat 2/3 */}
      <path
        d={POLY_D}
        fill="hsl(var(--teal))"
        fillOpacity={s.fillOpacity}
        stroke="hsl(var(--teal))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - s.drawProgress}
      />
      {/* Vertices erscheinen, waehrend gezeichnet wird */}
      {MEASURE_POLYGON.map((pt, i) => {
        const shown = s.drawProgress >= i / n;
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={i === 0 ? startR : 5}
            fill="white"
            stroke="hsl(var(--teal))"
            strokeWidth="2"
            style={{ opacity: shown ? 1 : 0 }}
          />
        );
      })}

      {/* Flaechen-Badge — Beat 4 */}
      <g style={{ opacity: s.areaOpacity }}>
        <rect x="18" y="18" width="118" height="30" rx="15" fill="hsl(var(--teal) / 0.2)" />
        <text x="77" y="38" textAnchor="middle" fill="hsl(var(--teal))" fontSize="15" fontWeight="600">
          {de2(s.areaM2)} m²
        </text>
      </g>
    </svg>
  );
}

/**
 * Vollstaendige Buehne: Plan-SVG + Aufmassprotokoll-Karte, die am Ende
 * hereingleitet. Wird von allen drei Pfaden genutzt; p steuert alles.
 */
export function PlanStage({ p }: { p: number }) {
  const s = sceneFromP(p);
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-feature">
        <div className="grid-blueprint-dark absolute inset-0 rounded-2xl" aria-hidden="true" />
        <div className="relative aspect-[520/380]">
          <PlanSvg p={p} />
        </div>
      </div>
      <div
        style={{
          opacity: s.protokoll,
          transform: `translateX(${lerp(24, 0, s.protokoll)}px)`,
        }}
        className="motion-reduce:!translate-x-0 motion-reduce:!opacity-100"
      >
        <AufmassProtokoll teilflaechen={TEILFLAECHEN} gesamt={AREA_M2} />
      </div>
    </div>
  );
}
