import { Download } from "lucide-react";
import { argumente, argumenteHeroIcon as HeroIcon } from "@/content/argumente";
import { Reveal } from "@/components/Reveal";
import { TealUnderline } from "@/components/TealUnderline";
import {
  BTN_PRIMARY_ON_LIGHT,
  BTN_TERTIARY,
  CARD_ACCENT_BORDER,
  CARD_BASE,
  CARD_HOVER,
  CARD_HOVER_GLOW,
  ICON_SIZE,
  ICON_TILE,
  LABEL,
  LEAD,
} from "@/components/ui/tokens";

export function Argumente() {
  return (
    <section id="argumente" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className={LABEL}>Für den Gemeinderat</p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Sie sind überzeugt.{" "}
              <TealUnderline>Ihr Bürgermeister noch nicht?</TealUnderline>
            </h2>
            <p className={`mt-4 ${LEAD}`}>
              Der Praxisnutzen liegt für Sie auf der Hand — jetzt braucht es
              noch die drei, vier Sätze, die auch im Gemeinderat ziehen. Hier
              sind sie, zum Vorlesen oder Weiterreichen.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <article
            className={`mt-14 p-8 ${CARD_BASE} ${CARD_ACCENT_BORDER} ${CARD_HOVER} ${CARD_HOVER_GLOW}`}
          >
            <div className={`h-14 w-14 ${ICON_TILE}`}>
              <HeroIcon size={ICON_SIZE.hero} />
            </div>
            <p className="mt-4 text-sm font-semibold text-teal-ink">
              Der Satz, der beim <TealUnderline>Kämmerer</TealUnderline> zieht.
            </p>
            <h3 className="mt-2 text-xl font-semibold text-navy md:text-2xl">
              Herstellungsbeiträge sind Einnahmen — kein Kostenpunkt.
            </h3>
            <p className="mt-3 max-w-3xl text-base text-ink/75">
              Ohne belastbares Aufmaß gibt es keinen rechtssicheren Bescheid
              nach Art. 5 KAG Bayern. Was nicht abgerechnet wird, bleibt
              liegen — und die Festsetzungsfrist läuft mit. Dem gegenüber
              steht eine einmalige Anschaffung im Gegenwert weniger
              Ingenieurstunden, während schon ein einziges Abrechnungsgebiet
              die Beitragssumme oft in den fünf- bis sechsstelligen Bereich
              trägt.
            </p>
            <a
              href="#preise"
              className="mt-4 inline-block text-sm font-semibold text-teal-ink underline decoration-teal-ink/40 underline-offset-2 hover:decoration-teal-ink"
            >
              Zur Preisstaffel ↑
            </a>
          </article>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {argumente.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={180 + i * 70}>
              <article
                className={`group h-full p-6 ${CARD_BASE} ${CARD_ACCENT_BORDER} ${CARD_HOVER} ${CARD_HOVER_GLOW}`}
              >
                <div className={`h-10 w-10 ${ICON_TILE}`}>
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

        <Reveal delay={420}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/argumente-buergermeister.pdf"
              download
              className={`group ${BTN_PRIMARY_ON_LIGHT}`}
            >
              <Download size={ICON_SIZE.body} />
              Argumente als PDF herunterladen
            </a>
            <a href="#kontakt" className={BTN_TERTIARY}>
              Noch Fragen? Direkt schreiben
            </a>
          </div>
          <p className="mt-3 text-xs text-ink/55">
            Ein DIN-A4-Blatt zum Weiterreichen — ohne Preisangaben, damit es
            auch in der Sitzungsvorlage funktioniert.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
