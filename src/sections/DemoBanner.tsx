import { CalendarDays, UserX, Droplet } from "lucide-react";
import { Reveal } from "@/components/Reveal";

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

export function DemoBanner() {
  return (
    <section className="relative overflow-hidden border-y border-teal/20 bg-gradient-to-br from-teal/[0.08] via-white to-teal/[0.04] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Demo-Modus
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Erst testen, dann entscheiden.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Der Demo-Modus läuft 14 Tage — mit vollem Funktionsumfang. Einziger
              Unterschied: das Aufmaßprotokoll trägt ein Wasserzeichen. Kein
              Account, keine Installation, keine Cloud.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {punkte.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 90}>
              <article className="rounded-lg border border-teal/20 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded bg-teal text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm text-ink/70">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
