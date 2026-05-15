import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";

const TEASER: VideoSource = {
  src: "https://videos.flaechenklar.de/teaser.mp4",
  poster: "https://videos.flaechenklar.de/teaser-poster.webp",
  captions: "https://videos.flaechenklar.de/teaser.de.vtt",
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
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              In 60 Sekunden
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Sehen Sie es selbst.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
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
              className="group inline-flex items-center gap-2 rounded border border-teal/40 bg-teal/5 px-5 py-3 text-sm font-semibold text-teal transition-colors hover:bg-teal/10"
            >
              Komplette Tour ansehen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
