import {
  FileText,
  Ruler,
  PenTool,
  Layers,
  Triangle,
  FileOutput,
  Save,
  Cpu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Funktion = { icon: LucideIcon; title: string; text: string };

export const funktionen: readonly Funktion[] = [
  {
    icon: FileText,
    title: "Bauantrags-PDFs direkt laden",
    text: "PDF per Drag & Drop laden, im Browser anzeigen, blättern. Keine Konvertierung, kein Drucken, kein zweiter Bildschirm.",
  },
  {
    icon: Ruler,
    title: "Maßstab pro Plan-Region",
    text: "Zwei Klicks auf eine eingezeichnete Bemaßung, Sollwert eintippen — Region kalibriert. Mehrere Maßstäbe pro Seite kein Problem.",
  },
  {
    icon: PenTool,
    title: "Polygone mit Snap & Bemaßung",
    text: "Außenkontur abklicken, Kanten nachträglich bemaßen, Eckpunkte verschieben. Fläche per Shoelace-Formel automatisch.",
  },
  {
    icon: Layers,
    title: "Geschosse separat verwalten",
    text: "EG, OG, DG — jedes Geschoss eigene Polygone, eigene Regionen, eigene Berechnung. Übersichtlich in der Seitenleiste.",
  },
  {
    icon: Triangle,
    title: "Vollgeschoss-Berechnung (Dach)",
    text: "Art. 83 Abs. 7 BayBO als Modul: Kniestock, Dachneigung, Gauben → Anteil ≥ 2,30 m. Mit SVG-Diagramm zur Plausibilität.",
  },
  {
    icon: FileOutput,
    title: "Druckreifes Aufmaßprotokoll",
    text: "Ein Klick → PDF mit Deckblatt, Geschossaufstellung, Plan-Ausschnitten und Berechnungsanhang. Akten-fertig.",
  },
  {
    icon: Save,
    title: ".gfproj-Projektdatei",
    text: "Kompletter Stand inkl. Original-PDF in einer Datei. Archivierbar, weitergebbar, jederzeit wieder aufrufbar.",
  },
  {
    icon: Cpu,
    title: "Auto-Recovery",
    text: "Browser stürzt ab? IndexedDB-Snapshot alle 30 Sekunden — kein Datenverlust beim nächsten Start.",
  },
] as const;
