export type FaqItem = {
  /** Frage als Volltext (auch für JSON-LD FAQPage-Schema verwendet). */
  q: string;
  /** Antwort als Plaintext (keine Markdown- oder HTML-Auszeichnungen — wird sowohl in der UI als auch im strukturierten Daten-Schema 1:1 ausgegeben). */
  a: string;
};

export const faq: readonly FaqItem[] = [
  {
    q: "Was ist die Geschossfläche und wofür brauche ich sie?",
    a: "Die Geschossfläche ist die Summe aller Vollgeschoss-Flächen eines Gebäudes. In Bayern wird sie unter anderem als Bemessungsgrundlage für den Herstellungsbeitrag nach Art. 5 KAG verwendet. Bauämter ermitteln sie aus den Bauantrags-Plänen — bei FlächenKlar geht das in wenigen Minuten ohne Lineal direkt aus dem digitalen PDF.",
  },
  {
    q: "Wie funktioniert die Vollgeschoss-Berechnung nach Art. 83 Abs. 7 BayBO?",
    a: "Ein Dachgeschoss zählt als Vollgeschoss, wenn die Fläche mit lichter Höhe ab 2,30 m mehr als zwei Drittel der darunterliegenden Geschossfläche ausmacht. FlächenKlar berechnet das aus Gebäudemaßen, Kniestockhöhen, Dachneigungen und Gauben — inklusive SVG-Diagrammen zur Plausibilitätsprüfung gegen das gezeichnete Polygon.",
  },
  {
    q: "Muss FlächenKlar installiert werden?",
    a: "Nein. FlächenKlar läuft komplett im Browser, ohne Installation, ohne Admin-Rechte, ohne Server-Komponente. Ein Doppelklick auf die index.html-Datei reicht — auch von einem USB-Stick oder einem freigegebenen Laufwerk.",
  },
  {
    q: "Ist FlächenKlar DSGVO-konform?",
    a: "Ja. Das Tool läuft zu 100 Prozent offline im Browser: keine Cloud-Calls, keine Datenübertragung an Dritte, keine Cookies, kein Tracking. Bauantrags-Daten verlassen nie den Rechner des Sachbearbeiters. Damit ist die Datenschutz-Frage für sensible Behörden-Daten ohne weitere Vereinbarung gelöst.",
  },
  {
    q: "Welche Browser unterstützt FlächenKlar?",
    a: "Alle aktuellen Versionen von Microsoft Edge, Google Chrome und Mozilla Firefox auf Windows, macOS und Linux. Internet Explorer wird nicht unterstützt.",
  },
  {
    q: "Was kostet FlächenKlar für eine Kommune?",
    a: "Einmalkauf gestaffelt nach Einwohnerklasse: 1.600 Euro netto für Kommunen bis 3.000 Einwohner, 3.100 Euro netto für 3.000 bis 8.000 Einwohner, 5.800 Euro netto für 8.000 bis 15.000 Einwohner, 10.500 Euro netto für 15.000 bis 30.000 Einwohner und 14.500 Euro netto über 30.000 Einwohner. Die Wartung im ersten Jahr ist enthalten, ab dem zweiten Jahr 10 Prozent pro Jahr, jährlich kündbar. Pilot-Kunden erhalten 50 Prozent Rabatt.",
  },
  {
    q: "Kann ich das Aufmaßprotokoll als PDF an die Akte hängen?",
    a: "Ja, genau dafür ist das Aufmaßprotokoll gedacht: ein druckreifes PDF mit Deckblatt, Geschossaufstellung, Plan-Ausschnitten und vollständigem Berechnungsanhang. Akten-fertig und nachvollziehbar.",
  },
  {
    q: "Was passiert mit meinen Daten, wenn der Browser abstürzt?",
    a: "FlächenKlar legt alle 30 Sekunden einen IndexedDB-Snapshot des aktuellen Standes an. Nach einem Browser-Absturz wird beim nächsten Start automatisch der letzte gespeicherte Zustand angeboten — kein Datenverlust.",
  },
] as const;
