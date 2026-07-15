/**
 * Stilisierter Bescheid-Entwurf fuer die Bescheid-Sektion — baut sich beim
 * Scrollen abschnittsweise auf (Betreff -> Beitragsberechnung ->
 * Rechtsbehelfsbelehrung). Zeigt bewusst NUR ein fiktives Beispiel, klar als
 * solches markiert — kein echter Rechtstext, keine echten Satzungsdaten.
 */
import { Reveal } from "@/components/Reveal";
import { useCountUp } from "@/hooks/useCountUp";

const BEISPIEL_GESCHOSSFLAECHE = "128,40 m²";
const BEISPIEL_BEITRAGSSATZ = "32,55 €/m²";
const BEISPIEL_BEITRAG = 4180;

function euro(n: number): string {
  return n.toLocaleString("de-DE");
}

export function BescheidAufbau() {
  const [betragRef, betragValue] = useCountUp<HTMLSpanElement>(
    BEISPIEL_BEITRAG,
    { durationMs: 1200, startDelayMs: 550 },
  );

  return (
    <div className="overflow-hidden rounded-lg border border-outline bg-white shadow-feature">
      <div className="flex items-center justify-between border-b border-outline bg-navy px-6 py-4 text-white">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal">
          Bescheid-Entwurf
        </span>
        <span className="text-[11px] text-white/50">Beispiel</span>
      </div>

      <div className="space-y-5 p-6">
        <Reveal>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              Betreff
            </p>
            <p className="mt-1 text-sm font-medium text-navy">
              Bescheid über den Herstellungsbeitrag nach Art. 5 KAG
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded border border-outline bg-slate-50/60 p-4 text-sm">
            <span className="text-ink/60">Geschossfläche</span>
            <span className="text-right font-mono tabular-nums text-navy">
              {BEISPIEL_GESCHOSSFLAECHE}
            </span>
            <span className="text-ink/60">Beitragssatz</span>
            <span className="text-right font-mono tabular-nums text-navy">
              {BEISPIEL_BEITRAGSSATZ}
            </span>
            <span className="col-span-2 mt-1 border-t border-outline pt-2 font-semibold text-navy">
              Beitrag
            </span>
            <span
              ref={betragRef}
              className="col-span-2 -mt-2 text-right font-mono text-lg font-bold tabular-nums text-teal-ink"
            >
              {euro(betragValue)} €
            </span>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              Rechtsbehelfsbelehrung
            </p>
            <div className="mt-2 space-y-1.5" aria-hidden="true">
              <div className="h-1.5 w-full rounded-full bg-ink/10" />
              <div className="h-1.5 w-5/6 rounded-full bg-ink/10" />
              <div className="h-1.5 w-2/3 rounded-full bg-ink/10" />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-outline bg-slate-50/60 px-6 py-3 text-xs text-ink/50">
        Beispieldaten zur Veranschaulichung — Prüfung und Erlass durch Ihre
        Gemeinde.
      </div>
    </div>
  );
}
