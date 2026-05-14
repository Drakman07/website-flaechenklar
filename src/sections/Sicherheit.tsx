import { sicherheit } from "@/content/sicherheit";

export function Sicherheit() {
  return (
    <section id="sicherheit" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Sicherheit & Datenschutz
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            Sechs Punkte, die wichtig sind.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sicherheit.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-outline bg-white p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-navy/5 text-navy">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm text-ink/70">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
