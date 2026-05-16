import { Triangle, CircleCheck } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import { useCountUp } from "@/hooks/useCountUp";
import {
  useAnimVariant,
  variantAtLeast,
} from "@/hooks/useAnimVariant";
import { ICON_SIZE, LABEL } from "@/components/ui/tokens";

const bullets = [
  "SVG-Diagramme: Grundriss, Aufrisse, Querschnitt — live mitwachsend",
  "Gauben links/rechts mit Breite, Trauf- und Ortgangabstand",
  "Abzüge A_kleiner und A_größer für Sonderfälle",
  "Plausibilitätsprüfung gegen das gezeichnete Polygon",
];

const inputs = [
  { label: "Gebäudebreite L_B", value: "11,79 m" },
  { label: "Gebäudelänge L_L", value: "14,20 m" },
  { label: "Kniestock h_KL / h_KR", value: "0,85 m / 0,85 m" },
  { label: "Dachneigung α_L / α_R", value: "38° / 38°" },
];

type ResultRow = {
  label: string;
  numeric: number;
  decimals: number;
  unit: string;
  highlight?: boolean;
};

const results: ResultRow[] = [
  { label: "Grundfläche A_G", numeric: 167.42, decimals: 2, unit: " m²" },
  { label: "Fläche ≥ 2,30 m", numeric: 122.3, decimals: 2, unit: " m²" },
  { label: "Anteil", numeric: 73.1, decimals: 1, unit: " %", highlight: true },
];

export function Vollgeschoss() {
  return (
    <section
      id="vollgeschoss"
      className="relative overflow-hidden bg-navy text-white"
    >
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <Reveal>
        <div>
          <p className={LABEL}>Spezial · Dachgeschoss</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Vollgeschoss-Modul nach{" "}
            <TealUnderline>Art. 83 Abs. 7 BayBO</TealUnderline>.
          </h2>
          <p className="mt-6 text-white/75 md:text-lg">
            Genau die Berechnung, die bei jedem Dachgeschoss-Bauantrag in
            Bayern fällig ist — als interaktives Modul direkt im Tool.
            Eingaben: Gebäudemaße, Kniestockhöhen, Dachneigungen, Gauben.
            Ergebnis: Anteil mit lichter Höhe ≥ 2,30 m und die 2/3-Schwelle
            für die Vollgeschoss-Eigenschaft.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Triangle
                  className="mt-1 shrink-0 text-teal"
                  size={ICON_SIZE.inline}
                  strokeWidth={2}
                />
                <span className="text-sm text-white/80 md:text-base">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        </Reveal>

        <Reveal delay={120}>
        <div className="relative rounded-lg border border-white/15 bg-white/5 p-6 shadow-feature md:p-8">
          <p className={LABEL}>Beispiel-Berechnung</p>

          <dl className="mt-5 space-y-2 text-sm">
            {inputs.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-white/70">{row.label}</dt>
                <dd className="font-mono tabular-nums text-white">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-white/10 pt-5">
            <dl className="space-y-2 text-sm">
              {results.map((row, i) => (
                <ResultRowDisplay key={row.label} row={row} index={i} />
              ))}
            </dl>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded border border-teal/40 bg-teal/10 px-4 py-2 text-sm text-teal">
            <CircleCheck size={ICON_SIZE.body} />
            Vollgeschoss-Eigenschaft erfüllt (&gt; 2/3)
          </div>

          <p className="mt-3 text-xs text-white/50">
            Beispieldaten zur Veranschaulichung.
          </p>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Eine einzelne Ergebnis-Zeile mit optionaler Counter-Animation.
 * - Variante A: zeigt den Endwert sofort
 * - Variante B/C: zaehlt von 0 hoch (staggered je nach Index)
 */
function ResultRowDisplay({
  row,
  index,
}: {
  row: ResultRow;
  index: number;
}) {
  const variant = useAnimVariant();
  const enableCounter = variantAtLeast(variant, "b");

  // Skalieren auf Integer fuer die Animation, dann zurueck-formatieren.
  // (useCountUp hat zwar `decimals`, das gibt aber gerundete Zwischenwerte
  // zurueck. Wir machen die Skalierung selbst fuer volle Kontrolle.)
  const factor = Math.pow(10, row.decimals);
  const target = Math.round(row.numeric * factor);

  const [ref, intValue] = useCountUp<HTMLSpanElement>(target, {
    enabled: enableCounter,
    durationMs: 1000,
    startDelayMs: 200 + index * 200,
  });

  const display = (intValue / factor).toLocaleString("de-DE", {
    minimumFractionDigits: row.decimals,
    maximumFractionDigits: row.decimals,
  });

  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/70">{row.label}</dt>
      <dd
        ref={ref}
        className={`font-mono tabular-nums ${
          row.highlight ? "font-semibold text-teal" : "text-white"
        }`}
      >
        {display}
        {row.unit}
      </dd>
    </div>
  );
}
