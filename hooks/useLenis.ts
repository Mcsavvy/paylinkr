import { useEffect } from "react";
import Lenis from "lenis";

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  smoothWheel: true,
  touchMultiplier: 2,
};

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis(lenisOptions);
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);
}
