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
  },
  {
    icon: Building,
    einwohner: "3.000 – 8.000",
    einmalig: "3.100 €",
    einmaligNumeric: 3100,
    wartung: "310 €",
    wartungNumeric: 310,
  },
  {
    icon: Building2,
    einwohner: "8.000 – 15.000",
    einmalig: "5.800 €",
    einmaligNumeric: 5800,
    wartung: "580 €",
    wartungNumeric: 580,
  },
  {
    icon: Landmark,
    einwohner: "15.000 – 30.000",
    einmalig: "10.500 €",
    einmaligNumeric: 10500,
    wartung: "1.050 €",
    wartungNumeric: 1050,
  },
  {
    icon: Castle,
    einwohner: "über 30.000",
    einmalig: "14.500 €",
    einmaligNumeric: 14500,
    wartung: "1.450 €",
    wartungNumeric: 1450,
  },
] as const;
