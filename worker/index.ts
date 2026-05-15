export interface Env {
  ASSETS: Fetcher;
}

/**
 * Kanonischer Host: bare-domain ohne www, ueber HTTPS.
 * Andere Schreibweisen werden per 301 hierauf umgeleitet.
 */
const CANONICAL_HOST = "flaechenklar.de";

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

    // Default: statische Assets ausliefern (mit SPA-Fallback aus wrangler.toml).
    // Cloudflare uebernimmt selbst:
    //  - .html-Stripping: /impressum  -> dist/impressum.html
    //  - SPA-Fallback: alle unbekannten Pfade -> dist/index.html
    //  - Content-Type-Header passend zur Extension
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
