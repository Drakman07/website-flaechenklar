export function ProblemChance() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Der digitale Bauantrag ist da. Das Lineal nicht.
          </h2>
          <p className="mt-6 text-base text-ink/80 md:text-lg">
            Seit 1. Januar 2025 kommen Bauanträge in bayerischen Bauämtern
            digital. Pläne als PDF, Stempel als Signatur, alles paperless. Nur
            das Aufmaß für den Herstellungsbeitrag — das hängt weiterhin am
            ausgedruckten Plan, am Lineal, an der Hand-Berechnung.
          </p>
          <p className="mt-4 text-base text-ink/80 md:text-lg">
            FlächenKlar ändert das. PDF rein, Polygon ziehen, fertig — und
            falsch gezogen? Einfach neu zeichnen, nicht neu anfangen.
          </p>
        </div>

        <div className="rounded-lg border border-outline bg-slate-50 p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Die Chance
          </p>
          <h3 className="mt-3 text-2xl font-bold text-navy md:text-3xl">
            PDF rein, Aufmaßprotokoll raus.
          </h3>
          <p className="mt-4 text-ink/80">
            Ein Werkzeug, das genau dort ansetzt, wo der digitale Bauantrag
            aufhört: am rechtssicheren Aufmaß. Direkt aus dem PDF, ohne Druck,
            ohne Excel, ohne CAD-Lizenz.
          </p>
        </div>
      </div>
    </section>
  );
}
