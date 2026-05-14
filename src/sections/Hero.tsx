import { Ruler, ArrowDown } from "lucide-react";
import { TealUnderline } from "@/components/TealUnderline";
import { BlueprintGrid } from "@/components/BlueprintGrid";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-teal">
            Aufmaß-Werkzeug · Bayern
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Das Lineal bleibt in der{" "}
            <TealUnderline>Schublade</TealUnderline>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF
            laden, Polygon zeichnen, druckreifes Aufmaßprotokoll als Grundlage
            für den Herstellungsbeitrag nach Art. 5 KAG Bayern. Komplett
            offline, ohne Cloud, ohne Installation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#kontakt"
              className="rounded bg-teal px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Demo anfragen
            </a>
            <a
              href="#funktionen"
              className="inline-flex items-center gap-2 rounded border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Funktionen ansehen <ArrowDown size={16} />
            </a>
          </div>

          <dl className="mt-12 grid gap-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-white/50">Plattform</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                Browser, offline
              </dd>
            </div>
            <div>
              <dt className="text-white/50">Installation</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                Doppelklick
              </dd>
            </div>
            <div>
              <dt className="text-white/50">Rechtsgrundlage</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                Art. 5 KAG
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <BlueprintGrid className="rounded-xl border border-white/10" />
          <div className="relative flex h-72 w-72 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Ruler size={88} strokeWidth={1.2} className="text-teal" />
          </div>
        </div>
      </div>
    </section>
  );
}
