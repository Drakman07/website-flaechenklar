/**
 * Inhalte + Release-Flag für das Bescheidmodul (Add-on: erzeugt Entwürfe von
 * Herstellungsbeitragsbescheiden nach Art. 5 KAG Bayern).
 *
 * Zwei Phasen über EIN Flag:
 * - Phase A (Teaser, `bescheidReleased = false`): Sektion zeigt Badge
 *   „In Vorbereitung" + „Jetzt vormerken"-CTA, KEINE Preise.
 * - Phase B (Vollausbau zum v1.3-Release, `bescheidReleased = true`):
 *   Preis-Add-on je Stufe in den Preiskarten, CTA verweist auf #preise.
 *
 * Zum Release umlegen: siehe Plan / README-Kommentar unten.
 */

/**
 * Release-Flag: false = Teaser (Phase A), true = Vollausbau (Phase B, v1.3).
 *
 * Explizite `: boolean`-Annotation ist Absicht: ohne sie narrowt TS strict
 * auf den Literal-Typ `false`, wodurch der Phase-B-Code-Pfad
 * (`bescheidReleased && …`) als „unerreichbar" markiert und der Vergleich
 * zum Compile-Fehler würde. Beide Zweige müssen typecheckbar bleiben.
 */
export const bescheidReleased: boolean = true;

/** Nutzen-Argumente der Bescheidmodul-Sektion (Reihenfolge = Anzeige). */
export const bescheidBullets: readonly string[] = [
  "Übernimmt Geschossfläche und Beitragssatz direkt aus der Berechnung — die Werte werden übernommen statt abgetippt",
  "Entwurf orientiert am amtlichen Muster für Herstellungsbeitragsbescheide",
  "Satzungsdaten Ihrer Gemeinde einmal hinterlegen, für jeden Entwurf wiederverwenden",
  "Begründung und Rechtsbehelfsbelehrung als anpassbare Textbausteine",
  "Der Entwurf bleibt Entwurf: fachliche Prüfung und Erlass liegen bei der Gemeinde",
] as const;

/** Sektions-Label (Eyebrow) — hebt das Modul als eigenständigen Schritt hervor. */
export const bescheidLabel = "Das Bescheidmodul · Schritt 3";

/** mailto-Link für die „Jetzt vormerken"-Aktion (Phase A). */
export const bescheidMailto: string =
  "mailto:info@flaechenklar.de?subject=" +
  encodeURIComponent("Vormerkung Bescheidmodul – FlächenKlar");
