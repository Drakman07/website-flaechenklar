import { Hero } from "@/sections/Hero";
import { TeaserSection } from "@/sections/TeaserSection";
import { AufmassSequence } from "@/sections/AufmassSequence";
import { ProblemChance } from "@/sections/ProblemChance";
import { Founder } from "@/sections/Founder";
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
      <AufmassSequence />
      <ProblemChance />
      <Founder />
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
