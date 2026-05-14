import { useEffect, useRef, useState, type MouseEvent } from "react";
import { RotateCcw } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { useInView } from "@/hooks/useInView";
import {
  distance,
  polygonArea,
  svgAreaToM2,
  type Point,
} from "@/lib/polygonArea";

const SIZE = 420;
const SNAP_PX = 12;

const DEMO_POLYGON: readonly Point[] = [
  { x: 110, y: 140 },
  { x: 310, y: 140 },
  { x: 310, y: 260 },
  { x: 250, y: 260 },
  { x: 250, y: 320 },
  { x: 110, y: 320 },
];

const POINT_INTERVAL_MS = 150;
const FILL_DELAY_MS = 250;
const HINT_DELAY_MS = 4000;

type Mode = "auto" | "user";

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PolygonDemo() {
  const [hostRef, inView] = useInView<HTMLDivElement>(0.3);
  const svgRef = useRef<SVGSVGElement>(null);

  const [mode, setMode] = useState<Mode>("auto");
  const [demoPoints, setDemoPoints] = useState<Point[]>([]);
  const [demoClosed, setDemoClosed] = useState(false);
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [userClosed, setUserClosed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (reducedMotion()) {
      setDemoPoints([...DEMO_POLYGON]);
      setDemoClosed(true);
      setShowHint(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    DEMO_POLYGON.forEach((pt, i) => {
      timers.push(
        setTimeout(() => {
          setDemoPoints((prev) => [...prev, pt]);
        }, i * POINT_INTERVAL_MS),
      );
    });
    timers.push(
      setTimeout(
        () => setDemoClosed(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + FILL_DELAY_MS,
      ),
    );
    timers.push(
      setTimeout(
        () => setShowHint(true),
        DEMO_POLYGON.length * POINT_INTERVAL_MS + HINT_DELAY_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  function toSvgPoint(evt: MouseEvent): Point | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * SIZE;
    const y = ((evt.clientY - rect.top) / rect.height) * SIZE;
    return { x, y };
  }

  function handleClick(evt: MouseEvent<SVGSVGElement>) {
    const pt = toSvgPoint(evt);
    if (!pt) return;

    if (mode === "auto") {
      setMode("user");
      setUserPoints([pt]);
      setUserClosed(false);
      setShowHint(false);
      return;
    }

    if (userClosed) {
      setUserPoints([pt]);
      setUserClosed(false);
      return;
    }

    if (userPoints.length >= 3 && distance(pt, userPoints[0]) <= SNAP_PX) {
      setUserClosed(true);
      return;
    }

    setUserPoints((prev) => [...prev, pt]);
  }

  function handleDoubleClick() {
    if (mode === "user" && userPoints.length >= 3 && !userClosed) {
      setUserClosed(true);
    }
  }

  function handleReset() {
    setUserPoints([]);
    setUserClosed(false);
  }

  const showingUser = mode === "user";
  const activePoints = showingUser ? userPoints : demoPoints;
  const isClosed = showingUser ? userClosed : demoClosed;

  const pathD =
    activePoints.length === 0
      ? ""
      : activePoints
          .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
          .join(" ") + (isClosed ? " Z" : "");

  const area = svgAreaToM2(polygonArea(activePoints));

  const cursor = showingUser ? "cursor-crosshair" : "cursor-pointer";

  return (
    <div
      ref={hostRef}
      className="relative h-[420px] w-[420px] rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <BlueprintGrid className="rounded-2xl" />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`absolute inset-0 h-full w-full ${cursor}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="img"
        aria-label="Polygon-Demo: klicken um Punkte zu setzen"
      >
        {pathD && (
          <path
            d={pathD}
            fill={isClosed ? "hsl(var(--teal) / 0.12)" : "transparent"}
            stroke="hsl(var(--teal))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "fill 400ms ease-out" }}
          />
        )}
        {activePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 7 : 5.5}
            fill="white"
            stroke="hsl(var(--teal))"
            strokeWidth={2}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold text-teal backdrop-blur-sm">
        {area > 0 ? `${area.toFixed(1)} m²` : "0,0 m²"}
      </div>

      {showingUser && userPoints.length > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          <RotateCcw size={12} /> Zurücksetzen
        </button>
      )}

      <div
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm transition-opacity duration-500 ${
          showHint && !showingUser ? "opacity-100" : "opacity-0"
        }`}
      >
        Jetzt selbst probieren — klicken, um zu zeichnen
      </div>
    </div>
  );
}
