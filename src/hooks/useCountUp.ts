import { useEffect, useRef, useState } from "react";
import { easeOutCubic } from "@/lib/easing";

type CountUpOptions = {
  /** Animationsdauer (ms). Default 800ms. */
  durationMs?: number;
  /** Wenn false: Wert wird sofort auf `target` gesetzt, keine Animation. Default true. */
  enabled?: boolean;
  /** Verzoegerung in ms bevor die Animation startet (nach In-View). Default 0. */
  startDelayMs?: number;
  /** Nachkommastellen fuer die Ausgabe. Default 0 (Integer). */
  decimals?: number;
};

export function useCountUp<T extends Element = HTMLElement>(
  target: number,
  options: CountUpOptions = {},
) {
  const {
    durationMs = 800,
    enabled = true,
    startDelayMs = 0,
    decimals = 0,
  } = options;
  const ref = useRef<T>(null);
  const [value, setValue] = useState(enabled ? 0 : target);
  // Spiegelt den zuletzt angezeigten Wert. Die Animation startet dort statt
  // bei 0 — sonst springt die Zahl bei jedem Zielwechsel (Preis-Chip wechseln)
  // erst auf 0 zurueck und zaehlt von vorne hoch.
  const valueRef = useRef(enabled ? 0 : target);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const apply = (next: number) => {
      valueRef.current = next;
      setValue(next);
    };

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!enabled || reduce) {
      apply(target);
      return;
    }

    let raf = 0;
    let startTimeout = 0;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      const start = () => {
        const from = valueRef.current;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / durationMs);
          apply(from + (target - from) * easeOutCubic(p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      if (startDelayMs > 0) {
        startTimeout = window.setTimeout(start, startDelayMs);
      } else {
        start();
      }
    });
    obs.observe(node);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      if (startTimeout) window.clearTimeout(startTimeout);
    };
  }, [target, durationMs, enabled, startDelayMs]);

  const factor = Math.pow(10, decimals);
  // Bei `enabled: false` sofort den Zielwert liefern, ohne auf den Effekt zu
  // warten — sonst blitzt fuer einen Frame der alte Wert (oder 0) auf.
  const displayValue = enabled
    ? Math.round(value * factor) / factor
    : Math.round(target * factor) / factor;
  return [ref, displayValue] as const;
}
