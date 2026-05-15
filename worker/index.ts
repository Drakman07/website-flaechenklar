export interface Env {
  ASSETS: Fetcher;
}

/**
 * Kanonischer Host: bare-domain ohne www, ueber HTTPS.
 * Andere Schreibweisen werden per 301 hierauf umgeleitet.
 */
const CANONICAL_HOST = "flaechenklar.de";

/**
 * Routen, die auf statische Sub-Dateien gemappt werden.
 * Reihenfolge: laenger-spezifischer Pfad zuerst, falls noetig.
 */
const STATIC_REWRITES: Readonly<Record<string, string>> = {
  "/impressum": "/impressum.html",
  "/datenschutz": "/datenschutz.html",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1) Canonical-Redirects: HTTPS erzwingen + www. entfernen.
    //    Cloudflare hat zwar haeufig "Always Use HTTPS" aktiv und proxyt www. mit,
    //    aber ein expliziter 301 hier macht das versioniert und unabhaengig vom
    //    Dashboard-Setting. Wirkt auch lokal in wrangler dev.
    const needsHttps = url.protocol === "http:";
    const needsBareHost = url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`;
    if (needsHttps || needsBareHost) {
      const target = new URL(url.toString());
      target.protocol = "https:";
      target.hostname = CANONICAL_HOST;
      return Response.redirect(target.toString(), 301);
    }

    // 2) Statische Rewrites fuer Legal-Pages (saubere URLs ohne .html-Endung).
    const rewriteTo = STATIC_REWRITES[url.pathname];
    if (rewriteTo) {
      return env.ASSETS.fetch(
        new Request(new URL(rewriteTo, url), request),
      );
    }

    // 3) Default: statische Assets ausliefern (mit SPA-Fallback aus wrangler.toml).
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
