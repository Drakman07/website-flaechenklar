import { Triangle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { useCountUp } from "@/hooks/useCountUp";
import {
  BTN_PRIMARY_ON_LIGHT,
  BTN_TERTIARY,
  CARD_BASE,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";
import {
  bescheidBullets,
  bescheidMailto,
  bescheidReleased,
} from "@/content/bescheid";

export function Bescheid() {
  return (
    <section id="bescheid" className="bg-slate-50/60 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <Reveal>
          <div>
            <p className={LABEL}>Add-on · Bescheid-Entwürfe</p>

            {!bescheidReleased ? (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
                In Vorbereitung
              </span>
            ) : (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
                Neu in Version 1.3
              </span>
            )}

            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Vom Aufmaß zum{" "}
              <TealUnderline>Bescheid-Entwurf</TealUnderline>.
            </h2>

            <p className={`mt-6 ${LEAD}`}>
              Das Bescheidmodul erstellt aus Ihren Berechnungsergebnissen und
              den Angaben Ihrer gemeindlichen Satzung Entwürfe für
              Herstellungsbeitragsbescheide nach Art. 5 KAG Bayern — orientiert
              am amtlichen Muster. Prüfung, Unterschrift und Erlass verbleiben
              bei Ihrer Gemeinde.
            </p>

            <ul className="mt-8 space-y-3">
              {bescheidBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Triangle
                    className="mt-1 shrink-0 text-teal"
                    size={ICON_SIZE.inline}
                    strokeWidth={2}
                  />
                  <span className="text-sm text-ink/75 md:text-base">{b}</span>
                </li>
              ))}
            </ul>

            {!bescheidReleased ? (
              <div className="mt-8">
                <a href={bescheidMailto} className={BTN_PRIMARY_ON_LIGHT}>
                  Jetzt vormerken
                </a>
                <p className="mt-3 text-xs text-ink/55">
                  Unverbindlich — wir informieren Sie, sobald das Modul
                  verfügbar ist.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#preise" className={BTN_PRIMARY_ON_LIGHT}>
                  Preise ansehen
                </a>
                <a href="#kontakt" className={BTN_TERTIARY}>
                  Demo anfragen
                </a>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className={`relative ${CARD_BASE} p-6 shadow-feature md:p-8`}>
            <span
              aria-hidden="true"
              className="absolute right-5 top-5 rotate-[-6deg] rounded border-2 border-teal/50 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-teal/70"
            >
              Entwurf
            </span>

            <p className={LABEL}>Beispiel-Entwurf</p>

            {/* Briefkopf angedeutet — bewusst ohne echte Namen/Anschriften. */}
            <div className="mt-5 space-y-2" aria-hidden="true">
              <div className="h-2 w-2/3 rounded bg-navy/10" />
              <div className="h-2 w-1/2 rounded bg-navy/10" />
              <div className="h-2 w-2/5 rounded bg-navy/10" />
            </div>

            <p className="mt-6 text-sm font-semibold text-navy">
              Bescheid über den Herstellungsbeitrag (Art. 5 KAG)
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Geschossfläche</dt>
                <dd className="font-mono tabular-nums text-navy">342,50 m²</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Beitragssatz</dt>
                <dd className="font-mono tabular-nums text-navy">4,50 €/m²</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-outline pt-4">
              <dl className="space-y-2 text-sm">
                <BeitragRow />
              </dl>
            </div>

            <div className="mt-5 rounded border border-teal/40 bg-teal/10 px-4 py-2 text-sm text-teal">
              Entwurf — Prüfung und Erlass bei der Gemeinde
            </div>

            <p className="mt-3 text-xs text-ink/50">
              Beispieldaten zur Veranschaulichung. Keine Rechtsberatung.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Beitrags-Zeile mit Counter-Animation — „rechnet" beim Reveal vor.
 * Eigene, immer gerenderte Komponente, damit useCountUp nie bedingt
 * aufgerufen wird (Rules of Hooks).
 */
function BeitragRow() {
  // 1.541,25 € = 342,50 m² × 4,50 €/m². Skaliert auf Cent für die Animation.
  const target = 154125;
  const [ref, intValue] = useCountUp<HTMLSpanElement>(target, {
    durationMs: 1000,
    startDelayMs: 400,
  });

  const display = (intValue / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/60">Herstellungsbeitrag</dt>
      <dd
        ref={ref}
        className="font-mono font-semibold tabular-nums text-teal"
      >
        {display} €
      </dd>
    </div>
  );
}
