/**
 * Laedt gsap + ScrollTrigger dynamisch und registriert das Plugin genau einmal.
 *
 * Promise-Cache: verhindert Doppel-Registrierung unter React-StrictMode
 * (Doppel-Mount) und ueber Mount/Unmount bei Navigation hinweg. gsap landet so
 * in einem eigenen Lazy-Chunk und nie im Initial-Bundle.
 */
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type GsapBundle = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

let cached: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!cached) {
    cached = (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }
  return cached;
}
