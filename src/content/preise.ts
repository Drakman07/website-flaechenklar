/*
 * Quelle der Preise für flaechenklar.de: scripts/baue-seite.mjs liest diese
 * Datei beim Bauen und schreibt Preiswähler (Startseite) und JSON-LD-Angebot.
 * Seit der statischen Seite (09.11.2026) ohne Icons, sonst unverändert.
 */
type PreisstufeBasis = {
  einwohner: string;
};

/**
 * Oberste Einwohnerklasse ohne Listenpreis: "Preis auf Anfrage"
 * (Entscheidung 04.11.2026, die Spanne über 30.000 reicht bis 1,5 Mio.).
 */
export type PreisstufeAufAnfrage = PreisstufeBasis & { aufAnfrage: true };

export type PreisstufeMitPreis = PreisstufeBasis & {
  aufAnfrage?: false;
  einmalig: string;
  einmaligNumeric: number;
  wartung: string;
  wartungNumeric: number;
  /** Bescheidmodul-Add-on, einmalig — Anzeige-String ("250 €"). */
  bescheidModul: string;
  /** Rohwert des Add-ons für Berechnungen/Counter. */
  bescheidModulNumeric: number;
  /** Wartung ab Jahr 2 MIT Bescheidmodul: 10 % auf (einmalig + bescheidModul). */
  wartungMitModul: string;
  wartungMitModulNumeric: number;
};

export type Preisstufe = PreisstufeMitPreis | PreisstufeAufAnfrage;

/**
 * 5-Tier-Pricing fuer kommunale Bauaemter, gestaffelt nach Einwohnerzahl;
 * die fuenfte Klasse (ueber 30.000) ohne Preis, auf Anfrage.
 * - `einmalig` / `wartung`: formatierte Anzeige-Strings ("1.600 €")
 * - `einmaligNumeric` / `wartungNumeric`: rohe Zahlen fuer useCountUp-Counter */
export const preise: readonly Preisstufe[] = [
  {
    einwohner: "bis 3.000",
    einmalig: "1.600 €",
    einmaligNumeric: 1600,
    wartung: "160 €",
    wartungNumeric: 160,
    bescheidModul: "250 €",
    bescheidModulNumeric: 250,
    wartungMitModul: "185 €",
    wartungMitModulNumeric: 185,
  },
  {
    einwohner: "3.000 – 8.000",
    einmalig: "3.100 €",
    einmaligNumeric: 3100,
    wartung: "310 €",
    wartungNumeric: 310,
    bescheidModul: "500 €",
    bescheidModulNumeric: 500,
    wartungMitModul: "360 €",
    wartungMitModulNumeric: 360,
  },
  {
    einwohner: "8.000 – 15.000",
    einmalig: "5.800 €",
    einmaligNumeric: 5800,
    wartung: "580 €",
    wartungNumeric: 580,
    bescheidModul: "900 €",
    bescheidModulNumeric: 900,
    wartungMitModul: "670 €",
    wartungMitModulNumeric: 670,
  },
  {
    einwohner: "15.000 – 30.000",
    einmalig: "10.500 €",
    einmaligNumeric: 10500,
    wartung: "1.050 €",
    wartungNumeric: 1050,
    bescheidModul: "1.600 €",
    bescheidModulNumeric: 1600,
    wartungMitModul: "1.210 €",
    wartungMitModulNumeric: 1210,
  },
  {
    einwohner: "über 30.000",
    aufAnfrage: true,
  },
] as const;
