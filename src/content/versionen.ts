export type VersionPunkt = {
  /** Kurzer Titel des Punkts (fett dargestellt). */
  titel: string;
  /** Ein bis zwei Sätze, sachlich, in Kundensprache. */
  text: string;
  /**
   * Ob der einzelne Punkt im Internet erscheint. Default: true.
   * Auf `false` setzen, um ein bereits eingebautes, aber noch nicht
   * freigegebenes Feature aus der öffentlichen Liste auszublenden —
   * der Punkt bleibt in dieser Datei dokumentiert.
   */
  oeffentlich?: boolean;
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
  /**
   * Ob der Eintrag im Internet erscheint (auf /versionen und als
   * versionen[0]-Block auf /tutorial). Default: true.
   * Hotfix-/Patch-Releases auf `false` setzen — sie bleiben hier
   * vollständig dokumentiert, werden aber öffentlich nicht angezeigt.
   */
  oeffentlich?: boolean;
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
  // Vollständige Historie — auch Hotfixes werden hier dokumentiert.
  // Im Internet erscheinen aber nur Einträge mit oeffentlich !== false.
  // Eilpatches bekommen `oeffentlich: false` (siehe 1.2.1).
  {
    version: "1.4.1",
    datum: "26.07.2026",
    iso: "2026-07-26",
    // Hotfix/Patch: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7).
    oeffentlich: false,
    punkte: [
      {
        titel: "Ablauf-Leiste zeigt jetzt den Fortschritt je Geschoss",
        text: "Ein neu angelegtes Geschoss zeigte in der Ablauf-Leiste fälschlich schon den Fortschritt eines anderen, bereits bearbeiteten Geschosses. Behoben — die Anzeige bezieht sich jetzt korrekt auf das gerade aktive Geschoss.",
      },
      {
        titel: "Namens-Vorschläge beim Anlegen eines Geschosses",
        text: "Beim Anlegen eines neuen Geschosses stehen jetzt Schaltflächen mit den üblichen Bezeichnungen (Kellergeschoss, Erdgeschoss, 1./2. Obergeschoss, Dachgeschoss) zur Auswahl.",
      },
    ],
  },
  {
    version: "1.4.0",
    datum: "26.07.2026",
    iso: "2026-07-26",
    punkte: [
      {
        titel: "Schritt-für-Schritt-Führung durch den Arbeitsablauf",
        text: "Eine durchgängige Ablauf-Leiste zeigt, wo man im Arbeitsablauf gerade steht und was als Nächstes ansteht — von der PDF-Übernahme bis zum fertigen Aufmaßprotokoll.",
      },
      {
        titel: "Eigener Dialog für Abzugsflächen",
        text: "Abzugsflächen werden jetzt über ein Formular im Tool-Design erfasst statt über ein Browser-Eingabefenster — übersichtlicher und ohne Bruch im Bedienerlebnis.",
      },
      {
        titel: "Bescheidmaske als geführter Wizard",
        text: "Der Beitragsbescheid entsteht jetzt in vier klaren Schritten — Empfänger & Grundstück, Beitragssätze, Zahlung & Unterschrift, Texte prüfen — mit einem Zähler für offene Pflichtfelder je Schritt.",
      },
      {
        titel: "Abweichender Unterzeichner je Bescheid",
        text: "Der Bescheid kann wahlweise einen vom Sachbearbeiter abweichenden Unterzeichner tragen, etwa den Bürgermeister, mit optionalem Zeichnungsvermerk „i. A.“ oder „i. V.“ über dem Unterschriftsstrich — pflegbar je Gemeinde-Profil, im Einzelfall überschreibbar.",
      },
    ],
  },
  {
    version: "1.3.0",
    datum: "15.07.2026",
    iso: "2026-07-15",
    punkte: [
      {
        titel: "Bescheidmodul (Add-on)",
        text: "Erstellt aus den Berechnungsergebnissen und den Angaben der gemeindlichen Satzung Entwürfe für Herstellungsbeitragsbescheide nach Art. 5 KAG Bayern — orientiert am amtlichen Muster. Die fachliche Prüfung und der Erlass verbleiben bei der Gemeinde.",
      },
      {
        titel: "Foto-Import mit Entzerrung",
        text: "Auch ein Handyfoto eines Papierplans reicht: vier Eckpunkte eines bekannten Rechtecks anklicken, Maße eintragen — FlächenKlar rechnet die Perspektive heraus und kalibriert die Fläche automatisch. Danach funktionieren Polygon-Aufmaß, Vollgeschoss-Beurteilung und Aufmaßprotokoll wie bei einem PDF.",
      },
    ],
  },
  {
    version: "1.2.7",
    datum: "06.07.2026",
    iso: "2026-07-06",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6).
    oeffentlich: false,
    punkte: [
      {
        titel: "Vollgeschoss-Beurteilung: Aufmaßblatt aufgeräumt",
        text: "Das Aufmaßprotokoll zeigt jetzt ausschließlich das Ergebnis der Vollgeschoss-Beurteilung. Ein interner Plausibilitäts-Hinweis, der bislang mit ins Protokoll rutschte, bleibt jetzt im Programm sichtbar, erscheint aber nicht mehr im Ausdruck.",
      },
      {
        titel: "Kleinere Anzeige-Korrektur beim manuellen Ansetzen der Fläche ≥ 2,30 m",
        text: "Bestätigen- und Zurücksetzen-Symbol beim manuellen Ansetzen der Fläche saßen in seltenen Fällen leicht außerhalb des Eingabefelds. Behoben.",
      },
    ],
  },
  {
    version: "1.2.6",
    datum: "05.07.2026",
    iso: "2026-07-05",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1).
    // Auf der Website erscheinen nur Minor-Releases (1.1, 1.2, 1.3, 1.4).
    oeffentlich: false,
    punkte: [
      {
        titel: "Maßstab: Referenzmessung ist jetzt der verlässliche Standard",
        text: "Der Maßstab wird über eine kurze Referenzmessung im Plan festgelegt — auch bei verzerrten oder nicht maßstabsgetreuen PDF-Exporten zuverlässig. Die automatische Erkennung schlägt einen Wert nur noch vor, wenn die Maßketten des Plans ihn zweifelsfrei bestätigen; andernfalls führt das Programm direkt zur Messung. Die bisherige Maßstab-Direkteingabe (1:N) und die Schnellwahl-Knöpfe entfallen, weil Maßstabsangaben im Plankopf bei verzerrten Exporten trügen können.",
      },
      {
        titel: "Eindeutige Maßstab-Anzeige",
        text: "Eine klare Ampel zeigt pro Bereich, ob der Maßstab gesetzt ist. Weicht eine verlässliche Planbemaßung deutlich ab, weist das Programm auf eine empfohlene Zweitmessung hin.",
      },
    ],
  },
  {
    version: "1.2.1",
    datum: "21.06.2026",
    iso: "2026-06-21",
    oeffentlich: false,
    punkte: [
      {
        titel: "Update-Hinweis im Programm korrigiert",
        text: "Die Prüfung auf neue Versionen direkt im Programm funktioniert wieder zuverlässig. Wer Aktualisierungen über die mitgelieferte Update-Datei einspielt, war davon nicht betroffen.",
      },
    ],
  },
  {
    version: "1.2.0",
    datum: "21.06.2026",
    iso: "2026-06-21",
    punkte: [
      {
        titel: "Vektor-Snapping (Magnet)",
        text: "Beim Zeichnen rasten die Punkte an den Linien maßhaltiger CAD-Pläne ein — schneller und genauer. Mit gedrückter Umschalttaste lässt sich der Magnet kurz aussetzen.",
      },
      {
        titel: "Maßstab automatisch aus den Maßketten",
        text: "Bei vermaßten Vektor-Plänen liest FlächenKlar die Maßketten aus und schlägt den passenden Maßstab selbst vor. Das manuelle Kalibrieren entfällt, wo der Plan die Maße schon mitbringt.",
      },
      {
        titel: "Rechteck-Werkzeug",
        text: "Rechteckige Flächen entstehen mit zwei Klicks über die Diagonale statt mit vier einzelnen Eckpunkten.",
      },
      {
        titel: "Daten-Export als CSV und JSON",
        text: "Das Aufmaß lässt sich zusätzlich zum PDF-Protokoll als CSV für die Tabellenkalkulation und als JSON zur Weiterverarbeitung ausgeben.",
        // Eingebaut, aber im Tool noch ausgeblendet (RIWA-Schnittstelle offen).
        // Vorübergehend NICHT öffentlich; wieder aufgreifen, sobald die erste
        // Gemeinde konkret danach fragt.
        oeffentlich: false,
      },
      {
        titel: "Plan mit der Leertaste verschieben",
        text: "Der Plan lässt sich jetzt auch während einer laufenden Zeichnung mit gedrückter Leertaste und der Maus verschieben.",
      },
    ],
  },
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
