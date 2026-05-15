import { useState, type FormEvent, type ChangeEvent } from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { Reveal } from "@/components/Reveal";

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
  ansprechpartner: string;
  email: string;
  telefon: string;
  nachricht: string;
};

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const initial: FormState = {
  behoerde: "",
  einwohner: "",
  anliegen: "",
  ansprechpartner: "",
  email: "",
  telefon: "",
  nachricht: "",
};

const inputCls =
  "w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40 disabled:opacity-60";

export function Kontakt() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  const update =
    (k: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm({ ...form, [k]: e.target.value });

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

    setStatus({ kind: "submitting" });

    try {
      const payload = {
        Behörde: form.behoerde,
        Einwohnerzahl: form.einwohner,
        Anliegen: form.anliegen,
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
        setStatus({ kind: "success" });
        setForm(initial);
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
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Demo, Pilot oder einfach Fragen.
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
                  size={24}
                  strokeWidth={2}
                />
                <div>
                  <p className="text-lg font-semibold text-white">
                    Nachricht erfolgreich gesendet.
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von
                    einem Werktag bei{" "}
                    <span className="font-mono">{form.email || "Ihrer E-Mail"}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus({ kind: "idle" })}
                    className="mt-4 text-sm font-semibold text-teal hover:text-teal/80"
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
              className="mt-10 grid gap-4 md:grid-cols-2"
              noValidate
            >
              <label className="md:col-span-2">
                <span className="text-sm text-white/70">Behörde *</span>
                <input
                  required
                  disabled={submitting}
                  value={form.behoerde}
                  onChange={update("behoerde")}
                  autoComplete="organization"
                  className={`mt-1 ${inputCls}`}
                />
              </label>

              <label>
                <span className="text-sm text-white/70">Einwohnerzahl *</span>
                <select
                  required
                  disabled={submitting}
                  value={form.einwohner}
                  onChange={update("einwohner")}
                  className={`mt-1 ${inputCls}`}
                >
                  <option value="">Bitte wählen</option>
                  <option>bis 3.000</option>
                  <option>3.000 – 8.000</option>
                  <option>8.000 – 15.000</option>
                  <option>15.000 – 30.000</option>
                  <option>über 30.000</option>
                </select>
              </label>

              <label>
                <span className="text-sm text-white/70">Anliegen *</span>
                <select
                  required
                  disabled={submitting}
                  value={form.anliegen}
                  onChange={update("anliegen")}
                  className={`mt-1 ${inputCls}`}
                >
                  <option value="">Bitte wählen</option>
                  <option>Demo</option>
                  <option>Pilot</option>
                  <option>Angebot</option>
                  <option>Frage</option>
                </select>
              </label>

              <label>
                <span className="text-sm text-white/70">Ansprechpartner *</span>
                <input
                  required
                  disabled={submitting}
                  value={form.ansprechpartner}
                  onChange={update("ansprechpartner")}
                  autoComplete="name"
                  className={`mt-1 ${inputCls}`}
                />
              </label>

              <label>
                <span className="text-sm text-white/70">E-Mail *</span>
                <input
                  required
                  type="email"
                  disabled={submitting}
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                  className={`mt-1 ${inputCls}`}
                />
              </label>

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
                    size={20}
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
                  className="text-teal underline hover:text-teal/80"
                >
                  Datenschutzerklärung
                </a>{" "}
                ein. Die Übermittlung erfolgt über den Dienst Formspree (USA).
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="md:col-span-2 mt-2 rounded bg-teal px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
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
