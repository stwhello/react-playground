import "./styles/tokens.css";
import "./styles/global.css";

import BlobCursor from "./components/ui/BlobCursor";
import Navbar from "./components/ui/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Stack from "./components/sections/Stack";
import Work from "./components/sections/Work";
import Contact from "./components/sections/Contact";

export default function App() {
  return (
    <>
      <BlobCursor
        blobType="circle" fillColor="#C8FF4D" trailCount={3}
        sizes={[50, 100, 60]} innerSizes={[15, 28, 18]}
        innerColor="rgba(11,11,16,0.6)" opacities={[0.5, 0.4, 0.45]}
        shadowColor="rgba(200,255,77,0.3)" shadowBlur={20}
        shadowOffsetX={0} shadowOffsetY={0}
        filterStdDeviation={25} useFilter={true}
        fastDuration={0.08} slowDuration={0.45} zIndex={9999}
      />
      <Navbar />
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