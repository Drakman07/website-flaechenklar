import { PlanStage } from "@/components/animations/planSvg";

/**
 * Statischer Endzustand der Sequenz (Plan gemessen, Protokoll sichtbar).
 * Dient als prefers-reduced-motion-Variante, als Suspense-Fallback und als
 * Platzhalter, solange der Scrub-Chunk noch nicht geladen ist — haelt damit
 * die Sektionshoehe stabil (kein CLS).
 */
export function PlanToProtokollStatic() {
  return <PlanStage p={1} />;
}
