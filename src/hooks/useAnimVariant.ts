import { useEffect, useState } from "react";

/**
 * Animations-Varianten fuer den User-Live-Vergleich.
 * - A: subtile dichter (Linear/Stripe-Stil)
 * - B: markanter, gezielt (Vercel/Stripe Atlas-Stil) — Default-Empfehlung
 * - C: maximale Wirkung (Awwwards-Stil)
 *
 * Nach User-Entscheidung wird der Code der nicht-gewaehlten Varianten
 * entfernt (Cleanup-Phase).
 */
export type AnimVariant = "a" | "b" | "c";

const VARIANT_ORDER: Record<AnimVariant, number> = { a: 0, b: 1, c: 2 };
const VALID_VARIANTS: readonly AnimVariant[] = ["a", "b", "c"];

const STORAGE_KEY = "flk:anim-variant";
const CHANGE_EVENT = "flk:variant-changed";

/** Liest die aktive Variante aus URL `?anim=...`, faellt auf localStorage zurueck, default `b`. */
function readVariant(): AnimVariant {
  if (typeof window === "undefined") return "b";

  const url = new URLSearchParams(window.location.search).get("anim");
  if (url && (VALID_VARIANTS as readonly string[]).includes(url)) {
    try {
      window.localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // localStorage kann blockiert sein, ignorieren
    }
    return url as AnimVariant;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_VARIANTS as readonly string[]).includes(stored)) {
      return stored as AnimVariant;
    }
  } catch {
    // localStorage blockiert -> default
  }

  return "b";
}

/** Hook: gibt die aktive Animations-Variante zurueck, hoert auf URL- und Switcher-Events. */
export function useAnimVariant(): AnimVariant {
  const [variant, setVariant] = useState<AnimVariant>(() => readVariant());

  useEffect(() => {
    const update = () => setVariant(readVariant());
    window.addEventListener("popstate", update);
    window.addEventListener(CHANGE_EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(CHANGE_EVENT, update);
    };
  }, []);

  return variant;
}

/** Aktiv? Variante muss mindestens `min` sein. */
export function variantAtLeast(
  variant: AnimVariant,
  min: AnimVariant,
): boolean {
  return VARIANT_ORDER[variant] >= VARIANT_ORDER[min];
}

/** Variant-Switcher: setzt URL-Param + localStorage und triggert Re-Render. */
export function setAnimVariant(next: AnimVariant): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("anim", next);
  window.history.replaceState({}, "", url);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
