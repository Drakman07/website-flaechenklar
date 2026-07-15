import { Triangle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { BescheidAufbau } from "@/components/animations/BescheidAufbau";
import { BTN_PRIMARY_ON_LIGHT, BTN_TERTIARY, ICON_SIZE, LABEL, LEAD } from "@/components/ui/tokens";
import {
  bescheidBullets,
  bescheidLabel,
  bescheidMailto,
  bescheidReleased,
} from "@/content/bescheid";

function notifyBescheidInteresse(): void {
  window.dispatchEvent(new Event("fk-bescheid-interesse"));
}

export function Bescheid() {
  return (
    <section id="bescheid" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>{bescheidLabel}</p>

            {!bescheidReleased ? (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-ink">
                In Vorbereitung
              </span>
            ) : (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-ink">
                Neu in Version 1.3
              </span>
            )}

            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Vom Aufmaß zum fertigen{" "}
              <TealUnderline>Bescheid-Entwurf</TealUnderline>.
            </h2>

            <p className={`mt-4 ${LEAD}`}>
              Aus Ihren Berechnungsergebnissen und den Angaben Ihrer
              gemeindlichen Satzung entsteht in Minuten ein Entwurf für
              Herstellungsbeitragsbescheide nach Art. 5 KAG Bayern —
              orientiert am amtlichen Muster. Geprüft, unterschrieben und
              erlassen wird weiterhin ausschließlich durch Ihre Gemeinde.
            </p>

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
                  Komplett-Paket ansehen
                </a>
                <a
                  href="#kontakt"
                  onClick={notifyBescheidInteresse}
                  className={BTN_TERTIARY}
                >
                  Demo mit Bescheidmodul anfragen
                </a>
              </div>
            )}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <ul className="grid gap-x-8 gap-y-5 self-start sm:grid-cols-2">
            {bescheidBullets.map((b, i) => (
              <Reveal key={b} delay={i * 70}>
                <li className="flex items-start gap-3">
                  <Triangle
                    className="mt-1 shrink-0 text-teal"
                    size={ICON_SIZE.inline}
                    strokeWidth={2}
                  />
                  <span className="text-sm text-ink/75 md:text-base">{b}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={150}>
            <BescheidAufbau />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
