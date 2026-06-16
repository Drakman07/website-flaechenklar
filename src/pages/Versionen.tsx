import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { navigate } from "@/router";
import { versionen } from "@/content/versionen";
import { FOCUS_RING, ICON_SIZE, LABEL, LEAD } from "@/components/ui/tokens";

/**
 * Öffentliche Versionshistorie als vertikaler Zeitstrahl.
 *
 * Inhalt kommt aus src/content/versionen.ts (Single Source of Truth,
 * geteilt mit dem "Neu in dieser Version"-Block auf /tutorial).
 */
export function Versionen() {
  function handleBack(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
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
          <div className="mt-6">
            <p className={LABEL}>Versionsverlauf</p>
            <h1 className="mt-3 text-3xl font-bold text-navy md:text-5xl">
              Was bei FlächenKlar <TealUnderline>dazukommt</TealUnderline>.
            </h1>
            <p className={`mt-4 ${LEAD}`}>
              Jede Version bringt konkrete Verbesserungen aus dem
              Bauamtsalltag. Hier sehen Sie, was wann dazugekommen ist —
              chronologisch und nachvollziehbar.
            </p>
          </div>
        </Reveal>

        <ol className="relative mt-12 border-l border-outline">
          {versionen.map((v, i) => (
            <li key={v.version} className="relative pl-8 pb-12 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal ring-4 ring-white"
              />
              <Reveal delay={i === 0 ? 0 : 80}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-navy px-2.5 py-1 text-xs font-medium text-white">
                    Version {v.version}
                  </span>
                  <time dateTime={v.iso} className="text-sm text-ink/60">
                    {v.datum}
                  </time>
                </div>
                <ul className="mt-4 space-y-4">
                  {v.punkte.map((p) => (
                    <li key={p.titel}>
                      <p className="font-medium text-navy">{p.titel}</p>
                      <p className="mt-1 text-ink/70">{p.text}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
