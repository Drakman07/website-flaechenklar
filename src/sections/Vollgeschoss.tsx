import { BlueprintGrid } from "@/components/BlueprintGrid";

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
            Vollgeschoss-Logik
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Art. 2 BayBO — automatisch geprüft.
          </h2>
          <p className="mt-6 text-white/75 md:text-lg">
            Das Tool kennt die Vollgeschossdefinition der Bayerischen
            Bauordnung: mindestens zwei Drittel der Brutto-Grundfläche müssen
            über dem Gelände liegen und mindestens 2,30 m hoch sein. FlächenKlar
            prüft das pro Geschoss automatisch und kennzeichnet im Protokoll,
            was als Vollgeschoss zählt — und was nicht.
          </p>
        </div>

        <div className="rounded-lg border border-white/15 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Beispiel
          </p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="py-2 text-left font-medium">Geschoss</th>
                <th className="py-2 text-right font-medium">Fläche</th>
                <th className="py-2 text-right font-medium">Vollgeschoss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2">Keller</td>
                <td className="py-2 text-right">112 m²</td>
                <td className="py-2 text-right text-white/50">nein</td>
              </tr>
              <tr>
                <td className="py-2">EG</td>
                <td className="py-2 text-right">142 m²</td>
                <td className="py-2 text-right text-teal">ja</td>
              </tr>
              <tr>
                <td className="py-2">OG</td>
                <td className="py-2 text-right">138 m²</td>
                <td className="py-2 text-right text-teal">ja</td>
              </tr>
              <tr>
                <td className="py-2">DG</td>
                <td className="py-2 text-right">96 m²</td>
                <td className="py-2 text-right text-white/50">nein</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="py-3 font-semibold">Anrechenbare GF</td>
                <td colSpan={2} className="py-3 text-right font-semibold text-teal">
                  280 m²
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
