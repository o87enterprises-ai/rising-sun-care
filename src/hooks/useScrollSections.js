import { useState, useEffect } from "react";

const TOTAL_SECTIONS = 4;

export function useScrollSections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const sectionSize = 1 / TOTAL_SECTIONS;
      let idx = Math.floor(scrollProgress / sectionSize);
      idx = Math.min(TOTAL_SECTIONS - 1, idx);
      const frac = (scrollProgress - idx * sectionSize) / sectionSize;

      setActiveIndex(idx);
      setTransitionProgress(frac);
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeIndex, transitionProgress };
}
