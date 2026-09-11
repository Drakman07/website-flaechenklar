import type { MouseEvent } from "react";
import { Mail, Phone } from "lucide-react";
import iconUrl from "@/assets/logo-icon.svg";
import { navigate, type RoutePath } from "@/router";
import {
  FOCUS_RING_DARK,
  ICON_SIZE,
  LABEL_ON_DARK,
} from "@/components/ui/tokens";

/** Kontaktdaten wie im Organization-JSON-LD in index.html. */
const EMAIL = "info@flaechenklar.de";
const TELEFON_HREF = "tel:+4915161481639";
const TELEFON_ANZEIGE = "0151 614 816 39";

const PRODUKT_LINKS: ReadonlyArray<
  { label: string; anchor: string } | { label: string; route: RoutePath }
> = [
  { label: "Funktionen", anchor: "funktionen" },
  { label: "Bescheid-Modul", anchor: "bescheid" },
  { label: "Preise", anchor: "preise" },
  { label: "Häufige Fragen", anchor: "faq" },
  { label: "Tour in 4 Kapiteln", route: "/tour" },
  { label: "Tutorial", route: "/tutorial" },
  { label: "Versionsverlauf", route: "/versionen" },
];

const LINK_CLS = `rounded-sm transition-colors hover:text-white ${FOCUS_RING_DARK}`;

/** Router-Link ohne Vollreload; auf derselben Route nach oben scrollen. */
function handleRouteClick(to: RoutePath) {
  return (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (window.location.pathname === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(to);
  };
}

/** Section-Anker: von Unterseiten erst zur Startseite, dann scrollen (wie Nav). */
function handleAnchorClick(anchor: string) {
  return (e: MouseEvent<HTMLAnchorElement>): void => {
    if (window.location.pathname === "/") return;
    e.preventDefault();
    navigate("/");
    window.setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };
}

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-12 pt-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a
            href="/"
            onClick={handleRouteClick("/")}
            className={`inline-flex items-center gap-3 rounded ${FOCUS_RING_DARK}`}
          >
            <img src={iconUrl} alt="" className="h-10 w-10" />
            <span className="text-lg font-semibold text-white">FlächenKlar</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Vom Aufmaß zum Bescheid-Entwurf. Für bayerische Bauämter, komplett
            offline.
          </p>
        </div>

        <nav aria-label="Footer-Navigation">
          <p className={LABEL_ON_DARK}>Produkt</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PRODUKT_LINKS.map((l) =>
              "route" in l ? (
                <li key={l.label}>
                  <a href={l.route} onClick={handleRouteClick(l.route)} className={LINK_CLS}>
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.label}>
                  <a
                    href={`#${l.anchor}`}
                    onClick={handleAnchorClick(l.anchor)}
                    className={LINK_CLS}
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div>
          <p className={LABEL_ON_DARK}>Kontakt</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`mailto:${EMAIL}`} className={`inline-flex items-center gap-2.5 ${LINK_CLS}`}>
                <Mail size={ICON_SIZE.inline} className="shrink-0 text-teal" aria-hidden="true" />
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={TELEFON_HREF} className={`inline-flex items-center gap-2.5 ${LINK_CLS}`}>
                <Phone size={ICON_SIZE.inline} className="shrink-0 text-teal" aria-hidden="true" />
                {TELEFON_ANZEIGE}
              </a>
            </li>
          </ul>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/60">
            Antwort in der Regel innerhalb eines Werktags.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Alexander Geitner</p>
          <nav aria-label="Rechtliches" className="flex gap-6">
            <a href="/impressum" className={LINK_CLS}>
              Impressum
            </a>
            <a href="/datenschutz" className={LINK_CLS}>
              Datenschutz
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
