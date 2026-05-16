import { Menu } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import logoUrl from "@/assets/logo.svg";
import { navigate, useRoute } from "@/router";
import {
  BTN_PRIMARY_COMPACT,
  FOCUS_RING,
  ICON_SIZE,
} from "@/components/ui/tokens";

const links = [
  { href: "#funktionen", label: "Funktionen" },
  { href: "#vollgeschoss", label: "Vollgeschoss" },
  { href: "#sicherheit", label: "Sicherheit" },
  { href: "#preise", label: "Preise" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>): void {
  const href = e.currentTarget.getAttribute("href") ?? "";
  // Wenn auf /tour, dann erst zur Home navigieren und dann scrollen
  if (href.startsWith("#") && window.location.pathname !== "/") {
    e.preventDefault();
    const hash = href.slice(1);
    navigate("/");
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }
  // Burger-Menü schließen falls offen (no-op auf Desktop)
  e.currentTarget.closest("details")?.removeAttribute("open");
}

function useActiveSection(enabled: boolean): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveId(null);
      return;
    }

    const sectionIds = links.map((l) => l.href.slice(1));
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    if (nodes.length === 0) return;

    // rootMargin: -80px oben (Nav-Höhe + Buffer), -55% unten — Section gilt
    // als aktiv sobald sie das obere Drittel des Viewports erreicht.
    const observer = new IntersectionObserver(
      (entries) => {
        // Aktiv ist die zuletzt eingetretene Section. Wir tracken alle.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [enabled]);

  return activeId;
}

export function Nav() {
  const route = useRoute();
  const activeId = useActiveSection(route === "home");

  return (
    <header className="sticky top-0 z-50 border-b border-outline bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          onClick={handleAnchorClick}
          className={`flex items-center rounded ${FOCUS_RING}`}
          aria-label="FlächenKlar — Startseite"
        >
          <img src={logoUrl} alt="FlächenKlar" className="h-9 w-auto" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={handleAnchorClick}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-sm text-sm transition-colors hover:text-navy after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:origin-left after:bg-teal after:transition-transform after:duration-300 after:content-[''] motion-reduce:after:transition-none ${FOCUS_RING} ${
                  isActive
                    ? "font-semibold text-navy after:scale-x-100"
                    : "text-ink/70 after:scale-x-0"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="#kontakt"
            onClick={handleAnchorClick}
            className={BTN_PRIMARY_COMPACT}
          >
            Demo anfragen
          </a>
        </nav>

        <details className="relative md:hidden">
          <summary
            aria-label="Menü öffnen"
            className={`flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded text-navy hover:bg-outline/40 ${FOCUS_RING}`}
          >
            <Menu size={ICON_SIZE.feature} />
          </summary>
          <div className="absolute right-0 top-12 w-56 rounded border border-outline bg-white p-2 shadow-card">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={handleAnchorClick}
                className={`block rounded px-3 py-3 text-sm text-ink hover:bg-outline/40 ${FOCUS_RING}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={handleAnchorClick}
              className={`mt-2 block w-full bg-teal px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal/90 rounded ${FOCUS_RING}`}
            >
              Demo anfragen
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
