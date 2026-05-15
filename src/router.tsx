import { useEffect, useState } from "react";

export type Route = "home" | "tour";

export type RoutePath = "/" | "/tour";

const TITLES: Record<Route, string> = {
  home: "FlächenKlar — Aufmaß für bayerische Bauämter",
  tour: "FlächenKlar — Komplette Tour",
};

const DESCRIPTIONS: Record<Route, string> = {
  home: "FlächenKlar ist das Aufmaß-Werkzeug für bayerische Bauämter. PDF laden, Polygon zeichnen, druckreifes Aufmaßprotokoll nach Art. 5 KAG Bayern. Komplett offline.",
  tour: "Komplette Tour durch FlächenKlar: 4 Kapitel à 60 Sekunden zu Schnellstart, Vollgeschossen, mehrgeschossigen Gebäuden und Export.",
};

function pathToRoute(pathname: string): Route {
  return pathname === "/tour" ? "tour" : "home";
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
