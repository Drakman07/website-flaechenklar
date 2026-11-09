export interface Env {
  ASSETS: Fetcher;
}

/**
 * Kanonischer Host: bare-domain ohne www, ueber HTTPS.
 * Andere Schreibweisen werden per 301 hierauf umgeleitet.
 */
const CANONICAL_HOST = "flaechenklar.de";

/**
 * Adressen der alten React-Seite, die es seit der statischen Seite (09.11.2026)
 * nicht mehr gibt, mit ihrem Nachfolger. Die Tour zeigte Version 0.1.0-dev
 * und ist im Tutorial aufgegangen.
 */
const UMLEITUNGEN = new Map<string, string>([
  ["/tour", "/tutorial"],
  ["/index.html", "/"],
  ["/index", "/"],
]);

/** Seiten aus dist/ (scripts/baue-seite.mjs); /<seite>.html leitet auf /<seite> um. */
const SEITEN = new Set(["demo", "tutorial", "versionen", "impressum", "datenschutz"]);

/**
 * Teil-Antworten (206) fuer die Videos der Startseite. Der Asset-Resolver
 * beantwortet Range-Anfragen mit der ganzen Datei (200, gemessen 09.11.2026
 * auf flaechenklar.de und in wrangler dev). Ohne 206 spielt Safari MP4 nicht ab
 * und Chrome kann nicht spulen; der Werkzeug-Film wird aber per Scroll gespult.
 * Die Dateien sind klein (unter 6 MB), Lesen und Zuschneiden im Worker reicht.
 */
async function alsTeil(request: Request, res: Response): Promise<Response> {
  if (res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set("Accept-Ranges", "bytes");
  const range = /^bytes=(\d*)-(\d*)$/.exec((request.headers.get("Range") ?? "").trim());
  if (request.method !== "GET" || !range || (range[1] === "" && range[2] === "")) {
    return new Response(res.body, { status: 200, headers });
  }
  const daten = await res.arrayBuffer();
  const laenge = daten.byteLength;
  let von: number;
  let bis: number;
  if (range[1] === "") {
    von = Math.max(0, laenge - Number(range[2]));
    bis = laenge - 1;
  } else {
    von = Number(range[1]);
    bis = range[2] === "" ? laenge - 1 : Math.min(Number(range[2]), laenge - 1);
  }
  if (von >= laenge || von > bis) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${laenge}` } });
  }
  headers.set("Content-Range", `bytes ${von}-${bis}/${laenge}`);
  headers.set("Content-Length", String(bis - von + 1));
  return new Response(daten.slice(von, bis + 1), { status: 206, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Canonical-Redirects: HTTPS erzwingen + www. entfernen.
    // Cloudflare hat zwar haeufig "Always Use HTTPS" aktiv und proxyt www. mit,
    // aber ein expliziter 301 hier macht das versioniert und unabhaengig vom
    // Dashboard-Setting. In wrangler dev (localhost, http) greift nur der www-Teil.
    const needsHttps = url.protocol === "http:" && url.hostname !== "localhost";
    const needsBareHost = url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`;
    if (needsHttps || needsBareHost) {
      const target = new URL(url.toString());
      target.protocol = "https:";
      target.hostname = CANONICAL_HOST;
      return Response.redirect(target.toString(), 301);
    }

    const path =
      url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

    // Alte Adressen, .html-Schreibweisen und Schrägstrich am Ende dauerhaft auf
    // die saubere Adresse (der Asset-Resolver antwortet sonst mit 307).
    const ziel =
      UMLEITUNGEN.get(path) ??
      (/^\/[a-z0-9-]+\.html$/.test(path) && SEITEN.has(path.slice(1, -5))
        ? path.slice(0, -5)
        : path !== url.pathname
          ? path
          : undefined);
    if (ziel) {
      return Response.redirect(new URL(ziel + url.search, url).toString(), 301);
    }

    // Die Fehlerseite selbst ist keine Seite: auch unter /404 mit Status 404.
    if (path === "/404" || path === "/404.html") {
      return env.ASSETS.fetch(new Request(new URL("/__keine-seite__", url), request));
    }

    // Alles andere liefert der Asset-Resolver: /demo -> dist/demo.html,
    // unbekannte Pfade -> dist/404.html mit Status 404 (wrangler.toml).
    if (/^\/assets\/[^/]+\.mp4$/.test(path)) {
      // Range nicht an den Resolver weiterreichen, er liefert ohnehin die ganze Datei.
      const ohneRange = new Request(request.url, { method: request.method, headers: { Accept: "*/*" } });
      return alsTeil(request, await env.ASSETS.fetch(ohneRange));
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
