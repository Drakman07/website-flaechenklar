import { useLayoutEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsapLoader";
import { PlanStage } from "@/components/animations/planSvg";

/**
 * Desktop-Variante: gepinnte Scroll-Scrub-Sequenz via gsap ScrollTrigger.
 * Default-Export, weil per React.lazy nachgeladen (gsap landet im Lazy-Chunk).
 *
 * Der Scroll-Fortschritt (self.progress, 0..1) steuert die Szene. gsap pinnt
 * die Buehne fuer ~1,5 Viewport-Hoehen. Cleanup via gsap.context().revert()
 * entfernt Pin-Spacer + ScrollTrigger bei Unmount/Routenwechsel.
 */
export default function PlanToProtokollScrub() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useLayoutEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !stageRef.current) return;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: stageRef.current!,
          start: "top top",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => setP(self.progress),
          onRefresh: (self) => setP(self.progress),
        });
      }, stageRef);
      // Layout/Fonts koennen die Pin-Mathematik verschieben -> einmal neu messen.
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={stageRef} className="flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-6xl px-6">
        <PlanStage p={p} />
      </div>
    </div>
  );
}
