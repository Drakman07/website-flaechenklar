import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useMotionMode } from "@/hooks/useMotionMode";
import { PlanToProtokollStatic } from "@/components/animations/PlanToProtokollStatic";
import { PlanToProtokollMobile } from "@/components/animations/PlanToProtokollMobile";
import { H2, LABEL, LEAD_ON_DARK } from "@/components/ui/tokens";

/**
 * Kill-Switch: auf false zeigt die Sektion nur den statischen Endzustand
 * (kein gsap, kein Pin) — eine Zeile, falls der Scrub-Beat live Probleme macht.
 */
const SCRUB_ENABLED = true;

// gsap-Scrub liegt im Lazy-Chunk und wird erst bei Viewport-Naehe geladen.
const PlanToProtokollScrub = lazy(
  () => import("@/components/animations/PlanToProtokollScrub"),
);

/** Mountet, sobald das Element in die Naehe des Viewports kommt. */
function useNear<T extends Element>(rootMargin = "600px 0px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [rootMargin]);
  return [ref, near] as const;
}

export function AufmassSequence() {
  const mode = useMotionMode();
  const [nearRef, near] = useNear<HTMLDivElement>();

  function path() {
    if (mode === "full" && SCRUB_ENABLED) {
      return near ? (
        <Suspense fallback={<Centered><PlanToProtokollStatic /></Centered>}>
          <PlanToProtokollScrub />
        </Suspense>
      ) : (
        <Centered>
          <PlanToProtokollStatic />
        </Centered>
      );
    }
    return (
      <Centered>
        {mode === "mobile" && SCRUB_ENABLED ? (
          <PlanToProtokollMobile />
        ) : (
          <PlanToProtokollStatic />
        )}
      </Centered>
    );
  }

  return (
    <section id="aufmass" className="bg-navy py-section text-white">
      <div className="mx-auto max-w-6xl px-6">
        <p className={LABEL}>Vom Plan zum Protokoll</p>
        <h2 className={`mt-3 max-w-2xl ${H2}`}>In einem Zug gemessen.</h2>
        <p className={`mt-4 max-w-2xl ${LEAD_ON_DARK}`}>
          Grundriss nachzeichnen, Fläche ablesen, Aufmaßprotokoll erhalten — der
          komplette Weg in einer einzigen Bewegung.
        </p>
      </div>

      <div ref={nearRef} className="mt-rhythm-lg">
        {path()}
      </div>
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6">{children}</div>;
}
