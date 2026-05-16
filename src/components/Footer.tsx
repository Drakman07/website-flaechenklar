import iconUrl from "@/assets/logo-icon.svg";
import { FOCUS_RING_DARK } from "@/components/ui/tokens";

export function Footer() {
  return (
    <footer className="bg-navy-deep px-6 py-12 text-center text-white/60">
      <a
        href="#top"
        className={`inline-flex items-center justify-center rounded ${FOCUS_RING_DARK}`}
        aria-label="FlächenKlar — Startseite"
      >
        <img src={iconUrl} alt="FlächenKlar" className="h-12 w-12" />
      </a>
      <p className="mt-3 text-sm text-white/60">
        Das Aufmaß-Werkzeug für den digitalen Bauantrag
      </p>
      <nav
        aria-label="Rechtliches"
        className="mt-6 flex justify-center gap-6 text-sm"
      >
        <a
          href="/impressum"
          className={`rounded-sm transition-colors hover:text-white ${FOCUS_RING_DARK}`}
        >
          Impressum
        </a>
        <a
          href="/datenschutz"
          className={`rounded-sm transition-colors hover:text-white ${FOCUS_RING_DARK}`}
        >
          Datenschutz
        </a>
      </nav>
      <p className="mt-4 text-xs text-white/60">© 2026 Alexander Geitner</p>
    </footer>
  );
}
