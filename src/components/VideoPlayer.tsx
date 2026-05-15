import { useRef } from "react";

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
  captionsDefaultOn?: boolean;
  className?: string;
};

export function VideoPlayer({
  sources,
  autoplay = false,
  muted = false,
  captionsDefaultOn = true,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = sources[0];

  if (!current) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-black ${className}`}>
      <video
        ref={videoRef}
        src={current.src}
        poster={current.poster}
        autoPlay={autoplay}
        muted={muted}
        controls
        playsInline
        preload="metadata"
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
    </div>
  );
}
