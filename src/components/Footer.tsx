import iconUrl from "@/assets/logo-icon.svg";
import { FOCUS_RING_DARK } from "@/components/ui/tokens";
import {
  setAnimVariant,
  useAnimVariant,
  type AnimVariant,
} from "@/hooks/useAnimVariant";

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

      <VariantSwitcher />
    </footer>
  );
}

/**
 * Dezenter Animations-Variant-Switcher fuer die User-Vergleichsphase.
 * Wird nach Entscheidung wieder entfernt (Cleanup-Commit).
 * URL-Param + localStorage halten die Wahl persistent.
 */
function VariantSwitcher() {
  const active = useAnimVariant();
  const variants: { id: AnimVariant; label: string; desc: string }[] = [
    { id: "a", label: "A", desc: "Subtil (Linear/Stripe)" },
    { id: "b", label: "B", desc: "Markant (Vercel)" },
    { id: "c", label: "C", desc: "Maximal (Awwwards)" },
  ];

  return (
    <div className="mt-10 border-t border-white/10 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        Animations-Variante (Vorschau)
      </p>
      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] p-1">
        {variants.map((v) => {
          const isActive = active === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setAnimVariant(v.id)}
              aria-pressed={isActive}
              title={v.desc}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${FOCUS_RING_DARK} ${
                isActive
                  ? "bg-teal text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-white/40">
        {variants.find((v) => v.id === active)?.desc ?? ""}
      </p>
    </div>
  );
}
