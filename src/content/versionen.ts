export type VersionPunkt = {
  /** Kurzer Titel des Punkts (fett dargestellt). */
  titel: string;
  /** Ein bis zwei Sätze, sachlich, in Kundensprache. */
  text: string;
};

export type Version = {
  /** Semver-String ohne führendes "v", z. B. "1.1.0". */
  version: string;
  /** Anzeige-Datum im deutschen Format "TT.MM.JJJJ". */
  datum: string;
  /** ISO-Datum "JJJJ-MM-TT" für das <time datetime>-Attribut. */
  iso: string;
  /** Kundenrelevante Änderungen dieser Version. */
  punkte: readonly VersionPunkt[];
};

/**
 * Öffentliche Versionshistorie von FlächenKlar.
 *
 * Single Source of Truth für die /versionen-Seite UND den
 * "Neu in dieser Version"-Block auf /tutorial (jeweils versionen[0]).
 *
 * Pflege: bei jedem Release einen neuen Eintrag oben (newest-first)
 * einfügen. Nur kundenrelevante Punkte in Kundensprache — interne
 * Test-/Refactor-Notizen aus tool/CHANGELOG.md gehören NICHT hierher.
 */
export const versionen: readonly Version[] = [
  {
    version: "1.1.0",
    datum: "15.06.2026",
    iso: "2026-06-15",
    punkte: [
      {
        titel: "Maßstab-Direkteingabe",
        text: "Bei maßhaltigen CAD- und Vektor-PDFs lässt sich der Maßstab direkt eingeben (1:50 bis 1:1000), ohne Referenzstrecke. Bei erkannten Scans bleibt die Referenzstrecke verpflichtend.",
      },
      {
        titel: "Variable Grenzhöhe",
        text: "Die anrechenbare Grenzhöhe folgt der kommunalen Satzung und ist frei einstellbar (Standard 2,30 m). Die Vollgeschoss-Beurteilung nach Art. 83 Abs. 7 BayBO bleibt davon unberührt.",
      },
      {
        titel: "Rechenweg im Aufmaßprotokoll",
        text: "Auf Wunsch zeigt das Protokoll jede Teilfläche als nachvollziehbare Herleitung — als Länge × Breite oder als Koordinatentabelle. Das schafft Transparenz gegenüber Bürgern.",
      },
    ],
  },
  {
    version: "1.0.0",
    datum: "16.05.2026",
    iso: "2026-05-16",
    punkte: [
      {
        titel: "Erstauslieferung",
        text: "FlächenKlar startet als Aufmaß-Werkzeug für bayerische Bauämter — komplett offline im Browser, ohne Installation.",
      },
      {
        titel: "Vollgeschoss-Berechnung",
        text: "Ermittlung nach Art. 83 Abs. 7 BayBO direkt aus dem Aufmaß, inklusive Diagrammen zur Plausibilitätsprüfung.",
      },
      {
        titel: "Lizenz und automatische Updates",
        text: "Lizenzierter Betrieb mit eingebautem Update-Mechanismus über download.flaechenklar.de.",
      },
    ],
  },
] as const;
