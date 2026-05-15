import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export type VideoSource = {
  src: string;
  poster: string;
  captions: string;
  title: string;
};

type Props = {
  sources: VideoSource[];
  autoplay?: boolean;
  muted?: boolean;
  scrollAutoplay?: boolean;
  captionsDefaultOn?: boolean;
  className?: string;
  onChapterChange?: (index: number) => void;
};

export function VideoPlayer({
  sources,
  autoplay = false,
  muted = false,
  scrollAutoplay = false,
  captionsDefaultOn = true,
  className = "",
  onChapterChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [containerRef, inView] = useInView<HTMLDivElement>(0.5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(muted || scrollAutoplay);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const current = sources[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (autoplay || activeIndex > 0) {
      void video.play().catch(() => {
        /* Autoplay-Block: Nutzer muss klicken */
      });
    }
  }, [activeIndex, autoplay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !scrollAutoplay) return;
    if (inView && !hasUserInteracted) {
      void video.play().catch(() => {
        /* still blockiert — ignorieren */
      });
    }
  }, [inView, scrollAutoplay, hasUserInteracted]);

  function selectChapter(index: number): void {
    if (index === activeIndex) return;
    setHasUserInteracted(true);
    setActiveIndex(index);
    onChapterChange?.(index);
  }

  function toggleMute(): void {
    const video = videoRef.current;
    if (!video) return;
    setHasUserInteracted(true);
    const next = !isMuted;
    setIsMuted(next);
    video.muted = next;
    if (!next) {
      void video.play().catch(() => {
        /* ignorieren */
      });
    }
  }

  function handleVideoTap(): void {
    if (window.innerWidth >= 768) return; // nur Mobile
    const video = videoRef.current;
    if (!video) return;
    const target = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    if (target.requestFullscreen) {
      void target.requestFullscreen().catch(() => {
        /* Browser unterstützt nicht — ignorieren */
      });
    } else if (typeof target.webkitEnterFullscreen === "function") {
      // iOS Safari benötigt webkitEnterFullscreen auf dem Video-Element
      target.webkitEnterFullscreen();
    }
  }

  if (!current) {
    return null;
  }

  const hasChapters = sources.length > 1;
  const showMuteOverlay = scrollAutoplay && isMuted;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-lg bg-black ${
        hasChapters ? "grid gap-0 md:grid-cols-[1fr_280px]" : ""
      } ${className}`}
    >
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={current.src}
          poster={current.poster}
          autoPlay={autoplay}
          muted={isMuted}
          controls
          playsInline
          preload="metadata"
          onClick={handleVideoTap}
          className="block w-full"
        >
          <track
            kind="subtitles"
            src={current.captions}
            srcLang="de"
            label="Deutsch"
            default={captionsDefaultOn}
          />
        </video>
        {showMuteOverlay && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/85"
            aria-label="Ton einschalten"
          >
            <VolumeX size={14} />
            Ton an
          </button>
        )}
        {!showMuteOverlay && scrollAutoplay && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/85"
            aria-label="Ton ausschalten"
          >
            <Volume2 size={14} />
          </button>
        )}
      </div>

      {hasChapters && (
        <aside className="bg-navy text-white">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-teal">
            Kapitel
          </div>
          <ol className="divide-y divide-white/10">
            {sources.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => selectChapter(i)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-teal/15 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                      i === activeIndex
                        ? "bg-teal text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </div>
  );
}
