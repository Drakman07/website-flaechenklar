import { sicherheit } from "@/content/sicherheit";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import {
  H2,
  ICON_SIZE,
  ICON_TILE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

/**
 * Sicherheit & Datenschutz.
 *
 * Bewusst ohne Karten-Chrome: die sechs Punkte stehen als redaktionelle
 * Liste mit Trennlinie ueber jedem Eintrag. Die Startseite hat mit
 * Funktionen und Preisen schon genug Karten.
 */
export function Sicherheit() {
  return (
    <section id="sicherheit" className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-2">
          <p className={LABEL}>Sicherheit & Datenschutz</p>
          <h2 className={`mt-3 text-navy ${H2}`}>
            Bauherrendaten verlassen nie den{" "}
            <TealUnderline>Rechner</TealUnderline>.
          </h2>
          <p className={`mt-4 ${LEAD}`}>
            Kein Cloud-Service, kein Account, kein Tracking. Genau so, wie der
            Datenschutzbeauftragte es haben will.
          </p>
        </Reveal>

        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-3">
          {sicherheit.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="border-t border-outline">
              <Reveal delay={i * 70}>
                <div className="group flex gap-4 py-6">
                  <div className={`h-10 w-10 shrink-0 ${ICON_TILE}`}>
                    <Icon size={ICON_SIZE.feature} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-navy">{title}</h3>
                    <p className="mt-1.5 text-sm text-ink/70">{text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
