import { funktionen } from "@/content/funktionen";
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

export function Funktionen() {
  const [featured, ...rest] = funktionen;

  return (
    <section id="funktionen" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>Funktionen</p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Alles, was ein Aufmaß <TealUnderline>braucht</TealUnderline>.
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Entstanden im Bauamt. Geblieben für das Bauamt.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured: spannt 2 Spalten auf Desktop, größere Card */}
          {featured && (
            <Reveal key={featured.title}>
              <article
                className={`group h-full p-8 lg:col-span-2 ${CARD_BASE} ${CARD_ACCENT_BORDER} ${CARD_HOVER}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
                  <featured.icon size={ICON_SIZE.hero} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy md:text-2xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-base text-ink/75">{featured.text}</p>
              </article>
            </Reveal>
          )}

          {rest.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i + 1) * 70}>
              <article
                className={`group h-full p-6 ${CARD_BASE} ${CARD_ACCENT_BORDER} ${CARD_HOVER}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
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
