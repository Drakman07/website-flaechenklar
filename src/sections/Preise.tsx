import type { Preisstufe } from "@/content/preise";
import { preise } from "@/content/preise";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { useCountUp } from "@/hooks/useCountUp";
import {
  CARD_ACCENT_BORDER,
  CARD_HOVER,
  CARD_HOVER_GLOW,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

export function Preise() {
  return (
    <section id="preise" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>Preise</p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Klar gestaffelt nach{" "}
              <TealUnderline>Einwohnerklasse</TealUnderline>.
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Einmalkauf nach Einwohnerklasse. Wartung im ersten Jahr inklusive,
              ab dem zweiten Jahr 10 % p. a., jährlich kündbar.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {preise.map((stufe, i) => (
            <PreisCard key={stufe.einwohner} stufe={stufe} delay={i * 100} />
          ))}
        </div>

        <Reveal delay={700}>
          <p className="mt-8 text-center text-sm text-ink/60">
            Wartung im ersten Jahr inklusive. Ab Jahr 2 jährlich kündbar.
            Enthält Updates, Rechtsanpassungen und E-Mail-Support.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PreisCard({ stufe, delay }: { stufe: Preisstufe; delay: number }) {
  // Counter-Animation: Preise zaehlen beim Reveal hoch, staggered je Card.
  const [einmaligRef, einmaligValue] = useCountUp<HTMLSpanElement>(
    stufe.einmaligNumeric,
    { durationMs: 900, startDelayMs: delay },
  );
  const [wartungRef, wartungValue] = useCountUp<HTMLSpanElement>(
    stufe.wartungNumeric,
    { durationMs: 900, startDelayMs: delay + 150 },
  );

  const Icon = stufe.icon;
  const formatNum = (n: number) => n.toLocaleString("de-DE");

  return (
    <Reveal delay={delay}>
      <article
        className={`group flex h-full flex-col rounded-lg border border-outline bg-white p-6 shadow-card ${CARD_ACCENT_BORDER} ${CARD_HOVER} ${CARD_HOVER_GLOW}`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
          <Icon size={ICON_SIZE.feature} />
        </div>
        <p className={`mt-4 ${LABEL}`}>{stufe.einwohner}</p>
        <p className="mt-3 text-3xl font-bold tabular-nums text-navy md:text-4xl">
          <span ref={einmaligRef}>{formatNum(einmaligValue)}</span>
          <span className="text-2xl font-bold text-ink/55"> €</span>
        </p>
        <p className="mt-1 text-xs text-ink/55">einmalig (netto)</p>

        <div className="mt-auto border-t border-outline pt-4">
          <p className="text-xs text-ink/65">
            Wartung ab Jahr 2:{" "}
            <span ref={wartungRef} className="font-semibold tabular-nums text-ink/85">
              {formatNum(wartungValue)}&nbsp;€
            </span>
            <span className="text-ink/55"> p.a.</span>
          </p>
        </div>
      </article>
    </Reveal>
  );
}
