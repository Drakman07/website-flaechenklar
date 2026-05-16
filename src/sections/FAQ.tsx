import { useState } from "react";
import { faq } from "@/content/faq";
import { Reveal } from "@/components/Reveal";
import { FOCUS_RING, LABEL, LEAD } from "@/components/ui/tokens";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div>
            <p className={LABEL}>Häufige Fragen</p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Antworten auf das, was Bauämter zuerst fragen.
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Von DSGVO bis Vollgeschoss-Modul — die Punkte, die im Erstgespräch
              regelmäßig auf den Tisch kommen.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-10 divide-y divide-outline border-y border-outline">
            {faq.map(({ q, a }, i) => {
              const isOpen = openIndex === i;
              return (
                <li key={q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={`group flex w-full items-start justify-between gap-6 py-5 text-left text-base font-semibold text-navy transition-colors hover:text-teal md:text-lg ${FOCUS_RING}`}
                  >
                    <span>{q}</span>
                    <span
                      aria-hidden="true"
                      className={`mt-1 inline-block shrink-0 text-teal transition-transform duration-300 ease-out ${
                        isOpen ? "rotate-45" : ""
                      } motion-reduce:transition-none`}
                    >
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
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p
                      className={`overflow-hidden text-sm text-ink/75 md:text-base ${
                        isOpen ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-200 motion-reduce:transition-none`}
                    >
                      {a}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
