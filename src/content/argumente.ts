import { Coins, Wallet, Lock, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Argument = { icon: LucideIcon; title: string; text: string };

/**
 * Sekundaer-Argumente fuer die Argumente-Sektion. Das Haupt-Argument
 * (Einnahmen-Framing) steht als eigene Hero-Card direkt in Argumente.tsx,
 * weil es Bezug auf die Preise-Sektion nimmt (Anker "#preise").
 */
export const argumente: readonly Argument[] = [
  {
    icon: Wallet,
    title: "Einmalkauf, keine Software-Miete",
    text: "Einmal bezahlt, dauerhaft im Einsatz. Ab Jahr 2 nur die Wartungspauschale — jährlich kündbar, kein Vendor-Lock-in, kein Lizenz-Countdown.",
  },
  {
    icon: Lock,
    title: "Läuft offline, Daten bleiben im Amt",
    text: "Kein Cloud-Zwang, keine Datenübermittlung an Dritte. Pläne und Aufmaße verlassen nie den Rechner im Bauamt — die DSGVO-Rückfrage entfällt von selbst.",
  },
  {
    icon: UserCheck,
    title: "Von einem Sachbearbeiter, für Sachbearbeiter",
    text: "Entstanden im eigenen Bauamt, an amtlichen Mustern orientiert. Kein Konzern-Tool von außen, sondern von jemandem, der die Prüfung selbst macht.",
  },
] as const;

export const argumenteHeroIcon: LucideIcon = Coins;
