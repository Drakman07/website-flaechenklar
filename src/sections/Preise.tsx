import { preise } from "@/content/preise";

export function Preise() {
  return (
    <section id="preise" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Preise
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Klar gestaffelt nach Einwohnerklasse.
          </h2>
          <p className="mt-4 text-base text-ink/70 md:text-lg">
            Einmalkauf nach Einwohnerklasse. Wartung im ersten Jahr inklusive,
            ab dem zweiten Jahr 10 % p. a., jährlich kündbar.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-lg border border-outline bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-ink/60">
              <tr>
                <th className="px-6 py-4">Einwohnerklasse</th>
                <th className="px-6 py-4 text-right">Einmalig (netto)</th>
                <th className="px-6 py-4 text-right">Wartung ab Jahr 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {preise.map((p) => (
                <tr key={p.einwohner}>
                  <td className="px-6 py-4 font-medium text-navy">
                    {p.einwohner}
                  </td>
                  <td className="px-6 py-4 text-right text-ink">{p.einmalig}</td>
                  <td className="px-6 py-4 text-right text-ink/70">
                    {p.wartung}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-teal/30 bg-teal/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Pilot-Kunde
            </p>
            <p className="mt-2 text-sm text-ink/80">
              50 % Rabatt auf den Listenpreis, Jahr 1 Wartung inklusive. Frühe
              Anwender erhalten direkten Draht zur Produktentwicklung.
            </p>
          </div>
          <div className="rounded-lg border border-outline bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
              Wartung
            </p>
            <p className="mt-2 text-sm text-ink/80">
              10 % p.a. ab Jahr 2, jährlich kündbar. Enthält Updates,
              Rechtsanpassungen und E-Mail-Support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
