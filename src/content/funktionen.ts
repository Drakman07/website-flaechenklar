import {
  FileText,
  Pencil,
  Calculator,
  Layers,
  FileCheck2,
  ShieldCheck,
  Workflow,
  Printer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Funktion = { icon: LucideIcon; title: string; text: string };

export const funktionen: readonly Funktion[] = [
  {
    icon: FileText,
    title: "PDF-Import",
    text: "Digitalen Bauantrag direkt im Browser öffnen. Keine Konvertierung, kein Upload.",
  },
  {
    icon: Pencil,
    title: "Polygon zeichnen",
    text: "Geschossflächen mit der Maus umfahren. Falsch gezogen? Einfach neu, nicht neu anfangen.",
  },
  {
    icon: Calculator,
    title: "Maßstab automatisch",
    text: "Erkennt den Maßstab aus dem Plankopf und rechnet Pixel in Quadratmeter um.",
  },
  {
    icon: Layers,
    title: "Mehrere Geschosse",
    text: "EG, OG, DG, Keller — jede Ebene einzeln. Summe und Einzelwerte landen im Protokoll.",
  },
  {
    icon: FileCheck2,
    title: "Vollgeschoss-Logik",
    text: "Prüfung nach Art. 2 BayBO automatisch. Halbgeschoss oder Vollgeschoss? Das Tool weiß es.",
  },
  {
    icon: ShieldCheck,
    title: "Offline & lokal",
    text: "Läuft im Browser, ohne Cloud, ohne Account. Plan verlässt nie Ihren Rechner.",
  },
  {
    icon: Workflow,
    title: "Reproduzierbar",
    text: "Projekt-Datei speichern, später öffnen, weiterarbeiten. Übergabe an Kollegen ohne Reibung.",
  },
  {
    icon: Printer,
    title: "Druckreifes Protokoll",
    text: "PDF-Aufmaßprotokoll als Berechnungsgrundlage für den Herstellungsbeitrag nach Art. 5 KAG Bayern.",
  },
] as const;
