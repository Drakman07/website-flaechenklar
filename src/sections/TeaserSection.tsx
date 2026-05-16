import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";
import { BTN_TERTIARY, ICON_SIZE } from "@/components/ui/tokens";

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
