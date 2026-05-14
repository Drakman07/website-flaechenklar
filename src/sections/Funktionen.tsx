import { funktionen } from "@/content/funktionen";
import { Reveal } from "@/components/Reveal";

export function Funktionen() {
  return (
    <section id="funktionen" className="bg-slate-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Funktionen
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Alles, was ein Aufmaß braucht.
            </h2>
            <p className="mt-4 text-base text-ink/70 md:text-lg">
              Entstanden im Bauamt. Geblieben für das Bauamt.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {funktionen.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <article className="group h-full rounded-lg border border-outline border-l-2 border-l-transparent bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-l-teal hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-teal/10 text-teal transition-colors group-hover:bg-teal/20">
                  <Icon size={20} />
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
