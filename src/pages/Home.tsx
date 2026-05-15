import { Hero } from "@/sections/Hero";
import { ProblemChance } from "@/sections/ProblemChance";
import { Funktionen } from "@/sections/Funktionen";
import { Vollgeschoss } from "@/sections/Vollgeschoss";
import { Sicherheit } from "@/sections/Sicherheit";
import { DemoBanner } from "@/sections/DemoBanner";
import { Preise } from "@/sections/Preise";
import { FAQ } from "@/sections/FAQ";
import { Kontakt } from "@/sections/Kontakt";

export function Home() {
  return (
    <>
      <Hero />
      <ProblemChance />
      <Funktionen />
      <Vollgeschoss />
      <Sicherheit />
      <DemoBanner />
      <Preise />
      <FAQ />
      <Kontakt />
    </>
  );
}
