import { useEffect } from "react";
import { Hero } from "@/sections/Hero";
import { TeaserSection } from "@/sections/TeaserSection";
import { ProblemChance } from "@/sections/ProblemChance";
import { Prozess } from "@/sections/Prozess";
import { Founder } from "@/sections/Founder";
import { Funktionen } from "@/sections/Funktionen";
import { Vollgeschoss } from "@/sections/Vollgeschoss";
import { Bescheid } from "@/sections/Bescheid";
import { Sicherheit } from "@/sections/Sicherheit";
import { DemoBanner } from "@/sections/DemoBanner";
import { Preise } from "@/sections/Preise";
import { FAQ } from "@/sections/FAQ";
import { Kontakt } from "@/sections/Kontakt";

/**
 * Direktaufruf mit Anker (z. B. `/#kontakt` aus der Browser-Demo): Der Browser
 * springt nicht selbst, weil die Sektion beim Laden noch nicht gerendert ist.
 * Bilder und Schriften verschieben das Layout bis zum load-Ereignis, deshalb
 * danach noch einmal.
 */
function useAnkerBeimLaden(): void {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const springe = (): void => {
      // "instant": die Seite scrollt per CSS weich, ein weicher Sprung über die
      // ganze Seitenlänge wird beim Nachladen abgebrochen und bleibt oben stehen.
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    };
    const timer = window.setTimeout(springe, 50);
    if (document.readyState !== "complete") {
      window.addEventListener("load", springe, { once: true });
    }
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", springe);
    };
  }, []);
}

export function Home() {
  useAnkerBeimLaden();
  return (
    <>
      <Hero />
      <TeaserSection />
      <ProblemChance />
      <Prozess />
      <Funktionen />
      <Vollgeschoss />
      <Bescheid />
      <Founder />
      <Sicherheit />
      <DemoBanner />
      <Preise />
      <FAQ />
      <Kontakt />
    </>
  );
}
