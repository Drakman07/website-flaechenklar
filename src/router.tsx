import { useEffect, useState } from "react";

export type Route = "home" | "tour" | "tutorial" | "versionen" | "notfound";

export type RoutePath = "/" | "/tour" | "/tutorial" | "/versionen";

const TITLES: Record<Route, string> = {
  home: "FlächenKlar — Vom Aufmaß zum Bescheid-Entwurf",
  tour: "FlächenKlar — Komplette Tour",
  tutorial: "FlächenKlar — Komplettes Tutorial (rund einer Stunde)",
  versionen: "FlächenKlar — Versionsverlauf",
  notfound: "FlächenKlar — Seite nicht gefunden",
};

const DESCRIPTIONS: Record<Route, string> = {
  home: "FlächenKlar begleitet bayerische Bauämter vom Aufmaß über die Vollgeschoss-Prüfung bis zum Bescheid-Entwurf nach Art. 5 KAG Bayern. Komplett offline, ohne Cloud.",
  tour: "Komplette Tour durch FlächenKlar: 4 Kapitel à 60 Sekunden zu Schnellstart, Vollgeschossen, mehrgeschossigen Gebäuden und Export.",
  tutorial: "Schritt-für-Schritt-Tutorial: FlächenKlar in 13 Kapiteln und rund einer Stunde — vom ersten Doppelklick bis zum fertigen Beitragsbescheid, inklusive Foto-Import und RIWA-Datenexport. Ersatz für die Vor-Ort-Einarbeitung.",
  versionen: "Versionsverlauf von FlächenKlar: alle Releases im Überblick — was in welcher Version dazugekommen ist, chronologisch und nachvollziehbar dokumentiert.",
  notfound: "Diese Seite gibt es auf flaechenklar.de nicht. Weiter zur Startseite, zur Tour oder zum Tutorial.",
};

function pathToRoute(pathname: string): Route {
  // Abschliessende Slashes ignorieren ("/tour/" == "/tour").
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "/" || path === "" || path === "/index.html") return "home";
  if (path === "/tour") return "tour";
  if (path === "/tutorial") return "tutorial";
  if (path === "/versionen") return "versionen";
  return "notfound";
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    pathToRoute(window.location.pathname),
  );

  useEffect(() => {
    function onPopState(): void {
      setRoute(pathToRoute(window.location.pathname));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", DESCRIPTIONS[route]);
    }
  }, [route]);

  return route;
}

export function navigate(to: RoutePath): void {
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
