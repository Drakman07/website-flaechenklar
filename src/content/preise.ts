export type Preisstufe = {
  einwohner: string;
  einmalig: string;
  wartung: string;
};

export const preise: readonly Preisstufe[] = [
  { einwohner: "bis 3.000", einmalig: "1.600 €", wartung: "160 €" },
  { einwohner: "3.000 – 8.000", einmalig: "3.100 €", wartung: "310 €" },
  { einwohner: "8.000 – 15.000", einmalig: "5.800 €", wartung: "580 €" },
  { einwohner: "15.000 – 30.000", einmalig: "10.500 €", wartung: "1.050 €" },
  { einwohner: "über 30.000", einmalig: "14.500 €", wartung: "1.450 €" },
] as const;
