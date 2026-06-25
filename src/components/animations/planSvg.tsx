/**
 * Geometrie der Aufmass-Demo (stilisierter L-foermiger Grundriss).
 *
 * Generisch, keine personenbezogenen Daten. Nur Flaechen (m²) — keine
 * Beitrags-, Satzungs- oder Geldberechnung. Genutzt von der interaktiven
 * Hero-Demo (PlanMessDemo).
 */
import { polygonArea, svgAreaToM2, type Point } from "@/lib/polygonArea";

export const VB_W = 520;
export const VB_H = 380;

/** L-foermiger Grundriss. */
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

/** Zerlegung in zwei Rechtecke (Summe = AREA_M2), fuer das Aufmassblatt. */
export const TEILFLAECHEN = [
  { label: "Teilfläche A", m2: svgAreaToM2(240 * 130) }, // oberes Rechteck
  { label: "Teilfläche B", m2: svgAreaToM2(150 * 60) }, // unteres Rechteck
] as const;

/** SVG-Pfad-String fuer eine Punktfolge. */
export function polyPathD(points: readonly Point[], closed: boolean): string {
  if (points.length === 0) return "";
  return (
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ") +
    (closed ? " Z" : "")
  );
}
