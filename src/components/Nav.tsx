import { Menu } from "lucide-react";

const links = [
  { href: "#funktionen", label: "Funktionen" },
  { href: "#vollgeschoss", label: "Vollgeschoss" },
  { href: "#sicherheit", label: "Sicherheit" },
  { href: "#preise", label: "Preise" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-lg font-bold tracking-tight text-navy">
          Flächen<span className="text-teal">Klar</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink/70 hover:text-navy"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="rounded bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal/90"
          >
            Demo anfragen
          </a>
        </nav>

        <details className="relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded text-navy hover:bg-outline/40">
            <Menu size={20} />
          </summary>
          <div className="absolute right-0 top-12 w-56 rounded border border-outline bg-white p-2 shadow-lg">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block rounded px-3 py-2 text-sm text-ink hover:bg-outline/40"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="mt-2 block rounded bg-teal px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Demo anfragen
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
