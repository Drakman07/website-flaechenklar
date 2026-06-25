/**
 * Geteilte Easing-Funktionen.
 *
 * easeOutCubic war urspruenglich in useCountUp.ts lokal definiert; hierher
 * gehoben, damit Scroll-Scrub-Sequenz (AufmassSequence) und Counter dieselbe
 * Kurve teilen. Eingabe und Ausgabe in [0,1].
 */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Begrenzt einen Wert auf [0,1]. */
export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Lineare Interpolation zwischen a und b fuer t in [0,1]. */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;
