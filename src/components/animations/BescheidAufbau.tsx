/**
 * Near-realistic Bescheid-Entwurf-Mockup fuer die Bescheid-Sektion — baut
 * sich beim Scrollen abschnittsweise auf (Anschrift -> Betreff -> Tenor ->
 * Beitragsberechnung -> Rechtsbehelfsbelehrung), angelehnt an den DIN-5008-
 * Aufbau eines echten Bescheids. Zeigt bewusst NUR ein fiktives Beispiel mit
 * generischen Platzhalter-Namen (Musterhausen/Mustermann, projektweite
 * Test-Daten-Konvention) — kein echter Rechtstext, keine echten
 * Satzungsdaten, keine echte Gemeinde.
 */
import { Reveal } from "@/components/Reveal";
import { useCountUp } from "@/hooks/useCountUp";

const BEISPIEL_GRUNDSTUECKSFLAECHE = "620 m²";
const BEISPIEL_GESCHOSSFLAECHE = "128,40 m²";
const BEISPIEL_BEITRAGSSATZ = "32,55 €/m²";
const BEISPIEL_BEITRAG = 4180;

function euro(n: number): string {
  return n.toLocaleString("de-DE");
}

export function BescheidAufbau() {
  const [betragRef, betragValue] = useCountUp<HTMLSpanElement>(
    BEISPIEL_BEITRAG,
    { durationMs: 1200, startDelayMs: 650 },
  );

  return (
    <div className="overflow-hidden rounded-lg border border-outline bg-white shadow-feature">
      <div className="flex items-center justify-between border-b border-outline bg-navy px-6 py-4 text-white">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal">
          Bescheid-Entwurf
        </span>
        <span className="text-[11px] text-white/50">Beispiel</span>
      </div>

      <div className="space-y-4 p-6 text-[13px] leading-relaxed text-ink/75">
        <Reveal>
          <div className="flex items-start justify-between gap-4 text-[11px] text-ink/40">
            <p>Gemeinde Musterhausen · Bauamt</p>
            <div className="text-right tabular-nums">
              <p>Az. 60-118/2026</p>
              <p>15.07.2026</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="inline-block rounded border border-outline/60 px-3 py-2 text-ink/65">
            <p>Frau Erika Mustermann</p>
            <p>Musterweg 4</p>
            <p>92318 Neumarkt i.d.OPf.</p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div>
            <p className="font-semibold text-navy">
              Bescheid über den Herstellungsbeitrag nach Art. 5 KAG
            </p>
            <p className="mt-0.5 text-[12px] text-ink/50">
              für das Grundstück Fl.-Nr. 456/2, Gemarkung Musterhausen
            </p>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="text-ink/65">
            Sehr geehrte Frau Mustermann, für die Herstellung der
            öffentlichen Entwässerungseinrichtung wird auf Grundlage der
            gemeindlichen Beitrags- und Gebührensatzung folgender
            Herstellungsbeitrag festgesetzt:
          </p>
        </Reveal>

        <Reveal delay={440}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded border border-outline bg-slate-50/60 p-4 text-[12.5px]">
            <span className="text-ink/55">Grundstücksfläche</span>
            <span className="text-right font-mono tabular-nums text-navy">
              {BEISPIEL_GRUNDSTUECKSFLAECHE}
            </span>
            <span className="text-ink/55">Geschossfläche</span>
            <span className="text-right font-mono tabular-nums text-navy">
              {BEISPIEL_GESCHOSSFLAECHE}
            </span>
            <span className="text-ink/55">Beitragssatz</span>
            <span className="text-right font-mono tabular-nums text-navy">
              {BEISPIEL_BEITRAGSSATZ}
            </span>
            <span className="col-span-2 mt-1 border-t border-outline pt-2 font-semibold text-navy">
              Festgesetzter Beitrag
            </span>
            <span
              ref={betragRef}
              className="col-span-2 -mt-1.5 text-right font-mono text-lg font-bold tabular-nums text-teal-ink"
            >
              {euro(betragValue)} €
            </span>
          </div>
        </Reveal>

        <Reveal delay={620}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              Rechtsbehelfsbelehrung
            </p>
            <p className="mt-1 text-[12px] text-ink/50">
              Gegen diesen Bescheid kann innerhalb eines Monats nach
              Bekanntgabe Widerspruch erhoben werden.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-outline bg-slate-50/60 px-6 py-3 text-xs text-ink/50">
        Fiktive Beispieldaten zur Veranschaulichung — Prüfung, Unterschrift
        und Erlass durch Ihre Gemeinde.
      </div>
    </div>
  );
}
