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

  const sceneLabels = ['✦ <span>Home</span>', '✦ <span>About</span>', '✦ <span>Services</span>', '✦ <span>Contact</span>'];

  return (
    <>
      <ThreeBackground sceneIndex={activeIndex} transitionProgress={transitionProgress} />

      {/* Fixed UI Overlay */}
      <div
        style={{
          position: 'fixed',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          width: '100vw',
          padding: '2rem 4rem',
          pointerEvents: 'none',
          top: 0,
          left: 0,
        }}
      >
        <Navbar activeIndex={activeIndex} onNavigate={handleNavigate} />

        {/* Scrollable sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {sections.map(({ id, component: Component }, index) => (
            <Component
              key={id}
              isVisible={activeIndex === index}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'rgba(245,240,235,0.3)',
            padding: '1rem 0',
            borderTop: '1px solid rgba(245,166,35,0.08)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            pointerEvents: 'auto',
          }}
        >
          <span>© 2026 Rising Sun Care — All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'rgba(245,240,235,0.3)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#f5a623'} onMouseLeave={(e) => e.target.style.color = 'rgba(245,240,235,0.3)'}>Facebook</a>
            <a href="#" style={{ color: 'rgba(245,240,235,0.3)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#f5a623'} onMouseLeave={(e) => e.target.style.color = 'rgba(245,240,235,0.3)'}>Instagram</a>
            <a href="#" style={{ color: 'rgba(245,240,235,0.3)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#f5a623'} onMouseLeave={(e) => e.target.style.color = 'rgba(245,240,235,0.3)'}>Careers</a>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.8rem',
          letterSpacing: '2px',
          animation: 'bounce 2s infinite',
          pointerEvents: 'none',
        }}
      >
        ↓ Scroll to explore ↓
      </div>

      {/* Scene Label */}
      <div
        style={{
          position: 'fixed',
          bottom: '6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.2rem',
          letterSpacing: '4px',
          color: 'rgba(255,255,255,0.25)',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
          transition: 'opacity 0.6s',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.4rem 1.8rem',
          borderRadius: '50px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
        dangerouslySetInnerHTML={{ __html: sceneLabels[activeIndex] || '✦ <span>Home</span>' }}
      />
    </>
  );
}

export default App;