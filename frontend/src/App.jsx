import React, { useRef } from "react";
import { useScrollSections } from "./hooks/useScrollSections";
import ThreeBackground from "./components/ThreeBackground";
import Navbar from "./components/Navbar";
import HomeSection from "./components/sections/HomeSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import ContactSection from "./components/sections/ContactSection";

function App() {
  const { activeIndex, transitionProgress } = useScrollSections();
  const sectionRefs = useRef([]);

  const handleNavigate = (idx) => {
    const sectionSize = 1 / 4;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const targetScroll = idx * sectionSize * maxScroll;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const sections = [
    { id: "home", component: HomeSection },
    { id: "about", component: AboutSection },
    { id: "services", component: ServicesSection },
    { id: "contact", component: ContactSection },
  ];

  return (
    <>
      <ThreeBackground sceneIndex={activeIndex} transitionProgress={transitionProgress} />
      <Navbar activeIndex={activeIndex} onNavigate={handleNavigate} />
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 5,
        background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
        opacity: Math.min(1, Math.sin(transitionProgress * Math.PI) * 0.8),
        backdropFilter: `blur(${Math.sin(transitionProgress * Math.PI) * 6}px)`,
        transition: "opacity 0.1s"
      }} />
      {sections.map(({ id, component: Component }, index) => (
        <Component key={id} isVisible={activeIndex === index} />
      ))}
      <div style={{
        position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        zIndex: 20, color: "rgba(255,255,255,0.25)", fontSize: "0.7rem",
        letterSpacing: "2px", animation: "bounce 2s infinite"
      }}>↓ Scroll to explore ↓</div>
      <style>{`
        @keyframes bounce {
          0%,20%,50%,80%,100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-8px); }
          60% { transform: translateX(-50%) translateY(-4px); }
        }
      `}</style>
    </>
  );
}

export default App;
