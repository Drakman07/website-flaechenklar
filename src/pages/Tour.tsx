import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";

// Platzhalter — werden durch echte R2-URLs ersetzt sobald Videos produziert
const KAPITEL: VideoSource[] = [
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    title: "Schnellstart — vom PDF zum Protokoll",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    title: "Vollgeschosse nach KAG Bayern",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
    title: "Mehrere Geschosse & Maßstab",
  },
  {
    src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    poster:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4#t=0.1",
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal/80"
          >
            <ArrowLeft size={14} />
            Zurück zur Übersicht
          </a>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Komplette Tour
            </p>
            <h1 className="mt-3 text-3xl font-bold text-navy md:text-5xl">
              FlächenKlar im Detail.
            </h1>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Vier Kapitel à 60 Sekunden. Springen Sie zum gewünschten Thema —
              jedes Kapitel ist eigenständig verständlich.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10">
            <VideoPlayer
              sources={KAPITEL}
              captionsDefaultOn
              className="shadow-lg"
            />
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-16 rounded-lg border border-teal/20 bg-teal/[0.04] px-8 py-10 text-center">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">
              Bereit für eine Demo?
            </h2>
            <p className="mt-3 text-base text-ink/70">
              14 Tage kostenlos testen, voller Funktionsumfang, ohne Account.
            </p>
            <a
              href="/#kontakt"
              onClick={handleDemoAnfragen}
              className="group mt-6 inline-flex items-center gap-2 rounded bg-teal px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
            >
              Demo anfragen
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
