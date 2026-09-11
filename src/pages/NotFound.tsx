import type { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { navigate, type RoutePath } from "@/router";
import {
  BTN_PRIMARY,
  BTN_SECONDARY_ON_DARK,
  FOCUS_RING_DARK,
  H1,
  ICON_SIZE,
  LABEL_ON_DARK,
  LEAD_ON_DARK,
} from "@/components/ui/tokens";

/** Router-Link ohne Vollreload. */
function go(to: RoutePath) {
  return (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navigate(to);
  };
}

/**
 * 404-Seite fuer unbekannte Pfade.
 *
 * Der Worker liefert fuer diese Pfade die SPA-Shell mit HTTP-Status 404 aus
 * (worker/index.ts), der Router landet hier (router.tsx -> "notfound").
 */
export function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid />
      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-24 lg:pb-40 lg:pt-32">
        <p className={LABEL_ON_DARK}>Fehler 404</p>
        <h1 className={`mt-3 max-w-2xl ${H1}`}>Seite nicht gefunden.</h1>
        <p className={`mt-4 max-w-xl ${LEAD_ON_DARK}`}>
          Die Adresse ist falsch geschrieben oder die Seite wurde verschoben.
          Von hier aus geht es weiter.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" onClick={go("/")} className={`group ${BTN_PRIMARY}`}>
            Zur Startseite
            <ArrowRight
              size={ICON_SIZE.inline}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </a>
          <a href="/tour" onClick={go("/tour")} className={BTN_SECONDARY_ON_DARK}>
            Tour ansehen
          </a>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Oder direkt zum{" "}
          <a
            href="/tutorial"
            onClick={go("/tutorial")}
            className={`rounded-sm text-teal underline underline-offset-2 transition-colors hover:text-teal/80 ${FOCUS_RING_DARK}`}
          >
            Tutorial
          </a>
          .
        </p>
      </div>
    </section>
  );
}
