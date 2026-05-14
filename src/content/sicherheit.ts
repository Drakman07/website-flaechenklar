import {
  WifiOff,
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SicherheitsPunkt = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const sicherheit: readonly SicherheitsPunkt[] = [
  {
    icon: WifiOff,
    title: "Vollständig offline",
    text: "Läuft per Doppelklick im Browser. Kein Server, keine Cloud. Daten bleiben auf dem Arbeitsplatz-PC.",
  },
  {
    icon: ShieldCheck,
    title: "DSGVO-konform",
    text: "Keine personenbezogene Datenübertragung. Genau zwei passive GETs auf GitHub Pages (Update-Check & Lizenz-Hash), beides öffentliche statische Dateien.",
  },
  {
    icon: Lock,
    title: "Lizenz per Hash, nicht per ID",
    text: "Die Allowlist enthält nur SHA256-Hashes. Aus einem Hash lässt sich die Kunden-ID nicht rekonstruieren.",
  },
  {
    icon: Database,
    title: "Eigene Datenhoheit",
    text: "Projekte werden als .gfproj-Datei gespeichert — Sie entscheiden, wo (Aktenlaufwerk, Netzlaufwerk, lokaler Ordner).",
  },
  {
    icon: Cpu,
    title: "Kein Build, kein Bundler",
    text: "Quellcode-transparent. Browser-Source-View funktioniert. Jede Prüfstelle kann reinschauen.",
  },
  {
    icon: AlertCircle,
    title: "Auto-Recovery",
    text: "Snapshot alle 30 Sekunden in der browser-lokalen IndexedDB. Bei Crash: letzten Stand wiederherstellen.",
  },
] as const;
