import { Hero } from "@/sections/Hero";
import { TeaserSection } from "@/sections/TeaserSection";
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
      <TeaserSection />
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
