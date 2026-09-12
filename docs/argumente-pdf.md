# PDF-Einseiter „Argumente für den Bürgermeister"

Quelle: `docs/argumente-buergermeister-print.html` (eigenständiges,
druckgestyltes HTML — kein Teil des React-Builds, keine neue npm-Dependency).
Ausgabe: `public/argumente-buergermeister.pdf`.

Bewusst **ohne Preisangaben** — das Blatt kursiert unkontrolliert im Rathaus
und darf bei Preisänderungen nicht veralten (siehe Preise-Sektion für die
aktuelle Staffel).

## Neu erzeugen

Nach Text-Änderungen an `docs/argumente-buergermeister-print.html` neu
rendern via headless Edge (oder Chrome):

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="public/argumente-buergermeister.pdf" \
  "file:///$(pwd)/docs/argumente-buergermeister-print.html"
```

Danach Druckbild kurz gegenprüfen (eine Seite, DIN A4, keine abgeschnittenen
Cards) und `public/argumente-buergermeister.pdf` committen.
