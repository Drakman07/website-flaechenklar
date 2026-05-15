import { faq } from "@/content/faq";
import { Reveal } from "@/components/Reveal";

export function FAQ() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Häufige Fragen
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Antworten auf das, was Bauämter zuerst fragen.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Von DSGVO bis Vollgeschoss-Modul — die Punkte, die im Erstgespräch
              regelmäßig auf den Tisch kommen.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-10 divide-y divide-outline border-y border-outline">
            {faq.map(({ q, a }) => (
              <li key={q}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-semibold text-navy md:text-lg">
                    <span>{q}</span>
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-block shrink-0 text-teal transition-transform duration-200 group-open:rotate-45"
                    >
                      {/* + Symbol als SVG für klare Anzeige */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M10 4v12M4 10h12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-ink/75 md:text-base">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
