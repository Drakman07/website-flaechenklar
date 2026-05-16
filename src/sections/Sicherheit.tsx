import { sicherheit } from "@/content/sicherheit";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import {
  CARD_ACCENT_BORDER,
  CARD_BASE,
  CARD_HOVER,
  ICON_SIZE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

export function Sicherheit() {
  return (
    <section id="sicherheit" className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-2">
          <p className={LABEL}>Sicherheit & Datenschutz</p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Bauherrendaten verlassen nie den{" "}
            <TealUnderline>Rechner</TealUnderline>.
          </h2>
          <p className={`mt-4 ${LEAD}`}>
            Kein Cloud-Service, kein Account, kein Tracking. Genau so, wie der
            Datenschutzbeauftragte es haben will.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
          {sicherheit.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <article
                className={`group h-full p-6 ${CARD_BASE} ${CARD_ACCENT_BORDER} ${CARD_HOVER}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-navy/5 text-navy transition-colors group-hover:bg-teal/15 group-hover:text-teal">
                  <Icon size={ICON_SIZE.feature} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
