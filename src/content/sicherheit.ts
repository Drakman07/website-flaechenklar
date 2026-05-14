import { Lock, CloudOff, FileLock2, KeyRound, Eye, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SicherheitsPunkt = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const sicherheit: readonly SicherheitsPunkt[] = [
  {
    icon: CloudOff,
    title: "Keine Cloud",
    text: "Pläne werden ausschließlich lokal verarbeitet. Es findet keine Übertragung an Dritte statt.",
  },
  {
    icon: Lock,
    title: "Kein Tracking",
    text: "Kein Analytics, kein Fingerprinting, keine Cookies. Was Sie tun, bleibt auf Ihrem Gerät.",
  },
  {
    icon: FileLock2,
    title: "Keine Registrierung",
    text: "Kein Account, keine E-Mail-Bestätigung. Tool öffnen und arbeiten.",
  },
  {
    icon: KeyRound,
    title: "Lizenz lokal",
    text: "Lizenzdatei liegt auf dem Rechner der Behörde. Keine Online-Aktivierung.",
  },
  {
    icon: Eye,
    title: "Quelltext prüfbar",
    text: "HTML/JavaScript ist lesbar. Datenschutzbeauftragter kann den Code einsehen.",
  },
  {
    icon: Server,
    title: "Keine Server-Abhängigkeit",
    text: "Kein Ausfall durch Hosting-Probleme. Tool funktioniert, solange der Browser funktioniert.",
  },
] as const;
