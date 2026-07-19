# Video-Assets (Cloudflare R2)

Die Vorstellungsvideos (Teaser + 4 Walkthrough-Kapitel) liegen in
einem R2-Bucket mit Custom-Domain.

## Bucket-Setup (einmalig)

1. R2-Bucket `flaechenklarvideos` über Cloudflare-Dashboard anlegen
2. Custom-Domain `videos.flaechenklar.de` mit dem Bucket verknüpfen
   (Cloudflare → R2 → Bucket → Settings → Custom Domains)
3. CORS-Regel hinzufügen, damit VTT-Captions vom Browser geladen werden:
   ```json
   [{
     "AllowedOrigins": ["https://flaechenklar.de", "https://www.flaechenklar.de"],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["Range"],
     "MaxAgeSeconds": 3600
   }]
   ```

## Asset-Upload pro Video

Jedes fertig produzierte Video besteht aus drei Dateien:

| Datei | Content-Type | Zweck |
|---|---|---|
| `<name>.mp4` | `video/mp4` | Das Video selbst, H.264 1080p CRF 23 |
| `<name>.de.vtt` | `text/vtt` | Deutsche Untertitel |
| `<name>-poster.webp` | `image/webp` | Standbild aus dem ersten Frame |

Upload per Wrangler:

```bash
wrangler r2 object put flaechenklarvideos/teaser.mp4 \
  --file=./produktion/teaser.mp4 \
  --content-type=video/mp4

wrangler r2 object put flaechenklarvideos/teaser.de.vtt \
  --file=./produktion/teaser.de.vtt \
  --content-type=text/vtt

wrangler r2 object put flaechenklarvideos/teaser-poster.webp \
  --file=./produktion/teaser-poster.webp \
  --content-type=image/webp
```

Cache-Control wird automatisch auf den Bucket-Default gesetzt. Falls
nicht: `--cache-control "public, max-age=31536000"` anhängen.

## Asset-Liste (final)

```
videos.flaechenklar.de/teaser.mp4
videos.flaechenklar.de/teaser.de.vtt
videos.flaechenklar.de/teaser-poster.webp
videos.flaechenklar.de/tour-kapitel-1.mp4
videos.flaechenklar.de/tour-kapitel-1.vtt
videos.flaechenklar.de/tour-kapitel-1-poster.webp
videos.flaechenklar.de/tour-kapitel-2.mp4
videos.flaechenklar.de/tour-kapitel-2.vtt
videos.flaechenklar.de/tour-kapitel-2-poster.webp
videos.flaechenklar.de/tour-kapitel-3.mp4
videos.flaechenklar.de/tour-kapitel-3.vtt
videos.flaechenklar.de/tour-kapitel-3-poster.webp
videos.flaechenklar.de/tour-kapitel-4.mp4
videos.flaechenklar.de/tour-kapitel-4.vtt
videos.flaechenklar.de/tour-kapitel-4-poster.webp
videos.flaechenklar.de/tutorial-kapitel-{1..13}.mp4
videos.flaechenklar.de/tutorial-kapitel-{1..13}-poster.webp
```

## Tutorial v1.3 (2026-07-19, 13 Kapitel)

Komplettes Tutorial-Drehbuch ersetzt (s. `tutorial-spicker-v1.3.pdf` im
Projekt-Hauptordner). Rohmaterial lag als OBS-`.mkv` in
`tutorial-videos-v1.3/` (außerhalb des Website-Repos), Encoding lokal per
ffmpeg (`-c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -c:a aac
-b:a 160k -movflags +faststart`), Poster per `-ss 3 -frames:v 1 -c:v
libwebp -q:v 82`. Kapitel 4/5 und 9/10 sind Split/Concat aus je einer
Aufnahme (Zeitstempel-Schnitt per `-ss`/`-t`, Kapitel 9 zusätzlich
`concat`-Demuxer über zwei Segmente).

**VTT-Untertitel bewusst nicht erzeugt** (User-Entscheidung 2026-07-19):
alte Kapitel-1..10-VTTs auf R2 stammen vom v1.2-Drehbuch und passen
nicht mehr — `captions`-Feld in `Tutorial.tsx` daher komplett entfernt,
bis neue Untertitel produziert sind. Whisper via `ffmpeg`-Filter
(`whisper.cpp`, auf diesem Rechner verfügbar) wäre der Weg, braucht
aber noch einen separaten Modell-Download (nicht identisch mit der
lokalen Diktier-App „Handy", die ein anderes Modellformat nutzt).

Naming ist 1:1 gleich geblieben (`tutorial-kapitel-N.mp4/-poster.webp`),
daher reines Überschreiben der alten Objekte — kein Löschen nötig,
Cache-Busting über `?v=N`-Query in `Tutorial.tsx` erledigt den Rest.

> **Naming-Konvention:** Der Teaser verwendet historisch das `.de.vtt`-Suffix,
> die vier Walkthrough-Kapitel das kürzere `.vtt`-Suffix. Beide Varianten
> funktionieren — das Tool gibt im `<track>`-Element ohnehin explizit
> `srcLang="de"` an. Beim Hochladen weiterer Assets bitte das jeweilige
> Schema beibehalten.

## Echte URLs einsetzen (nach Video-Produktion)

Sobald die Videos hochgeladen sind:
1. `src/sections/TeaserSection.tsx` — `TEASER`-Objekt mit echter URL ersetzen
2. `src/pages/Tour.tsx` — `KAPITEL`-Array (4 Einträge) mit echten URLs ersetzen
3. `npm run build && npm run deploy`
4. Smoke-Test auf Produktion: alle 5 Videos starten, Captions sichtbar,
   keine Cross-Origin-Errors in DevTools

## Asset-Erreichbarkeit prüfen

```bash
curl -I https://videos.flaechenklar.de/teaser.mp4
```

Expected: `HTTP/2 200`, `content-type: video/mp4`, `cache-control: public, max-age=31536000` (oder vom Bucket-Default).
