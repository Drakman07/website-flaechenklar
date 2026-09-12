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
import { Argumente } from "@/sections/Argumente";
import { FAQ } from "@/sections/FAQ";
import { Kontakt } from "@/sections/Kontakt";

export function Home() {
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
      <Argumente />
      <FAQ />
      <Kontakt />
    </>
  );
}
