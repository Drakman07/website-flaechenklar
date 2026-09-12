import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";
import {
  BTN_TERTIARY,
  H2,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

// ?v=3: Mit Untertiteln laedt der Player im CORS-Modus. R2 liefert die Assets
// mit "max-age=31536000, immutable" — ohne neuen Cache-Key koennte ein Browser
// die frueher ohne CORS gecachte Antwort (ohne Access-Control-Allow-Origin)
// wiederverwenden, und Video/Poster wuerden brechen.
// Der Sprung von ?v=2 auf ?v=3 (12.09.2026) raeumt zwei Edge-Cache-Eintraege ab,
// die ohne Origin-Header gefuellt wurden und darum keinen Vary-Origin-Schluessel
// hatten: teaser.mp4 und teaser-poster.webp kamen dadurch ohne ACAO zurueck.
const TEASER: VideoSource = {
  src: "https://videos.flaechenklar.de/teaser.mp4?v=3",
  poster: "https://videos.flaechenklar.de/teaser-poster.webp?v=3",
  captions: "https://videos.flaechenklar.de/teaser.de.vtt?v=3",
  title: "FlächenKlar in 60 Sekunden",
};

export function TeaserSection() {
  function handleTourClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/tour");
  }

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>In 60 Sekunden</p>
            <h2 className={`mt-3 text-navy ${H2}`}>Sehen Sie es selbst.</h2>
            <p className={`mt-4 ${LEAD}`}>
              Vom Bauplan zum Aufmaßprotokoll — der komplette Workflow in einer
              Minute.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10">
            <VideoPlayer
              sources={[TEASER]}
              scrollAutoplay
              muted
              captionsDefaultOn
              className="mx-auto max-w-4xl shadow-lg"
            />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <a
              href="/tour"
              onClick={handleTourClick}
              className={`group ${BTN_TERTIARY}`}
            >
              Komplette Tour ansehen
              <ArrowRight
                size={ICON_SIZE.inline}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
