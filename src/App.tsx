import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Hero } from "./sections/Hero";
import { ProblemChance } from "./sections/ProblemChance";
import { Funktionen } from "./sections/Funktionen";
import { Vollgeschoss } from "./sections/Vollgeschoss";
import { Sicherheit } from "./sections/Sicherheit";
import { DemoBanner } from "./sections/DemoBanner";
import { Preise } from "./sections/Preise";
import { Kontakt } from "./sections/Kontakt";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemChance />
        <Funktionen />
        <Vollgeschoss />
        <Sicherheit />
        <DemoBanner />
        <Preise />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}
