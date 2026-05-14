import { Triangle, CircleCheck } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";

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

const results = [
  { label: "Grundfläche A_G", value: "167,42 m²" },
  { label: "Fläche ≥ 2,30 m", value: "122,30 m²" },
  { label: "Anteil", value: "73,1 %" },
];

export function Vollgeschoss() {
  return (
    <section
      id="vollgeschoss"
      className="relative overflow-hidden bg-navy text-white"
    >
      <BlueprintGrid />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Spezial · Dachgeschoss
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Vollgeschoss-Modul nach Art. 83 Abs. 7 BayBO.
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
                  size={16}
                  strokeWidth={2}
                />
                <span className="text-sm text-white/80 md:text-base">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-white/15 bg-white/5 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Beispiel-Berechnung
          </p>

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
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-white/70">{row.label}</dt>
                  <dd
                    className={`font-mono tabular-nums ${
                      i === results.length - 1
                        ? "font-semibold text-teal"
                        : "text-white"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded border border-teal/40 bg-teal/10 px-4 py-2 text-sm text-teal">
            <CircleCheck size={16} />
            Vollgeschoss-Eigenschaft erfüllt (&gt; 2/3)
          </div>

          <p className="mt-3 text-xs text-white/50">
            Beispieldaten zur Veranschaulichung.
          </p>
        </div>
      </div>
    </section>
  );
}
