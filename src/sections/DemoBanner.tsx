import { CalendarDays, UserX, Droplet } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  H2,
  ICON_SIZE,
  ICON_TILE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

const punkte = [
  {
    icon: CalendarDays,
    title: "14 Tage",
    text: "Voller Funktionsumfang. Keine künstlichen Limits.",
  },
  {
    icon: UserX,
    title: "Kein Account",
    text: "Keine Registrierung, keine Aktivierung, keine Verpflichtung.",
  },
  {
    icon: Droplet,
    title: "Wasserzeichen",
    text: "Einziger Unterschied im Aufmaßprotokoll während der Demo.",
  },
];

/**
 * Demo-Modus als Faktenstreifen statt drei gleicher Karten:
 * Text links, drei Fakten rechts durch Linien getrennt.
 */
export function DemoBanner() {
  return (
    <section className="relative overflow-hidden border-y border-teal/20 bg-gradient-to-br from-teal/[0.08] via-white to-teal/[0.04] py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className={LABEL}>Demo-Modus</p>
          <h2 className={`mt-3 text-navy ${H2}`}>
            Erst testen, dann entscheiden.
          </h2>
          <p className={`mt-4 ${LEAD}`}>
            Der Demo-Modus läuft 14 Tage — mit vollem Funktionsumfang. Einziger
            Unterschied: das Aufmaßprotokoll trägt ein Wasserzeichen. Kein
            Account, keine Installation, keine Cloud.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="grid divide-y divide-teal/20 border-y border-teal/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {punkte.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="group flex flex-col gap-3 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <div className={`h-10 w-10 ${ICON_TILE}`}>
                  <Icon size={ICON_SIZE.feature} aria-hidden="true" />
                </div>
                <p className="text-lg font-semibold text-navy">{title}</p>
                <p className="text-sm text-ink/70">{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
