import { ArrowRight } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import iconUrl from "@/assets/logo-icon.svg";

export function Hero() {
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
            <TealUnderline>Schublade</TealUnderline>.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 rounded bg-teal px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Kostenlose Demo anfragen <ArrowRight size={16} />
            </a>
            <a
              href="#funktionen"
              className="rounded border border-white/25 px-5 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Funktionen ansehen
            </a>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-8 text-sm">
            <div>
              <dt className="text-2xl font-bold text-teal md:text-3xl">
                100 <span className="text-xl md:text-2xl">%</span>
              </dt>
              <dd className="mt-1 text-white/70">offline</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-teal md:text-3xl">0</dt>
              <dd className="mt-1 text-white/70">Cloud-Calls</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-teal md:text-3xl">1</dt>
              <dd className="mt-1 text-white/70">Doppelklick</dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative h-[420px] w-[420px] rounded-2xl border border-white/10 bg-white/[0.02]">
            <BlueprintGrid className="rounded-2xl" />
            <div className="absolute inset-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <img
                src={iconUrl}
                alt=""
                aria-hidden="true"
                className="h-40 w-40"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
