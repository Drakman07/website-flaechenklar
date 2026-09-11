import { useState } from "react";
import type { Preisstufe } from "@/content/preise";
import { preise } from "@/content/preise";
import { bescheidReleased } from "@/content/bescheid";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { useCountUp } from "@/hooks/useCountUp";
import {
  CARD_ACCENT_BORDER,
  CARD_HOVER,
  CARD_HOVER_GLOW,
  FOCUS_RING,
  H2,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

export function Preise() {
  // Mobil (< md) zeigt nur die gewaehlte Stufe, statt fuenf Karten zu
  // stapeln. Ab md sind immer alle Karten sichtbar.
  const [aktiv, setAktiv] = useState(0);

  return (
    <section id="preise" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>Preise</p>
            <h2 className={`mt-3 text-navy ${H2}`}>
              Klar gestaffelt nach{" "}
              <TealUnderline>Einwohnerklasse</TealUnderline>.
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Einmalkauf nach Einwohnerklasse. Wartung im ersten Jahr inklusive,
              ab dem zweiten Jahr{" "}
              {bescheidReleased
                ? "10 % auf Lizenz und gebuchte Module p. a."
                : "10 % p. a."}
              , jährlich kündbar.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 md:hidden">
          <p id="preise-einwohner-label" className="text-sm font-medium text-ink/70">
            Einwohnerzahl Ihrer Kommune
          </p>
          <div
            role="group"
            aria-labelledby="preise-einwohner-label"
            className="mt-3 flex flex-wrap gap-2"
          >
            {preise.map((stufe, i) => {
              const active = i === aktiv;
              return (
                <button
                  key={stufe.einwohner}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAktiv(i)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    active
                      ? "border-teal-ink bg-teal-ink text-white"
                      : "border-outline bg-white text-ink/80 hover:border-teal/40 hover:bg-teal/5"
                  }`}
                >
                  {stufe.einwohner}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {preise.map((stufe, i) => (
            <PreisCard
              key={stufe.einwohner}
              stufe={stufe}
              delay={i * 100}
              className={i === aktiv ? "" : "hidden md:block"}
            />
          ))}
        </div>

        <Reveal delay={700}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink/60">
            Wartung im ersten Jahr inklusive. Ab Jahr 2{" "}
            {bescheidReleased
              ? "10 % auf Lizenz und gebuchte Module, "
              : ""}
            jährlich kündbar. Enthält Updates, Rechtsanpassungen und
            E-Mail-Support. Als Kleinunternehmer nach § 19 UStG weise ich
            keine Umsatzsteuer aus — die genannten Preise sind zugleich die
            Endpreise.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PreisCard({
  stufe,
  delay,
  className = "",
}: {
  stufe: Preisstufe;
  delay: number;
  className?: string;
}) {
  // Komplett-Paket = Aufmaßmodul + Bescheidmodul, aus den Rohwerten berechnet
  // (keine hartkodierten Summen) — der prominente Anker-Preis, sobald das
  // Modul released ist. Ohne Bescheidmodul bleibt der Aufmaßmodul-Preis der
  // Anker (bewusst NICHT als "Basis"/Minimalversion geframt — das
  // Aufmaßmodul ist ein vollwertiges, eigenständig sinnvolles Produkt).
  const komplettNumeric = stufe.einmaligNumeric + stufe.bescheidModulNumeric;
  const wartungKomplettNumeric = stufe.wartungMitModulNumeric;

  // Counter-Animation: Preise zaehlen beim Reveal hoch, staggered je Card.
  const [einmaligRef, einmaligValue] = useCountUp<HTMLSpanElement>(
    bescheidReleased ? komplettNumeric : stufe.einmaligNumeric,
    { durationMs: 900, startDelayMs: delay },
  );
  const [wartungRef, wartungValue] = useCountUp<HTMLSpanElement>(
    bescheidReleased ? wartungKomplettNumeric : stufe.wartungNumeric,
    { durationMs: 900, startDelayMs: delay + 150 },
  );

  const Icon = stufe.icon;
  const formatNum = (n: number) => n.toLocaleString("de-DE");

  return (
    <Reveal delay={delay} className={className}>
      <article
        className={`group relative flex h-full flex-col rounded-lg border border-outline bg-white p-6 shadow-card ${CARD_ACCENT_BORDER} ${CARD_HOVER} ${CARD_HOVER_GLOW}`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
          <Icon size={ICON_SIZE.feature} />
        </div>
        <p className={`mt-4 ${LABEL}`}>{stufe.einwohner}</p>

        {bescheidReleased && (
          <p className="mt-3 text-xs font-semibold text-teal-ink">
            Komplett-Paket · mit Bescheidmodul
          </p>
        )}
        <p className="mt-1 whitespace-nowrap text-3xl font-bold tabular-nums text-navy md:text-4xl">
          <span ref={einmaligRef}>{formatNum(einmaligValue)}</span>
          <span className="text-2xl font-bold text-ink/55">&nbsp;€</span>
        </p>
        <p className="mt-1 text-xs text-ink/55">einmalig (netto)</p>

        {bescheidReleased && (
          <p className="mt-2 text-xs text-ink/50">
            Aufmaßmodul allein:{" "}
            <span className="whitespace-nowrap">
              {formatNum(stufe.einmaligNumeric)}&nbsp;€
            </span>
          </p>
        )}

        <div className="mt-auto border-t border-outline pt-4">
          <p className="text-xs text-ink/65">
            Wartung ab Jahr 2:{" "}
            <span className="whitespace-nowrap">
              <span ref={wartungRef} className="font-semibold tabular-nums text-ink/85">
                {formatNum(wartungValue)}&nbsp;€
              </span>
              <span className="text-ink/55">&nbsp;p.a.</span>
            </span>
          </p>
          {bescheidReleased && (
            <p className="mt-1 text-xs text-ink/50">
              Aufmaßmodul allein:{" "}
              <span className="whitespace-nowrap">
                {formatNum(stufe.wartungNumeric)}&nbsp;€&nbsp;p.a.
              </span>
            </p>
          )}
        </div>
      </article>
    </Reveal>
  );
}
