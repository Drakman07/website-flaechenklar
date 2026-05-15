import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Tour } from "./pages/Tour";
import { useRoute } from "./router";

export function App() {
  const route = useRoute();
  return (
    <>
      <Nav />
      <main>{route === "tour" ? <Tour /> : <Home />}</main>
      <Footer />
    </>
  );
}
