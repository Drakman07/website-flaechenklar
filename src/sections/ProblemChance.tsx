import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const chancePunkte = [
  "Maße direkt aus dem digitalen Bauantrag",
  "Polygone mit automatischer Flächenberechnung",
  "Vollgeschoss nach Art. 83 Abs. 7 BayBO als Modul",
  "Druckreifes PDF-Aufmaßprotokoll auf Knopfdruck",
  "Wiederholbar, nachvollziehbar, archivierbar",
];

export function ProblemChance() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Das Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Der digitale Bauantrag ist da. Das Lineal nicht.
          </h2>
          <p className="mt-6 text-base text-ink/80 md:text-lg">
            Seit 1. Januar 2025 gehen Bauanträge nach der Bayerischen
            Bauordnung direkt beim Landratsamt ein — die Gemeinde wird digital
            beteiligt, der Vorgang landet als PDF in der Akte. Papierpläne zum
            Ausmessen mit dem Lineal gibt es nicht mehr. Die Geschossflächen
            müssen aber trotzdem ermittelt werden: für den Herstellungsbeitrag,
            für die Akte, für jede Plan-Korrektur.
          </p>
          <p className="mt-4 text-base text-ink/80 md:text-lg">
            Wer darin nur eine Last sieht, übersieht die Chance: Ein digitaler
            Bauantrag lässt sich mit dem richtigen Werkzeug schneller und
            präziser auswerten als jeder Papierplan mit dem Lineal. Kein
            Ausdrucken, kein Abgreifen, kein Abtippen — und bei Planänderungen
            einfach neu zeichnen, nicht neu anfangen.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Mit FlächenKlar
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            PDF rein, Aufmaßprotokoll raus.
          </h2>
          <ul className="mt-6 space-y-3">
            {chancePunkte.map((punkt) => (
              <li key={punkt} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-teal"
                  size={22}
                  strokeWidth={2}
                />
                <span className="text-base text-ink/80 md:text-lg">{punkt}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
