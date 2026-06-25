/**
 * Aufmassprotokoll-Karte fuer die "Plan -> Protokoll"-Sequenz.
 *
 * Zeigt bewusst NUR Flaechen (m²): Teilflaechen und deren Summe. Keine
 * Beitrags-, Satzungs- oder Geldberechnung — das Tool gibt nur Flaechen aus.
 */
import { LABEL } from "@/components/ui/tokens";

type Teilflaeche = { label: string; m2: number };

function de2(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function AufmassProtokoll({
  teilflaechen,
  gesamt,
}: {
  teilflaechen: readonly Teilflaeche[];
  gesamt: number;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-6 shadow-feature">
      <p className={LABEL}>Aufmaßprotokoll</p>
      <p className="mt-1 text-sm text-white/50">Beispiel-Auswertung · Plan 1:100</p>

      <dl className="mt-5 space-y-2 text-sm">
        {teilflaechen.map((t) => (
          <div key={t.label} className="flex justify-between gap-4">
            <dt className="text-white/70">{t.label}</dt>
            <dd className="font-mono tabular-nums text-white">{de2(t.m2)} m²</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex justify-between gap-4 border-t border-white/10 pt-4">
        <dt className="font-semibold text-white">Gesamtfläche</dt>
        <dd className="font-mono font-semibold tabular-nums text-teal">
          {de2(gesamt)} m²
        </dd>
      </div>

      <p className="mt-4 text-xs text-white/50">
        Beispieldaten zur Veranschaulichung.
      </p>
    </div>
  );
}
