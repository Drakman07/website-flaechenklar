import { useEffect, useState } from "react";

/**
 * Schmale teal-Progress-Bar fixed am oberen Viewport-Rand.
 * Breite = aktueller Scroll-Prozent (0 -> 100).
 *
 * Implementierung: requestAnimationFrame-throttled scroll-handler,
 * passive-listener fuer beste Performance.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let queued = false;

    const compute = () => {
      const docEl = document.documentElement;
      const total = docEl.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(total > 0 ? Math.min(100, (current / total) * 100) : 0);
      queued = false;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-teal transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
