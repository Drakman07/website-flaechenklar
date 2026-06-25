/**
 * Wiederverwendbare Tailwind-Klassen-Bundles.
 *
 * Tokens sind reine String-Konstanten — Tailwind sieht alle Klassennamen
 * im Source-Code und purged nichts.
 *
 * Verwendung:
 *   <button className={`${BTN_PRIMARY} ${FOCUS_RING}`}>…</button>
 */

// ---------- Cards ----------

export const CARD_BASE =
  "rounded-lg border border-outline bg-white shadow-card";

export const CARD_HOVER =
  "transition-all duration-200 ease-out hover:-translate-y-1 hover:border-l-teal hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Card-Hover mit zusaetzlichem teal-Glow.
 * Bewusst additive Klasse: kombiniert mit CARD_HOVER (nicht statt).
 * Glow nutzt exakt das Marken-Teal (hsl(var(--teal))), nicht ein
 * abweichendes rgba.
 */
export const CARD_HOVER_GLOW =
  "hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.10),0_0_24px_-8px_hsl(174_65%_42%/0.25)]";

export const CARD_HOVER_DARK =
  "transition-all duration-200 ease-out hover:-translate-y-1 hover:border-l-teal hover:bg-white/[0.07] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// Icon-Kachel in Cards: dezenter Hintergrund-Wechsel + minimaler Scale beim
// Gruppen-Hover. group-hover setzt eine `group`-Klasse am Card-Wrapper voraus.
export const ICON_TILE =
  "flex items-center justify-center rounded bg-teal/10 text-teal transition-[background-color,transform] duration-200 ease-out group-hover:bg-teal/20 group-hover:scale-[1.03] motion-reduce:transform-none";

// Funktionen/Sicherheit-Pattern: linke Border-Accent, transparent → teal
export const CARD_ACCENT_BORDER = "border-l-2 border-l-transparent";

// ---------- Focus-Rings (keyboard-only, sichtbar aber subtil) ----------

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const FOCUS_RING_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

// ---------- Buttons ----------

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded text-sm font-semibold transition-[background-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none";

export const BTN_PRIMARY = `${BTN_BASE} bg-teal px-5 py-3.5 text-white shadow-sm hover:bg-teal/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 ${FOCUS_RING_DARK}`;

export const BTN_PRIMARY_ON_LIGHT = `${BTN_BASE} bg-teal px-5 py-3.5 text-white shadow-sm hover:bg-teal/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 ${FOCUS_RING}`;

export const BTN_SECONDARY_ON_DARK = `${BTN_BASE} border border-white/25 px-5 py-3.5 text-white/90 hover:bg-white/5 ${FOCUS_RING_DARK}`;

export const BTN_TERTIARY = `${BTN_BASE} border border-teal/40 bg-teal/5 px-5 py-3 text-teal hover:bg-teal/10 ${FOCUS_RING}`;

// Kompaktere Nav-Variante (kleineres Padding)
export const BTN_PRIMARY_COMPACT = `${BTN_BASE} bg-teal px-4 py-2 text-white shadow-sm hover:bg-teal/90 ${FOCUS_RING}`;

// ---------- Typography ----------

export const LABEL =
  "text-xs font-semibold uppercase tracking-wider text-teal";

// Editorial-Ueberschriften (Groesse/Zeilenhoehe/Tracking/Gewicht stecken im
// fontSize-Token). Farbe setzt der Aufrufer je Kontext (navy bzw. weiss).
export const H1 = "text-h1";
export const H2 = "text-h2";
export const H3 = "text-h3";

export const LEAD = "text-lead text-ink/70";
export const LEAD_ON_DARK = "text-lead text-white/75";
export const BODY = "text-body text-ink/75";

// Zwischenstufe Label → H2: subtiler Eyebrow, bewusst kein font-bold
export const EYEBROW = "mt-2 text-lg font-medium text-ink/65 md:text-xl";

// ---------- Icon-Größen-System ----------

export const ICON_SIZE = {
  /** Bullet-Triangles, Inline-Hints (≤ 16px) */
  inline: 14,
  /** Standard Body-Icons (Bullets, Hints in Listen) */
  body: 18,
  /** Feature-Card-Icons, Demo-Cards, Form-Icons */
  feature: 22,
  /** Hero-Card-Icons (Bento-Featured), Success-Icons */
  hero: 28,
} as const;

// ---------- Form-Inputs auf Navy ----------

export const INPUT_ON_DARK =
  `w-full rounded border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 ` +
  `focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/50 ` +
  `disabled:opacity-60`;
