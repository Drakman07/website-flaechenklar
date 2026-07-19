import { ArrowLeft, ArrowRight, Mail, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { navigate } from "@/router";
import { versionen } from "@/content/versionen";
import {
  BTN_PRIMARY_ON_LIGHT,
  CARD_BASE,
  FOCUS_RING,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

/**
 * Komplettes Schritt-für-Schritt-Tutorial (~58 min, 13 Kapitel).
 * Ziel: Vor-Ort-Einarbeitung beim Kunden ersetzen.
 *
 * Videos sind auf R2 (videos.flaechenklar.de) gehostet. Naming-Konvention
 * analog zu Tour: tutorial-kapitel-N.mp4 + tutorial-kapitel-N-poster.webp.
 * Struktur v1.3 (2026-07-19, s. tutorial-spicker-v1.3.pdf): komplett neues
 * Drehbuch, 3 neue Kapitel (Foto-Import, RIWA-Export, Bescheid-Stammdaten
 * + Bescheid-Erstellung als 2 Kapitel) gegenüber v1.2.
 * VTT-Captions bewusst weggelassen (2026-07-19): alte Kapitel-1..10-VTTs
 * auf R2 stammen noch vom v1.2-Drehbuch und passen inhaltlich/zeitlich
 * nicht mehr. Kein `captions`-Feld gesetzt, bis neue Untertitel produziert
 * sind (VideoPlayer rendert <track> nur wenn captions gesetzt ist).
 */
const KAPITEL: VideoSource[] = [
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-1.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-1-poster.webp?v=4",
    title: "1. Einstieg & Installation",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-2.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-2-poster.webp?v=4",
    title: "2. Bauantrags-PDF importieren",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-3.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-3-poster.webp?v=4",
    title: "3. Projektdaten erfassen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-4.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-4-poster.webp?v=4",
    title: "4. Geschoss & Region anlegen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-5.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-5-poster.webp?v=4",
    title: "5. Maßstab messen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-6.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-6-poster.webp?v=4",
    title: "6. Foto statt PDF",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-7.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-7-poster.webp?v=4",
    title: "7. Flächen zeichnen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-8.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-8-poster.webp?v=4",
    title: "8. Vollgeschoss-Beurteilung",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-9.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-9-poster.webp?v=4",
    title: "9. Aufmaßprotokoll exportieren",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-10.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-10-poster.webp?v=4",
    title: "10. Datenexport RIWA",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-11.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-11-poster.webp?v=4",
    title: "11. Bescheid-Stammdaten einrichten",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-12.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-12-poster.webp?v=4",
    title: "12. Beitragsbescheid erstellen",
  },
  {
    src: "https://videos.flaechenklar.de/tutorial-kapitel-13.mp4?v=4",
    poster: "https://videos.flaechenklar.de/tutorial-kapitel-13-poster.webp?v=4",
    title: "13. Speichern, Updates, Hilfe & Schlusswort",
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

  function handleVersionen(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate("/versionen");
  }

  const aktuelle = versionen.find((v) => v.oeffentlich !== false) ?? versionen[0];

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <a
            href="/"
            onClick={handleBack}
            className={`group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-teal-ink transition-colors hover:text-teal-ink/80 ${FOCUS_RING}`}
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
              FlächenKlar in <TealUnderline>rund einer Stunde</TealUnderline>.
            </h1>
            <p className={`mt-4 ${LEAD}`}>
              13 aufeinander aufbauende Kapitel — vom ersten Doppelklick
              bis zum fertigen Beitragsbescheid, inklusive Foto-Import und
              RIWA-Datenexport. So ausführlich, dass eine Vor-Ort-Einarbeitung
              nicht mehr nötig ist. Jedes Kapitel ist auch alleine
              verständlich, springen Sie also gezielt zum Thema, das Sie
              brauchen.
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

        {/* Was die aktuelle Version gebracht hat — Inhalt aus content/versionen.ts */}
        <Reveal delay={200}>
          <div className={`mt-12 ${CARD_BASE} border-l-4 border-l-teal p-6 md:p-8`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={ICON_SIZE.feature} className="text-teal" />
                <h2 className="text-lg font-bold text-navy">
                  Neu in dieser Version
                </h2>
              </div>
              <span className="rounded bg-navy px-2.5 py-1 text-xs font-medium text-white">
                Version {aktuelle.version} · {aktuelle.datum}
              </span>
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {aktuelle.punkte
                .filter((p) => p.oeffentlich !== false)
                .map((p) => (
                <li key={p.titel} className="text-ink/80">
                  <span className="font-medium text-navy">{p.titel}</span> —{" "}
                  {p.text}
                </li>
              ))}
            </ul>
            <a
              href="/versionen"
              onClick={handleVersionen}
              className={`group mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-teal-ink transition-colors hover:text-teal-ink/80 ${FOCUS_RING}`}
            >
              Alle Versionen ansehen
              <ArrowRight
                size={ICON_SIZE.inline}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
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
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold text-teal-ink transition-colors hover:text-teal-ink/80 ${FOCUS_RING}`}
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
