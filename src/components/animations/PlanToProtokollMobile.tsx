import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { PlanStage } from "@/components/animations/planSvg";

const DURATION_MS = 2600;

/**
 * Mobile-Variante: spielt die Sequenz EINMAL ab, sobald sie ins Bild kommt —
 * kein Pin, kein Scrub. Reduced-Motion springt sofort auf den Endzustand.
 */
export function PlanToProtokollMobile() {
  const [hostRef, inView] = useInView<HTMLDivElement>(0.3);
  const [p, setP] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }

    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const lin = Math.min(1, (now - t0) / DURATION_MS);
      setP(lin);
      if (lin < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={hostRef}>
      <PlanStage p={p} />
    </div>
  );
}
