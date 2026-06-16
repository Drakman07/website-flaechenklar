import { useEffect, useState } from "react";

export type Route = "home" | "tour" | "tutorial" | "versionen";

export type RoutePath = "/" | "/tour" | "/tutorial" | "/versionen";

const TITLES: Record<Route, string> = {
  home: "FlächenKlar — Aufmaß für bayerische Bauämter",
  tour: "FlächenKlar — Komplette Tour",
  tutorial: "FlächenKlar — Komplettes Tutorial (rund 45 Minuten)",
  versionen: "FlächenKlar — Versionsverlauf",
};

const DESCRIPTIONS: Record<Route, string> = {
  home: "FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF laden, Polygon zeichnen, druckreifes Aufmaßprotokoll nach Art. 5 KAG Bayern. Komplett offline.",
  tour: "Komplette Tour durch FlächenKlar: 4 Kapitel à 60 Sekunden zu Schnellstart, Vollgeschossen, mehrgeschossigen Gebäuden und Export.",
  tutorial: "Schritt-für-Schritt-Tutorial: FlächenKlar in 8 Kapiteln und rund 45 Minuten — vom ersten Doppelklick bis zu Vollgeschoss-Berechnung und Aufmaßprotokoll. Ersatz für die Vor-Ort-Einarbeitung.",
  versionen: "Versionsverlauf von FlächenKlar: alle Releases im Überblick — was in welcher Version dazugekommen ist, chronologisch und nachvollziehbar dokumentiert.",
};

function pathToRoute(pathname: string): Route {
  if (pathname === "/tour") return "tour";
  if (pathname === "/tutorial") return "tutorial";
  if (pathname === "/versionen") return "versionen";
  return "home";
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
