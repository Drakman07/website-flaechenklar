import { useState, type FormEvent, type ChangeEvent } from "react";
import { BlueprintGrid } from "@/components/BlueprintGrid";

type FormState = {
  behoerde: string;
  einwohner: string;
  anliegen: string;
  ansprechpartner: string;
  email: string;
  telefon: string;
  nachricht: string;
};

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
  "w-full rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40";

export function Kontakt() {
  const [form, setForm] = useState<FormState>(initial);

  const update =
    (k: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `FlächenKlar — ${form.anliegen || "Anfrage"} (${form.behoerde})`;
    const body = [
      `Behörde: ${form.behoerde}`,
      `Einwohnerzahl: ${form.einwohner}`,
      `Anliegen: ${form.anliegen}`,
      `Ansprechpartner: ${form.ansprechpartner}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.telefon || "—"}`,
      "",
      "Nachricht:",
      form.nachricht,
    ].join("\n");
    window.location.href = `mailto:info@flaechenklar.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-navy py-24 text-white"
    >
      <BlueprintGrid />
      <div className="relative mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">
          Kontakt
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
          Demo, Pilot oder einfach Fragen.
        </h2>
        <p className="mt-4 text-white/70 md:text-lg">
          Formular ausfüllen, abschicken — Ihr E-Mail-Programm öffnet sich mit
          der fertigen Nachricht an info@flaechenklar.de.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          <label className="md:col-span-2">
            <span className="text-sm text-white/70">Behörde *</span>
            <input
              required
              value={form.behoerde}
              onChange={update("behoerde")}
              className={`mt-1 ${inputCls}`}
            />
          </label>

          <label>
            <span className="text-sm text-white/70">Einwohnerzahl *</span>
            <select
              required
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
              value={form.ansprechpartner}
              onChange={update("ansprechpartner")}
              className={`mt-1 ${inputCls}`}
            />
          </label>

          <label>
            <span className="text-sm text-white/70">E-Mail *</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              className={`mt-1 ${inputCls}`}
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/70">Telefon (optional)</span>
            <input
              value={form.telefon}
              onChange={update("telefon")}
              className={`mt-1 ${inputCls}`}
            />
          </label>

          <label className="md:col-span-2">
            <span className="text-sm text-white/70">Nachricht</span>
            <textarea
              rows={5}
              value={form.nachricht}
              onChange={update("nachricht")}
              className={`mt-1 ${inputCls}`}
            />
          </label>

          <button
            type="submit"
            className="md:col-span-2 mt-2 rounded bg-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal/90"
          >
            Nachricht im E-Mail-Programm öffnen
          </button>
        </form>
      </div>
    </section>
  );
}
