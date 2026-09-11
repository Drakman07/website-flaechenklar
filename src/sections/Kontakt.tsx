import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { Reveal } from "@/components/Reveal";
import {
  BTN_PRIMARY,
  FOCUS_RING_DARK,
  H2,
  ICON_SIZE,
  INPUT_ON_DARK,
} from "@/components/ui/tokens";

const ANLIEGEN_OPTIONS = ["Demo", "Angebot", "Frage"] as const;

/**
 * Formspree-Endpoint fuer das Kontaktformular.
 *
 * TODO (Alexander): Im Formspree-Dashboard ein neues Form fuer flaechenklar.de
 * anlegen, die Form-ID hier eintragen (8 Zeichen, z.B. "xxxxxxxx").
 * Pattern wie bei geitnervideoproduktion.de ("mnjwjknz").
 * Solange der Platzhalter steht, schlaegt der Submit clientseitig fehl mit
 * Fehlermeldung — kein Daten-Leck.
 *
 * Doku: https://formspree.io/forms/<form-id>/integration
 */
const FORMSPREE_FORM_ID = "mjglqzyz";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

type FormState = {
  behoerde: string;
  einwohner: string;
  anliegen: string;
  bescheidInteresse: boolean;
  ansprechpartner: string;
  email: string;
  telefon: string;
  nachricht: string;
};

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; email?: string }
  | { kind: "error"; message: string };

/** Pflichtfelder, in Anzeige-Reihenfolge (erstes fehlerhaftes Feld bekommt den Fokus). */
const PFLICHTFELDER = ["behoerde", "einwohner", "ansprechpartner", "email"] as const;
type Pflichtfeld = (typeof PFLICHTFELDER)[number];
type FeldFehler = Partial<Record<Pflichtfeld, string>>;

const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: FormState): FeldFehler {
  const fehler: FeldFehler = {};
  if (!f.behoerde.trim()) fehler.behoerde = "Bitte Behörde angeben.";
  if (!f.einwohner) fehler.einwohner = "Bitte Einwohnerzahl wählen.";
  if (!f.ansprechpartner.trim())
    fehler.ansprechpartner = "Bitte Ansprechpartner angeben.";
  if (!f.email.trim()) {
    fehler.email = "Bitte E-Mail-Adresse angeben.";
  } else if (!EMAIL_MUSTER.test(f.email.trim())) {
    fehler.email = "E-Mail-Adresse ungültig, Beispiel: name@gemeinde.de";
  }
  return fehler;
}

/** Inline-Fehlertext unter einem Feld, per aria-describedby verknuepft. */
function FeldFehlerText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-200">
      <CircleAlert size={12} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      {text}
    </p>
  );
}

/** Zusatzklasse fuer ungueltige Felder (! schlaegt die Border aus INPUT_ON_DARK). */
const INVALID_CLS = "!border-red-300/80";

const initial: FormState = {
  behoerde: "",
  einwohner: "",
  anliegen: "Demo",
  bescheidInteresse: false,
  ansprechpartner: "",
  email: "",
  telefon: "",
  nachricht: "",
};

const inputCls = INPUT_ON_DARK;

export function Kontakt() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });
  const [errors, setErrors] = useState<FeldFehler>({});
  // Fehler erst nach dem ersten Absende-Versuch zeigen, danach live
  // nachfuehren (Meldung verschwindet, sobald das Feld stimmt).
  const [versucht, setVersucht] = useState(false);

  const update =
    (k: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const next = { ...form, [k]: e.target.value };
      setForm(next);
      if (versucht) setErrors(validate(next));
    };

  // Bescheid-CTAs (z.B. in der Bescheid-Sektion) feuern dieses Event statt
  // eines Router-Umbaus — schlankste Variante fuer die Vorbelegung.
  useEffect(() => {
    const onBescheidInteresse = () => {
      setForm((f) => ({ ...f, anliegen: "Demo", bescheidInteresse: true }));
    };
    window.addEventListener("fk-bescheid-interesse", onBescheidInteresse);
    return () =>
      window.removeEventListener("fk-bescheid-interesse", onBescheidInteresse);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "submitting") return;

    // Honeypot: wenn das versteckte Feld ausgefuellt ist, ist das ein Bot.
    // Wir tun so, als waere alles OK, senden aber nichts.
    const formEl = e.currentTarget;
    const honeypot = (
      formEl.elements.namedItem("_gotcha") as HTMLInputElement | null
    )?.value;
    if (honeypot) {
      setStatus({ kind: "success" });
      return;
    }

    // Client-Validierung: nichts an Formspree senden, solange Pflichtfelder
    // fehlen. Fokus auf das erste fehlerhafte Feld.
    const fehler = validate(form);
    setVersucht(true);
    setErrors(fehler);
    const erstesFeld = PFLICHTFELDER.find((k) => fehler[k]);
    if (erstesFeld) {
      formEl
        .querySelector<HTMLElement>(`[name="${erstesFeld}"]`)
        ?.focus();
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const payload = {
        Behörde: form.behoerde,
        Einwohnerzahl: form.einwohner,
        Anliegen: form.anliegen,
        "Interesse Bescheidmodul": form.bescheidInteresse ? "Ja" : "Nein",
        Ansprechpartner: form.ansprechpartner,
        email: form.email,
        Telefon: form.telefon || "—",
        Nachricht: form.nachricht || "—",
        _subject: `FlächenKlar — ${form.anliegen || "Anfrage"} (${form.behoerde})`,
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // E-Mail vor dem Zuruecksetzen merken, sonst zeigt die
        // Erfolgsmeldung nur den Platzhalter.
        setStatus({ kind: "success", email: form.email.trim() });
        setForm(initial);
        setErrors({});
        setVersucht(false);
        return;
      }

      // Formspree antwortet bei Fehlern mit JSON: { errors: [{ message: "…" }] }
      let message = "Senden fehlgeschlagen. Bitte später erneut versuchen.";
      try {
        const data = (await res.json()) as {
          errors?: Array<{ message?: string }>;
        };
        if (data.errors && data.errors[0]?.message) {
          message = data.errors[0].message;
        }
      } catch {
        // JSON-Parse fehlgeschlagen — Default-Message bleibt.
      }
      setStatus({ kind: "error", message });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          "Netzwerk-Fehler. Bitte E-Mail direkt an info@flaechenklar.de senden.",
      });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-navy py-24 text-white"
    >
      <BlueprintGrid />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Kontakt
          </p>
          <h2 className={`mt-3 ${H2}`}>
            In zwei Minuten zur Demo-Anfrage.
          </h2>
          <p className="mt-4 text-white/70 md:text-lg">
            Formular ausfüllen, abschicken — wir melden uns innerhalb von einem
            Werktag an die angegebene E-Mail-Adresse zurück.
          </p>
        </Reveal>

        {status.kind === "success" ? (
          <Reveal delay={120}>
            <div
              role="status"
              aria-live="polite"
              className="mt-10 rounded-lg border border-teal/40 bg-teal/10 p-6"
            >
              <div className="flex items-start gap-3">
                <CircleCheck
                  className="mt-0.5 shrink-0 text-teal"
                  size={ICON_SIZE.hero}
                  strokeWidth={2}
                />
                <div>
                  <p className="text-lg font-semibold text-white">
                    Nachricht erfolgreich gesendet.
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von
                    einem Werktag bei{" "}
                    <span className="font-mono">{status.email || "Ihrer E-Mail"}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus({ kind: "idle" })}
                    className={`mt-4 rounded-sm text-sm font-semibold text-teal transition-colors hover:text-teal/80 ${FOCUS_RING_DARK}`}
                  >
                    Weitere Anfrage senden →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              className="mt-10 grid gap-5 md:grid-cols-2"
              noValidate
            >
              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-sm text-white/70">Behörde *</span>
                  <input
                    required
                    name="behoerde"
                    disabled={submitting}
                    value={form.behoerde}
                    onChange={update("behoerde")}
                    autoComplete="organization"
                    aria-invalid={errors.behoerde ? true : undefined}
                    aria-describedby={errors.behoerde ? "fehler-behoerde" : undefined}
                    className={`mt-1 ${inputCls} ${errors.behoerde ? INVALID_CLS : ""}`}
                  />
                </label>
                <FeldFehlerText id="fehler-behoerde" text={errors.behoerde} />
              </div>

              <div>
                <label className="block">
                  <span className="text-sm text-white/70">Einwohnerzahl *</span>
                  <select
                    required
                    name="einwohner"
                    disabled={submitting}
                    value={form.einwohner}
                    onChange={update("einwohner")}
                    aria-invalid={errors.einwohner ? true : undefined}
                    aria-describedby={errors.einwohner ? "fehler-einwohner" : undefined}
                    className={`mt-1 ${inputCls} ${errors.einwohner ? INVALID_CLS : ""}`}
                  >
                    <option value="">Bitte wählen</option>
                    <option>bis 3.000</option>
                    <option>3.000 – 8.000</option>
                    <option>8.000 – 15.000</option>
                    <option>15.000 – 30.000</option>
                    <option>über 30.000</option>
                  </select>
                </label>
                <FeldFehlerText id="fehler-einwohner" text={errors.einwohner} />
              </div>

              <div className="md:col-span-2">
                <span className="text-sm text-white/70">Anliegen *</span>
                <div
                  role="group"
                  aria-label="Anliegen"
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {ANLIEGEN_OPTIONS.map((opt) => {
                    const active = form.anliegen === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitting}
                        aria-pressed={active}
                        onClick={() => setForm({ ...form, anliegen: opt })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING_DARK} ${
                          active
                            ? "border-teal bg-teal-ink text-white"
                            : "border-white/25 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="md:col-span-2 flex items-center gap-2.5 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.bescheidInteresse}
                  onChange={(e) =>
                    setForm({ ...form, bescheidInteresse: e.target.checked })
                  }
                  disabled={submitting}
                  className={`h-4 w-4 rounded border-white/40 bg-white/10 accent-teal ${FOCUS_RING_DARK}`}
                />
                Interesse am Bescheidmodul
              </label>

              <div>
                <label className="block">
                  <span className="text-sm text-white/70">Ansprechpartner *</span>
                  <input
                    required
                    name="ansprechpartner"
                    disabled={submitting}
                    value={form.ansprechpartner}
                    onChange={update("ansprechpartner")}
                    autoComplete="name"
                    aria-invalid={errors.ansprechpartner ? true : undefined}
                    aria-describedby={
                      errors.ansprechpartner ? "fehler-ansprechpartner" : undefined
                    }
                    className={`mt-1 ${inputCls} ${errors.ansprechpartner ? INVALID_CLS : ""}`}
                  />
                </label>
                <FeldFehlerText
                  id="fehler-ansprechpartner"
                  text={errors.ansprechpartner}
                />
              </div>

              <div>
                <label className="block">
                  <span className="text-sm text-white/70">E-Mail *</span>
                  <input
                    required
                    type="email"
                    name="email"
                    disabled={submitting}
                    value={form.email}
                    onChange={update("email")}
                    autoComplete="email"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "fehler-email" : undefined}
                    className={`mt-1 ${inputCls} ${errors.email ? INVALID_CLS : ""}`}
                  />
                </label>
                <FeldFehlerText id="fehler-email" text={errors.email} />
              </div>

              <label className="md:col-span-2">
                <span className="text-sm text-white/70">Telefon (optional)</span>
                <input
                  disabled={submitting}
                  value={form.telefon}
                  onChange={update("telefon")}
                  autoComplete="tel"
                  className={`mt-1 ${inputCls}`}
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm text-white/70">Nachricht</span>
                <textarea
                  rows={5}
                  disabled={submitting}
                  value={form.nachricht}
                  onChange={update("nachricht")}
                  className={`mt-1 ${inputCls}`}
                />
              </label>

              {/*
                Honeypot: fuer Bots sichtbar (Form-Felder werden gerne
                automatisch ausgefuellt), fuer Menschen unsichtbar.
                Formspree erkennt _gotcha automatisch und blockt den Submit.
              */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label htmlFor="_gotcha">Bitte leer lassen</label>
                <input
                  type="text"
                  id="_gotcha"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {status.kind === "error" && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="md:col-span-2 flex items-start gap-3 rounded border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-100"
                >
                  <CircleAlert
                    className="mt-0.5 shrink-0 text-red-300"
                    size={ICON_SIZE.body}
                    strokeWidth={2}
                  />
                  <span>{status.message}</span>
                </div>
              )}

              <p className="md:col-span-2 text-xs text-white/50">
                Mit dem Absenden willigen Sie der Verarbeitung Ihrer Angaben
                gemäß unserer{" "}
                <a
                  href="/datenschutz"
                  className={`rounded-sm text-teal underline transition-colors hover:text-teal/80 ${FOCUS_RING_DARK}`}
                >
                  Datenschutzerklärung
                </a>{" "}
                ein. Die Übermittlung erfolgt über den Dienst Formspree (USA).
              </p>

              <button
                type="submit"
                disabled={submitting}
                className={`md:col-span-2 mt-2 ${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {submitting ? "Wird gesendet …" : "Nachricht senden"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
