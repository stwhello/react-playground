import "./styles/tokens.css";
import "./styles/global.css";

import CustomCursor from "./components/ui/CustomCursor";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Stack from "./components/sections/Stack";
import Work from "./components/sections/Work";
import Contact from "./components/sections/Contact";

export default function App() {
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Contact />
      </main>
    </>
  );
}
