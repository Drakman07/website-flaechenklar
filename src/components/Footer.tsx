export function Footer() {
  return (
    <footer className="bg-navy-deep px-6 py-12 text-center text-white/60">
      <a href="#top" className="text-base font-bold text-white">
        Flächen<span className="text-teal">Klar</span>
      </a>
      <p className="mt-2 text-sm text-white/60">
        Das Aufmaß-Werkzeug für den digitalen Bauantrag
      </p>
      <nav
        aria-label="Rechtliches"
        className="mt-6 flex justify-center gap-6 text-sm"
      >
        <a href="/impressum" className="hover:text-white">
          Impressum
        </a>
        <a href="/datenschutz" className="hover:text-white">
          Datenschutz
        </a>
      </nav>
      <p className="mt-4 text-xs text-white/60">© 2026 Alexander Geitner</p>
    </footer>
  );
}
