import { useEffect, useState } from "react";

/**
 * Welche Variante der Animation laeuft:
 * - "static": prefers-reduced-motion -> sofortiger Endzustand, kein gsap.
 * - "mobile": < 1024px -> einmaliges Auto-Play (kein Pin/Scrub), kein gsap.
 * - "full":  Desktop -> gepinnte Scroll-Scrub-Sequenz (gsap, lazy).
 */
export type MotionMode = "static" | "mobile" | "full";

const REDUCE = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 1024px)";

function compute(): MotionMode {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia(REDUCE).matches) return "static";
  if (!window.matchMedia(DESKTOP).matches) return "mobile";
  return "full";
}

export function useMotionMode(): MotionMode {
  // Synchroner Initialwert -> kein Flackern auf dem falschen Pfad.
  const [mode, setMode] = useState<MotionMode>(compute);

  useEffect(() => {
    const reduceMq = window.matchMedia(REDUCE);
    const desktopMq = window.matchMedia(DESKTOP);
    const update = () => setMode(compute());
    reduceMq.addEventListener("change", update);
    desktopMq.addEventListener("change", update);
    return () => {
      reduceMq.removeEventListener("change", update);
      desktopMq.removeEventListener("change", update);
    };
  }, []);

  return mode;
}
