import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";
import {
  BTN_PRIMARY_ON_LIGHT,
  FOCUS_RING,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

/**
 * Komplettes Schritt-für-Schritt-Tutorial (~42 min, 8 Kapitel).
 * Ziel: Vor-Ort-Einarbeitung beim Kunden ersetzen.
 *
 * Videos sind auf R2 (videos.flaechenklar.de) gehostet. Naming-Konvention
 * analog zu Tour: tutorial-kapitel-N.mp4 + tutorial-kapitel-N-poster.webp.
 * VTT-Captions sind derzeit nicht vorhanden — Feld `captions` weggelassen,
 * kann pro Kapitel ergaenzt werden sobald Untertitel produziert sind.
 */
const KAPITEL: VideoSource[] = [
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-1.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-1-poster.webp",
    title: "1. Einstieg & Installation",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-2.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-2-poster.webp",
    title: "2. Bauantrags-PDF importieren",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-3.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-3-poster.webp",
    title: "3. Projektdaten erfassen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-4.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-4-poster.webp",
    title: "4. Geschosse & Polygone zeichnen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-5.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-5-poster.webp",
    title: "5. Aufmaßprotokoll exportieren",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-6.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-6-poster.webp",
    title: "6. Vollgeschoss-Berechnung",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-7.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-7-poster.webp",
    title: "7. Updates & Hilfe",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-8.mp4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-8-poster.webp",
    title: "8. Schlussworte",
  },
];

export function Tutorial() {
  function handleBack(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
  }

  function handleDemoAnfragen(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
    window.setTimeout(() => {
      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <a
            href="/"
            onClick={handleBack}
            className={`group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-teal transition-colors hover:text-teal/80 ${FOCUS_RING}`}
          >
            <ArrowLeft
              size={ICON_SIZE.inline}
              className="transition-transform group-hover:-translate-x-1 motion-reduce:transform-none"
            />
            Zurück zur Übersicht
          </a>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 max-w-3xl">
            <p className={LABEL}>Komplettes Tutorial</p>
            <h1 className="mt-3 text-3xl font-bold text-navy md:text-5xl">
              FlächenKlar in <TealUnderline>rund 45 Minuten</TealUnderline>.
            </h1>
            <p className={`mt-4 ${LEAD}`}>
              Acht aufeinander aufbauende Kapitel — vom ersten Doppelklick
              bis zum fertigen Aufmaßprotokoll. So ausführlich, dass eine
              Vor-Ort-Einarbeitung nicht mehr nötig ist. Jedes Kapitel ist
              auch alleine verständlich, springen Sie also gezielt zum
              Thema, das Sie brauchen.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 rounded-lg shadow-feature">
            <VideoPlayer
              sources={KAPITEL}
              captionsDefaultOn
              className="rounded-lg"
            />
          </div>
        </Reveal>

        {/* CTA-Block am Seitenende: für Interessenten Demo, für Kunden Kontakt */}
        <Reveal delay={240}>
          <div className="mt-16 rounded-lg border border-teal/20 bg-teal/[0.04] px-8 py-10 text-center shadow-card">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">
              Fragen oder bereit für eine Demo?
            </h2>
            <p className="mt-3 text-base text-ink/70">
              Sie sind bereits Kunde und stoßen auf eine Frage, die das
              Tutorial nicht beantwortet? Oder möchten Sie das Tool 14 Tage
              kostenlos im echten Bauamtsalltag testen? Beides geht schnell.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/#kontakt"
                onClick={handleDemoAnfragen}
                className={`group ${BTN_PRIMARY_ON_LIGHT}`}
              >
                Demo anfragen
                <ArrowRight
                  size={ICON_SIZE.inline}
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </a>
              <a
                href="mailto:info@flaechenklar.de"
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold text-teal transition-colors hover:text-teal/80 ${FOCUS_RING}`}
              >
                <Mail size={ICON_SIZE.inline} />
                info@flaechenklar.de
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
