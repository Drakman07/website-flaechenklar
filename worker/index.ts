export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/impressum") {
      return env.ASSETS.fetch(
        new Request(new URL("/impressum.html", url), request),
      );
    }
    if (url.pathname === "/datenschutz") {
      return env.ASSETS.fetch(
        new Request(new URL("/datenschutz.html", url), request),
      );
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
