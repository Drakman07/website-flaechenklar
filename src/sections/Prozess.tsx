import { Ruler, Triangle, FileCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { useInView } from "@/hooks/useInView";
import { FOCUS_RING, H2, ICON_SIZE, LABEL, LEAD } from "@/components/ui/tokens";

type Schritt = {
  title: string;
  text: string;
  href: string;
  icon: LucideIcon;
  final?: boolean;
};

const SCHRITTE: readonly Schritt[] = [
  {
    title: "Flächen messen",
    text: "PDF oder Foto laden, Polygon zeichnen — Fläche und Aufmaßprotokoll in Minuten.",
    href: "#funktionen",
    icon: Ruler,
  },
  {
    title: "Vollgeschosse prüfen",
    text: "Kniestock, Dachneigung, Gauben — die 2/3-Schwelle nach Art. 83 Abs. 7 BayBO automatisch berechnet.",
    href: "#vollgeschoss",
    icon: Triangle,
  },
  {
    title: "Bescheid-Entwurf erstellen",
    text: "Werte direkt übernehmen, Satzungsdaten hinterlegen — Entwurf nach Art. 5 KAG Bayern in Minuten.",
    href: "#bescheid",
    icon: FileCheck,
    final: true,
  },
] as const;

export function Prozess() {
  const [lineRef, lineIn] = useInView<HTMLDivElement>(0.4);

  return (
    <section id="prozess" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>Der Weg zum Bescheid</p>
            <h2 className={`mt-3 text-navy ${H2}`}>
              Vom Plan zum <TealUnderline>Bescheid-Entwurf</TealUnderline> in
              drei Schritten.
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Jeder Schritt baut auf dem vorigen auf — ohne Medienbruch, ohne
              Abtippen.
            </p>
          </div>
        </Reveal>

        <div ref={lineRef} className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Verbindungslinie, nur Desktop: zeichnet sich beim Scrollen */}
          <svg
            className="pointer-events-none absolute left-0 top-7 hidden w-full md:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            style={{ height: "2px" }}
            aria-hidden="true"
          >
            <line
              x1="16"
              y1="1"
              x2="84"
              y2="1"
              stroke="currentColor"
              className="text-outline"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M16 1 L84 1"
              className="self-draw-path"
              fill="none"
              stroke="hsl(var(--teal))"
              strokeWidth="2"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={lineIn ? 0 : 1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {SCHRITTE.map((schritt, i) => (
            <Reveal key={schritt.title} delay={i * 150}>
              <a
                href={schritt.href}
                className={`group relative flex flex-col items-center rounded text-center md:items-start md:text-left ${FOCUS_RING}`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white text-teal transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none ${
                    schritt.final
                      ? "border-teal shadow-[0_0_24px_-4px_hsl(174_65%_42%/0.4)]"
                      : "border-outline"
                  }`}
                >
                  <schritt.icon size={ICON_SIZE.hero} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink/45">
                  Schritt {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-navy">
                  {schritt.title}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{schritt.text}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
