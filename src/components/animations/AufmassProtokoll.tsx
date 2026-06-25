/**
 * Aufmassprotokoll-Karte fuer die "Plan -> Protokoll"-Sequenz.
 *
 * Zeigt bewusst NUR Flaechen (m²): Teilflaechen und deren Summe. Keine
 * Beitrags-, Satzungs- oder Geldberechnung — das Tool gibt nur Flaechen aus.
 */
import { Fragment } from "react";
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

      <dl className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        {teilflaechen.map((t) => (
          <Fragment key={t.label}>
            <dt className="text-white/70">{t.label}</dt>
            <dd className="text-right font-mono tabular-nums text-white">
              {de2(t.m2)} m²
            </dd>
          </Fragment>
        ))}
      </dl>

      <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 border-t border-white/10 pt-4">
        <dt className="font-semibold text-white">Gesamtfläche</dt>
        <dd className="text-right font-mono font-semibold tabular-nums text-teal">
          {de2(gesamt)} m²
        </dd>
      </dl>

      <p className="mt-4 text-xs text-white/50">
        Beispieldaten zur Veranschaulichung.
      </p>
    </div>
  );
}
