import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { useRoute } from "./router";

export function App() {
  const route = useRoute();
  return (
    <>
      <Nav />
      <main>{route === "home" ? <Home /> : <Home />}</main>
      <Footer />
    </>
  );
}
