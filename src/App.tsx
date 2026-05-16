import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Tour } from "./pages/Tour";
import { useRoute } from "./router";

export function App() {
  const route = useRoute();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-feature focus:outline-none focus:ring-2 focus:ring-teal/70 focus:ring-offset-2 focus:ring-offset-white"
      >
        Zum Inhalt springen
      </a>
      <Nav />
      <main id="main">{route === "tour" ? <Tour /> : <Home />}</main>
      <Footer />
    </>
  );
}
