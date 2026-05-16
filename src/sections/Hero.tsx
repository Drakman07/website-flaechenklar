import { ArrowRight } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { PolygonDemo } from "@/components/PolygonDemo";
import { useCountUp } from "@/hooks/useCountUp";
import {
  BTN_PRIMARY,
  BTN_SECONDARY_ON_DARK,
  ICON_SIZE,
} from "@/components/ui/tokens";

export function Hero() {
  const [ref100, n100] = useCountUp<HTMLElement>(100);
  const [ref0, n0] = useCountUp<HTMLElement>(0);
  const [ref1, n1] = useCountUp<HTMLElement>(1);

  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Von Praktikern für Praktiker entwickelt
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
            Das Lineal bleibt in der{" "}
            <TealUnderline>Schublade</TealUnderline>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#kontakt" className={`group ${BTN_PRIMARY}`}>
              Kostenlose Demo anfragen
              <ArrowRight
                size={ICON_SIZE.inline}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
            <a href="#funktionen" className={BTN_SECONDARY_ON_DARK}>
              Funktionen ansehen
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-8 text-sm">
            <div className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0">
              <dt
                ref={ref100}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n100} <span className="text-xl md:text-2xl">%</span>
              </dt>
              <dd className="mt-1 text-white/70">offline</dd>
            </div>
            <div className="border-l border-white/15 pl-4">
              <dt
                ref={ref0}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n0}
              </dt>
              <dd className="mt-1 text-white/70">Cloud-Calls</dd>
            </div>
            <div className="border-l border-white/15 pl-4">
              <dt
                ref={ref1}
                className="text-2xl font-bold text-teal md:text-3xl tabular-nums"
              >
                {n1}
              </dt>
              <dd className="mt-1 text-white/70">Doppelklick</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          {/* Ghost-Panel hinter dem Canvas — vermittelt subtile Tiefe */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[420px] w-[420px] translate-x-4 translate-y-3 rounded-2xl border border-white/10 bg-white/[0.025]"
          />
          <div className="relative rounded-2xl shadow-feature">
            <PolygonDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
