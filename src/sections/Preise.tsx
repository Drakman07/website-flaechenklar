import { preise } from "@/content/preise";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import {
  CARD_ACCENT_BORDER,
  CARD_HOVER,
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

        <Reveal delay={120}>
        <div className="mt-10 overflow-x-auto rounded-lg border border-outline bg-white shadow-card">
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
        </Reveal>

        <Reveal delay={200}>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div
            className={`rounded-lg border border-teal/30 bg-teal/5 p-6 shadow-card ${CARD_ACCENT_BORDER} ${CARD_HOVER}`}
          >
            <p className={LABEL}>Pilot-Kunde</p>
            <p className="mt-2 text-sm text-ink/80">
              50 % Rabatt auf den Listenpreis, Jahr 1 Wartung inklusive. Frühe
              Anwender erhalten direkten Draht zur Produktentwicklung.
            </p>
          </div>
          <div
            className={`rounded-lg border border-outline bg-white p-6 shadow-card ${CARD_ACCENT_BORDER} ${CARD_HOVER}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
              Wartung
            </p>
            <p className="mt-2 text-sm text-ink/80">
              10 % p.a. ab Jahr 2, jährlich kündbar. Enthält Updates,
              Rechtsanpassungen und E-Mail-Support.
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
