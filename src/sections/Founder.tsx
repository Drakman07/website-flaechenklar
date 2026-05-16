import { useState } from "react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { LABEL } from "@/components/ui/tokens";

/**
 * Founder-Story-Sektion.
 *
 * Position: zwischen ProblemChance und Funktionen.
 * Tonalitaet: navy + BlueprintGrid (gleiche Schiene wie Hero/Vollgeschoss/Kontakt).
 * Foto-Asset: public/alexander-portrait.webp — falls 404, faellt eine
 * stilisierte Initial-Avatar-Platzhalter-Karte ein.
 */
export function Founder() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section
      id="entwickler"
      className="relative overflow-hidden bg-navy text-white"
    >
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[5fr_7fr] lg:gap-16">
        {/* Linke Spalte: Foto in Layered-Composition (Ghost-Panel + Frame) */}
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            {/* Ghost-Panel hinter dem Foto — dezente Tiefe */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-4 translate-y-3 rounded-2xl border border-white/10 bg-white/[0.025]"
            />
            {/* Foto-Frame */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] shadow-feature">
              {photoFailed ? (
                <FounderPhotoPlaceholder />
              ) : (
                <img
                  src="/alexander-portrait.webp"
                  alt="Alexander Geitner, Entwickler von FlächenKlar"
                  className="h-full w-full object-cover"
                  onError={() => setPhotoFailed(true)}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </Reveal>

        {/* Rechte Spalte: Text */}
        <Reveal delay={120}>
          <div>
            <p className={LABEL}>Über den Entwickler</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Ich bin <TealUnderline>Alexander Geitner</TealUnderline>.
            </h2>
            <div className="mt-6 space-y-4 text-white/85 md:text-lg">
              <p>
                Ich arbeite im Bauamt des Marktes Postbauer-Heng.{" "}
                <strong className="font-semibold text-white">
                  FlächenKlar habe ich entwickelt, weil ich das Problem aus dem
                  Alltag kenne.
                </strong>
              </p>
              <p>
                Irgendwann hatte ich genug davon, Geschossflächen aus digitalen
                Plänen mühsam zusammenzurechnen und das Ergebnis halbwegs
                vernünftig zu dokumentieren. Also habe ich angefangen, das
                selbst zu lösen.
              </p>
              <p className="font-semibold text-white">
                Von Praktiker für Praktiker.
              </p>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 text-sm">
              <div className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0">
                <dt className="text-base font-semibold text-teal md:text-lg">
                  Sachbearbeiter
                </dt>
                <dd className="mt-1 text-white/70">Bauamt</dd>
              </div>
              <div className="border-l border-white/15 pl-4">
                <dt className="text-base font-semibold text-teal md:text-lg">
                  Postbauer-Heng
                </dt>
                <dd className="mt-1 text-white/70">Bayern</dd>
              </div>
              <div className="border-l border-white/15 pl-4">
                <dt className="text-base font-semibold text-teal md:text-lg">
                  Mai 2026
                </dt>
                <dd className="mt-1 text-white/70">v1.0.0 live</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Fallback wenn /alexander-portrait.webp noch nicht da ist. */
function FounderPhotoPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-navy-deep p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-teal/40 bg-teal/10 text-3xl font-bold text-teal">
        AG
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/50">
        Portrait folgt
      </p>
      <p className="mt-2 text-xs text-white/40">Alexander Geitner</p>
    </div>
  );
}
