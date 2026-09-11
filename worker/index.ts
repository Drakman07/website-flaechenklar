export interface Env {
  ASSETS: Fetcher;
}

/**
 * Kanonischer Host: bare-domain ohne www, ueber HTTPS.
 * Andere Schreibweisen werden per 301 hierauf umgeleitet.
 */
const CANONICAL_HOST = "flaechenklar.de";

/** Pfade, die die React-App selbst rendert (src/router.tsx). */
const SPA_ROUTES = new Set(["/", "/tour", "/tutorial", "/versionen"]);

/** Statische HTML-Seiten aus public/ (Cloudflare strippt ".html"). */
const STATIC_PAGES = new Set(["/impressum", "/datenschutz"]);

/** Antwort mit Status 404 neu verpacken, Body und Header bleiben erhalten. */
function asNotFound(res: Response): Response {
  return new Response(res.body, {
    status: 404,
    statusText: "Not Found",
    headers: res.headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Canonical-Redirects: HTTPS erzwingen + www. entfernen.
    // Cloudflare hat zwar haeufig "Always Use HTTPS" aktiv und proxyt www. mit,
    // aber ein expliziter 301 hier macht das versioniert und unabhaengig vom
    // Dashboard-Setting. Wirkt auch lokal in wrangler dev.
    const needsHttps = url.protocol === "http:";
    const needsBareHost = url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`;
    if (needsHttps || needsBareHost) {
      const target = new URL(url.toString());
      target.protocol = "https:";
      target.hostname = CANONICAL_HOST;
      return Response.redirect(target.toString(), 301);
    }

    // Statische Assets ausliefern (mit SPA-Fallback aus wrangler.toml).
    // Cloudflare uebernimmt selbst:
    //  - .html-Stripping: /impressum  -> dist/impressum.html
    //  - SPA-Fallback: alle unbekannten Pfade -> dist/index.html
    //  - Content-Type-Header passend zur Extension
    // Der SPA-Fallback antwortet aber immer mit 200. Damit Crawler unbekannte
    // Adressen nicht als Duplikat der Startseite indexieren, setzt der Worker
    // dort Status 404 (die App zeigt dann ihre 404-Seite).
    const path =
      url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

    if (SPA_ROUTES.has(path) || STATIC_PAGES.has(path)) {
      return env.ASSETS.fetch(request);
    }

    const lastSegment = path.slice(path.lastIndexOf("/") + 1);
    if (lastSegment.includes(".")) {
      // Datei-Anfrage: fehlt die Datei, liefert der Fallback index.html mit
      // 200 -> als 404 markieren. Echte .html-Dateien bleiben unberuehrt.
      const res = await env.ASSETS.fetch(request);
      const isHtml = (res.headers.get("content-type") ?? "").includes("text/html");
      if (res.ok && isHtml && !/\.html?$/i.test(path)) {
        return asNotFound(res);
      }
      return res;
    }

    // Unbekannter Pfad ohne Dateiendung: SPA-Shell mit Status 404.
    const shell = await env.ASSETS.fetch(new Request(new URL("/", url), request));
    return asNotFound(shell);
  },
} satisfies ExportedHandler<Env>;
