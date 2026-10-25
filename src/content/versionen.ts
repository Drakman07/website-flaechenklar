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
    version: "1.5.7",
    datum: "23.10.2026",
    iso: "2026-10-23",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Sehr detailreiche Pläne werden vollständig geladen",
        text: "Pläne mit mehreren Millionen Zeichenbefehlen, etwa großformatige Eingabepläne mit vielen Ansichten auf einem Blatt, brachen bisher nach 20 Sekunden mit einer Fehlermeldung ab und ließen sich nicht vermessen. Jetzt bereitet das Programm sie vollständig auf; bei solchen Plänen kann das eine halbe bis einige Minuten dauern. Nach zwei Sekunden zeigt das Ladefenster die verstrichene Zeit und den Fortschritt, mit „Abbrechen“ kehrt das Programm zum vorherigen Stand zurück. Die Aufbereitung läuft im Hintergrund, das Programm reagiert dabei weiter. Erst nach zehn Minuten ohne Ergebnis bricht es ab und empfiehlt, die Seite in kleinere Bereiche aufzuteilen. Steht die Hintergrund-Aufbereitung im Browser nicht zur Verfügung, überspringt das Programm bei solchen Plänen die automatische Maßstab-Erkennung; den Maßstab messen Sie dann per Referenzstrecke.",
      },
      {
        titel: "Gemessene Flächen bleiben maßhaltig, wenn sich die Aufteilung des Programmfensters ändert",
        text: "Wurde die Arbeitsfläche schmaler oder breiter, ohne dass sich die Größe des Browserfensters änderte, zeigte das Programm den Plan bisher verzerrt an. Das geschah etwa beim Schließen des Start-Hinweises oder wenn die Werkzeugleiste in eine zweite Zeile umbrach. Klicks landeten dann neben dem gemeinten Planpunkt, gemessene Flächen konnten zwischen 5 % zu klein und 10 % zu groß sein. Jetzt passt sich die Anzeige jeder solchen Änderung sofort an, Klicks treffen den sichtbaren Punkt. Flächen, die Sie mit einer früheren Version nach einer solchen Änderung gemessen haben, prüfen Sie bitte stichprobenartig nach: Vergleichen Sie die angezeigten Kantenmaße mit der Bemaßung im Plan. Das Update ändert bereits gespeicherte Messungen nicht.",
      },
      {
        titel: "Umbenennen einer PDF: Der neue Name erscheint sofort auch bei den Plan-Ausschnitten in der Seitenleiste",
        text: "Bisher stand dort der alte Name, bis die Liste aus anderem Grund neu aufgebaut wurde.",
      },
      {
        titel: "Ein Klick auf einen Plan-Ausschnitt, der auf einer anderen PDF liegt, zeigt jetzt direkt dessen Seite",
        text: "Bisher blieb etwa beim Wechsel von Seite 2 der einen PDF zu einem Ausschnitt auf Seite 2 der anderen deren Seite 1 stehen, und der Maßstab-Vorschlag bezog sich auf die falsche Seite.",
      },
      {
        titel: "Der Maßstab-Vorschlag gehört zur geöffneten Akte",
        text: "Wurde nach einem Vorschlag eine andere Akte geöffnet, neu angelegt oder wiederhergestellt, blieb der Vorschlag der vorigen Akte stehen. „Übernehmen“ trug ihn dann in die Historie der neuen Akte ein. Jetzt schließt sich der Vorschlag beim Aktenwechsel.",
      },
    ],
  },
  {
    version: "1.5.6",
    datum: "21.10.2026",
    iso: "2026-10-21",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Beitragsbescheid: Der Betrag wird aus der gedruckten Fläche berechnet",
        text: "Das Aufmaß speichert Flächen mit drei Nachkommastellen, der Bescheid druckt sie mit zwei. Bisher rechnete das Programm den Betrag mit der ungerundeten Fläche: Aus 185,695 m², gedruckt als 185,70 m², ergaben sich bei 19,30 EUR/m² 3.583,91 EUR, obwohl sich aus den gedruckten Zahlen 3.584,01 EUR ergeben. Jetzt rundet das Programm die Flächen zuerst kaufmännisch auf zwei Nachkommastellen (ab 5 in der dritten Stelle wird aufgerundet) und berechnet den Betrag aus diesen gedruckten Werten. Bei einer Nacherhebung ist die Mehrfläche die Differenz der beiden gedruckten Flächen. Jede Zahl im Bescheid lässt sich damit aus den danebenstehenden Faktoren nachrechnen. Bitte beachten Sie: Bescheidbeträge können sich dadurch gegenüber früheren Versionen um wenige Cent ändern. Bescheide, die Sie bereits versandt haben, ändert die neue Version nicht. Der Betrag wird bei jedem Export neu berechnet; erzeugen Sie einen Bescheid aus einem gespeicherten Projekt erneut, kann er um diese wenigen Cent abweichen.",
      },
      {
        titel: "Beitragsbescheid: Der Ansprechpartner steht neben der Anschrift",
        text: "In der Word-Ausgabe stand der Block „Ihr Ansprechpartner“ bisher als eigener Absatz über dem Anschriftenfeld. Er steht jetzt rechts neben der Anschrift auf gleicher Höhe; die Anordnung ist eine Tabelle ohne sichtbare Linien. Im PDF stand der Block bisher oben im Briefkopf und überdruckte bei einem langen Behördennamen, etwa dem eines Zweckverbands, den Namen. Auch dort steht er jetzt neben dem Anschriftenfeld. Lange Anschriften und lange E-Mail-Adressen brechen um, statt sich zu überlagern.",
      },
      {
        titel: "Beitragsbescheid: Beitragssätze erscheinen mit bis zu vier Nachkommastellen",
        text: "Der Bescheid druckt einen Beitragssatz wie 19,305 EUR/m² jetzt vollständig. Bisher stand er auf zwei Stellen gerundet (19,31) im Bescheid, obwohl mit 19,305 gerechnet wurde. Auch die Masken für Stammdaten und Bescheid zeigen die Sätze mit allen Stellen und runden sie beim Speichern nicht mehr auf zwei Stellen. Ein Satz mit mehr als vier Nachkommastellen lässt sich nicht vollständig drucken; die Prüfung vor dem Export lehnt ihn ab.",
      },
      {
        titel: "Beitragsbescheid: Hinweis bei Projekten mit einem früher erstellten Bescheid",
        text: "Wurde für ein Projekt schon ein Bescheid mit einer Version vor 1.5.6 erstellt, zeigt die Bescheidmaske einen Hinweis, dass ein erneut erzeugter Bescheid wegen der Rundung der Flächen um wenige Cent abweichen kann. Der Hinweis verschwindet, sobald im Projekt ein Bescheid mit Version 1.5.6 oder neuer erstellt wurde.",
      },
    ],
  },
  {
    version: "1.5.5",
    datum: "20.10.2026",
    iso: "2026-10-20",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Ersatzneubau: Das Aufmaßblatt zeigt jetzt den Saldo aus der neuen Gesamtfläch…",
        text: "Ersatzneubau: Das Aufmaßblatt zeigt jetzt den Saldo aus der neuen Gesamtfläche und der für den Altbestand bereits abgerechneten Fläche, auch negativ, wenn das alte Gebäude größer war. Die bereits abgerechnete Fläche tragen Sie in der Seitenleiste unter der Geschossliste ein, optional mit einem Nachweis (zum Beispiel dem Aktenzeichen des früheren Bescheids). Das Aufmaßprotokoll weist unter der Gesamtfläche den abzuziehenden Bestand und den Saldo aus; Datenexport (JSON, CSV) enthält die Werte ebenfalls. Ohne Eintrag bleiben Aufmaßprotokoll und CSV-Export wie bisher, bestehende Projekte laden ohne Änderung.",
      },
      {
        titel: "Aufmaßprotokoll: Ein langes Bauvorhaben (oder eine lange Bauherr-Anschrift) läuft nicht mehr in die Zeile darunter",
        text: "Das Feld bricht in eine zweite Zeile um, die Karte wächst mit, und die folgenden Felder rücken nach unten. Kurze Angaben sehen aus wie bisher.",
      },
    ],
  },
  {
    version: "1.5.4",
    datum: "15.10.2026",
    iso: "2026-10-15",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Lange Aufmaßprotokolle brechen jetzt sauber auf die nächste Seite um: Bei vie…",
        text: "Lange Aufmaßprotokolle brechen jetzt sauber auf die nächste Seite um: Bei vielen Geschossen, Abzugsposten oder Teilflächen lief die Tabelle bisher über den unteren Seitenrand hinaus, und die Zeile GESAMTFLÄCHE konnte im Protokoll fehlen. Die Seitenzahl zählt die zusätzlichen Seiten mit. Die Abzugsposten eines Geschosses stehen jetzt immer einzeln, bis zu sechs; weitere fasst eine Zeile mit ihrer Summe zusammen.",
      },
      {
        titel: "Das Vollgeschoss-Beurteilungsblatt läuft bei langem Kommentar oder vielen Hin…",
        text: "Das Vollgeschoss-Beurteilungsblatt läuft bei langem Kommentar oder vielen Hinweisen auf einer Fortsetzungsseite weiter, und Kommentare werden in ihrer Druckschrift umbrochen. Bisher konnte der Kommentar unter die Fußzeile oder über den rechten Rand hinaus laufen, und der Methodik-Hinweis konnte ihn überdecken.",
      },
      {
        titel: "Der Diagnose-Bericht für den Support enthält keine Dateinamen der Bauantrags-…",
        text: "Der Diagnose-Bericht für den Support enthält keine Dateinamen der Bauantrags-PDFs und keine Freitexte (Bezeichnungen, Kommentare, Begründungen von Korrekturen) mehr. Dateinamen erscheinen als Platzhalter, nur die Endung bleibt. Voreingestellt ist jetzt die Stufe „Standard“ statt „Mit Projekt-Snapshot“.",
      },
      {
        titel: "Beim schnellen Wechsel zwischen zwei PDFs konnte die Seiten-Analyse der vorhe…",
        text: "Beim schnellen Wechsel zwischen zwei PDFs konnte die Seiten-Analyse der vorher angezeigten PDF in die aktuelle schreiben und zum Beispiel den falschen Maßstab vorschlagen. Analyse, Anzeige und Lade-Meldungen beziehen sich jetzt immer auf die PDF, die tatsächlich angezeigt wird. Außerdem gilt das Umbenennen einer PDF jetzt als ungespeicherte Änderung; die Sicherheitsabfrage vor „Neu“ und „Öffnen“ greift damit auch hier.",
      },
      {
        titel: "In der Seitenleiste stehen Flächen und Plan-Ausschnitte zweizeilig",
        text: "Name und PDF-Name sind wieder lesbar, Fläche, Seite und Maßstab stehen in der zweiten Zeile. Den vollen Namen zeigt ein Tooltip.",
      },
      {
        titel: "Beitragsbescheid: Der Hinweis, die Fälligkeit auf Feiertage zu prüfen, ersche…",
        text: "Beitragsbescheid: Der Hinweis, die Fälligkeit auf Feiertage zu prüfen, erscheint jetzt auch, wenn das Programm die Fälligkeit nach Eingabe des Versanddatums selbst vorschlägt.",
      },
      {
        titel: "Scheitert der Start über FlaechenKlar.bat, bleibt das nicht mehr unbemerkt: D…",
        text: "Scheitert der Start über FlaechenKlar.bat, bleibt das nicht mehr unbemerkt: Das Startfenster ist sichtbar, der Ablauf steht in der Datei FlaechenKlar-Start.log neben der FlaechenKlar.bat (ersatzweise im Temp-Ordner), und bei einem Fehler öffnet sich FlächenKlar ersatzweise direkt im Browser. Bisher konnte der Start ohne jede Meldung scheitern, etwa nach einer neuen IT-Richtlinie.",
      },
    ],
  },
  {
    version: "1.5.3",
    datum: "20.08.2026",
    iso: "2026-08-20",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7/1.4.1/1.4.3).
    oeffentlich: false,
    punkte: [
      {
        titel: "Gemeinde-Zuordnung vereinheitlicht",
        text: "Programmkopf, Aufmaßprotokoll, Beitragsbescheid und Datenexport greifen jetzt auf dieselbe Gemeinde-Zuordnung einer Akte zurück. Bei mehreren Gemeinden (Verwaltungsgemeinschaften) konnte der Programmkopf bislang die Standard-Gemeinde statt der tatsächlich zugeordneten anzeigen — behoben.",
      },
      {
        titel: "Vollgeschoss-Beurteilung: interne Anzeige korrigiert",
        text: "Eine interne Abweichungs-Anzeige im Vollgeschoss-Baustein konnte nach nachträglicher Änderung der Grenzhöhe veraltet bleiben. Die im Bescheid verwendete Fläche war davon nicht betroffen — behoben.",
      },
    ],
  },
  {
    version: "1.5.2",
    datum: "14.08.2026",
    iso: "2026-08-14",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7/1.4.1/1.4.3).
    oeffentlich: false,
    punkte: [
      {
        titel: "Update-Vorgang zuverlässiger",
        text: "Der automatische Update-Weg wurde robuster gemacht — künftige Verbesserungen kommen zuverlässiger und ohne zusätzliches Zutun bei Ihnen an.",
      },
      {
        titel: "Warnhinweise bei unsicherer Gemeinde-Zuordnung",
        text: "Zwei neue Hinweisbalken schützen vor Bescheiden mit falschen Daten: Der eine meldet, wenn sich einer Akte keine eindeutige Gemeinde zuordnen lässt; der andere erinnert daran, dass geänderte Stammdaten erst nach Ablage und Neuladen für die ganze Installation gelten.",
      },
      {
        titel: "Beitragssätze erneut aus Stammdaten übernehmen",
        text: "Im Beitragsbescheid lassen sich die Beitragssätze jetzt per Knopf erneut aus den Stammdaten übernehmen — praktisch, wenn die Gemeinde-Zuordnung einer Akte nachträglich korrigiert wurde.",
      },
    ],
  },
  {
    version: "1.5.1",
    datum: "13.08.2026",
    iso: "2026-08-13",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7/1.4.1/1.4.3).
    oeffentlich: false,
    punkte: [
      {
        titel: "Update-Fehler auf älteren Windows-Servern behoben",
        text: "Das Einspielen von Updates schlug auf älteren Windows-Servern mit einer TLS-Fehlermeldung fehl, obwohl der Update-Server im Browser normal erreichbar war — behoben.",
      },
    ],
  },
  {
    version: "1.5.0",
    datum: "12.08.2026",
    iso: "2026-08-12",
    punkte: [
      {
        titel: "Ein Klick für Programmstart und Updates",
        text: "FlächenKlar startet jetzt über eine einzelne Datei im Programmordner, die beim Start automatisch prüft, ob eine neue Version vorliegt, und sie bei Bedarf mit einem Klick anbietet. Der bisherige Weg über den Programmordner und eine separate Update-Datei entfällt.",
      },
      {
        titel: "Änderungsübersicht beim Update",
        text: "Der Update-Hinweis zeigt jetzt zusätzlich kurz, was sich seit der installierten Version geändert hat, statt nur die neue Versionsnummer.",
      },
    ],
  },
  {
    version: "1.4.4",
    datum: "12.08.2026",
    iso: "2026-08-12",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7/1.4.1/1.4.3).
    oeffentlich: false,
    punkte: [
      {
        titel: "Wappen bei Verwaltungsgemeinschaften korrigiert",
        text: "Bei Verwaltungsgemeinschaften zeigte das Aufmaßprotokoll teils das Wappen der falschen Gemeinde. Das Protokoll übernimmt jetzt zuverlässig das Wappen der im Projekt gewählten Gemeinde.",
      },
    ],
  },
  {
    version: "1.4.3",
    datum: "06.08.2026",
    iso: "2026-08-06",
    // Hotfix/Patch: intern dokumentiert, aber nicht öffentlich (siehe 1.2.1/1.2.6/1.2.7/1.4.1).
    oeffentlich: false,
    punkte: [
      {
        titel: "Fälligkeitsdatum-Berechnung beim Eintippen korrigiert",
        text: "Beim manuellen Eintippen des Versanddatums konnte das automatisch berechnete Fälligkeitsdatum fälschlich auf ein sehr altes Datum springen. Behoben — die Berechnung funktioniert jetzt zuverlässig, egal ob das Datum eingetippt oder über den Kalender ausgewählt wird.",
      },
    ],
  },
  {
    version: "1.4.2",
    datum: "05.08.2026",
    iso: "2026-08-05",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Ohne Aufmaß ließ sich der Beitragsbescheid bisher gar nicht öffnen, etwa bei…",
        text: "Ohne Aufmaß ließ sich der Beitragsbescheid bisher gar nicht öffnen, etwa bei reiner Grundstücksmehrung ohne neue Geschossfläche — er lässt sich jetzt auch ohne Aufmaß öffnen, mit einer Rückfrage für diesen Sonderfall.",
      },
    ],
  },
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
    version: "1.3.3",
    datum: "23.07.2026",
    iso: "2026-07-23",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Bei einer Nacherhebung war für den Empfänger nicht nachvollziehbar, wie sich…",
        text: "Bei einer Nacherhebung war für den Empfänger nicht nachvollziehbar, wie sich der niedrigere Betrag ergibt — der Bescheid zeigt jetzt die Zahlen-Herleitung.",
      },
      {
        titel: "Bei zwei Zahlungspflichtigen fehlte teils die persönliche Anrede für den zwei…",
        text: "Bei zwei Zahlungspflichtigen fehlte teils die persönliche Anrede für den zweiten — beide werden jetzt korrekt einzeln angeschrieben.",
      },
    ],
  },
  {
    version: "1.3.2",
    datum: "23.07.2026",
    iso: "2026-07-23",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Flächen, die zwar innerhalb der Umrisse liegen, aber nicht mitzählen sollen (…",
        text: "Flächen, die zwar innerhalb der Umrisse liegen, aber nicht mitzählen sollen (z. B. Luftraum, abgemauerte Bereiche), lassen sich jetzt je Geschoss als Abzugsfläche erfassen.",
      },
    ],
  },
  {
    version: "1.3.1",
    datum: "22.07.2026",
    iso: "2026-07-22",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Wurde ein Plan importiert, bevor die Gemeinde-Stammdaten hinterlegt waren, fa…",
        text: "Wurde ein Plan importiert, bevor die Gemeinde-Stammdaten hinterlegt waren, fand der Bescheid anschließend keine ausstellende Behörde für den Briefkopf — bei genau einer hinterlegten Gemeinde übernimmt der Bescheid diese jetzt automatisch.",
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
    version: "1.2.5",
    datum: "04.07.2026",
    iso: "2026-07-04",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Bei detailreichen Plänen mit vielen Winkel-/Gradangaben verwarf das Tool eine…",
        text: "Bei detailreichen Plänen mit vielen Winkel-/Gradangaben verwarf das Tool einen korrekt eingegebenen Maßstab teils fälschlich — das ist behoben.",
      },
    ],
  },
  {
    version: "1.2.4",
    datum: "02.07.2026",
    iso: "2026-07-02",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Das Datum im Aufmaßblatt zeigte das ursprüngliche Anlagedatum des Projekts st…",
        text: "Das Datum im Aufmaßblatt zeigte das ursprüngliche Anlagedatum des Projekts statt des Ausdruck-Datums — es zeigt jetzt das tatsächliche Export-Datum.",
      },
    ],
  },
  {
    version: "1.2.3",
    datum: "25.06.2026",
    iso: "2026-06-25",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Der errechnete Wert der Vollgeschoss-Teilfläche (≥ 2,30 m lichte Höhe) lässt…",
        text: "Der errechnete Wert der Vollgeschoss-Teilfläche (≥ 2,30 m lichte Höhe) lässt sich jetzt von Hand nachjustieren, wenn er um Zentimeter nicht passt.",
      },
    ],
  },
  {
    version: "1.2.2",
    datum: "25.06.2026",
    iso: "2026-06-25",
    // Patch-Release: intern dokumentiert, aber nicht öffentlich.
    oeffentlich: false,
    punkte: [
      {
        titel: "Das Tool gleicht einen eingegebenen Maßstab jetzt automatisch gegen die im Pl…",
        text: "Das Tool gleicht einen eingegebenen Maßstab jetzt automatisch gegen die im Plan gemessene Bemaßung ab und warnt, wenn ein Plan nicht maßstabsgetreu exportiert wurde (z. B. „Auf Seite anpassen“).",
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
