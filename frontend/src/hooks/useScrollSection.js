// frontend/src/hooks/useScrollSections.js
import { useState, useEffect } from "react";

export function useScrollSections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      // Avoid division by zero
      const raw = maxScroll > 0 ? scrollY / maxScroll : 0;
      // Clamp to [0, 1]
      const t = Math.min(Math.max(raw, 0), 1);
      // Number of sections = 4 (Home, About, Services, Contact)
      const totalSections = 4;
      const rawIndex = t * totalSections;
      const idx = Math.min(Math.floor(rawIndex), totalSections - 1);
      const frac = rawIndex - idx;
      setActiveIndex(idx);
      setTransitionProgress(frac);
    };

    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeIndex, transitionProgress };
}