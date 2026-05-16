import { ArrowLeft, ArrowRight } from "lucide-react";
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

const KAPITEL: VideoSource[] = [
  {
    src: "https://videos.flaechenklar.de/tour-kapitel-1.mp4",
    poster: "https://videos.flaechenklar.de/tour-kapitel-1-poster.webp",
    captions: "https://videos.flaechenklar.de/tour-kapitel-1.vtt",
    title: "Schnellstart — vom PDF zum Protokoll",
  },
  {
    src: "https://videos.flaechenklar.de/tour-kapitel-2.mp4",
    poster: "https://videos.flaechenklar.de/tour-kapitel-2-poster.webp",
    captions: "https://videos.flaechenklar.de/tour-kapitel-2.vtt",
    title: "Vollgeschosse nach KAG Bayern",
  },
  {
    src: "https://videos.flaechenklar.de/tour-kapitel-3.mp4",
    poster: "https://videos.flaechenklar.de/tour-kapitel-3-poster.webp",
    captions: "https://videos.flaechenklar.de/tour-kapitel-3.vtt",
    title: "Mehrere Geschosse & Maßstab",
  },
  {
    src: "https://videos.flaechenklar.de/tour-kapitel-4.mp4",
    poster: "https://videos.flaechenklar.de/tour-kapitel-4-poster.webp",
    captions: "https://videos.flaechenklar.de/tour-kapitel-4.vtt",
    title: "Export & Aufmaßprotokoll",
  },
];

export function Tour() {
  function handleBack(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
  }

  function handleDemoAnfragen(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
    // nach Route-Switch im nächsten Tick zum Kontakt-Anchor scrollen
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
            <p className={LABEL}>Komplette Tour</p>
            <h1 className="mt-3 text-3xl font-bold text-navy md:text-5xl">
              FlächenKlar im <TealUnderline>Detail</TealUnderline>.
            </h1>
            <p className={`mt-4 ${LEAD}`}>
              Vier kompakte Kapitel zu den wichtigsten Funktionen. Springen Sie
              zum gewünschten Thema — jedes Kapitel ist eigenständig
              verständlich.
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

        <Reveal delay={240}>
          <div className="mt-16 rounded-lg border border-teal/20 bg-teal/[0.04] px-8 py-10 text-center shadow-card">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">
              Bereit für eine Demo?
            </h2>
            <p className="mt-3 text-base text-ink/70">
              14 Tage kostenlos testen, voller Funktionsumfang, ohne Account.
            </p>
            <a
              href="/#kontakt"
              onClick={handleDemoAnfragen}
              className={`group mt-6 ${BTN_PRIMARY_ON_LIGHT}`}
            >
              Demo anfragen
              <ArrowRight
                size={ICON_SIZE.inline}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
