import {
  Home,
  Building,
  Building2,
  Landmark,
  Castle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Preisstufe = {
  icon: LucideIcon;
  einwohner: string;
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

/**
 * 5-Tier-Pricing fuer kommunale Bauaemter, gestaffelt nach Einwohnerzahl.
 * - `einmalig` / `wartung`: formatierte Anzeige-Strings ("1.600 €")
 * - `einmaligNumeric` / `wartungNumeric`: rohe Zahlen fuer useCountUp-Counter
 * - `icon`: visueller Anker pro Tier (Skalen-Progression Home -> Castle)
 */
export const preise: readonly Preisstufe[] = [
  {
    icon: Home,
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
    icon: Building,
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
    icon: Building2,
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
    icon: Landmark,
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
    icon: Castle,
    einwohner: "über 30.000",
    einmalig: "14.500 €",
    einmaligNumeric: 14500,
    wartung: "1.450 €",
    wartungNumeric: 1450,
    bescheidModul: "2.200 €",
    bescheidModulNumeric: 2200,
    wartungMitModul: "1.670 €",
    wartungMitModulNumeric: 1670,
  },
] as const;
