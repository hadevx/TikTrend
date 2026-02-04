import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * React.js version (non-Next.js)
 * - Removes "use client"
 * - Removes usePathname
 * - Resets scroll on route change (React Router) if you pass `pathname`
 *
 * Usage:
 * 1) With React Router:
 *    const { pathname } = useLocation();
 *    <SmoothScrollProvider pathname={pathname}>{children}</SmoothScrollProvider>
 *
 * 2) Without router:
 *    <SmoothScrollProvider>{children}</SmoothScrollProvider>
 */
export default function SmoothScrollProvider({ children, pathname }) {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on route change (if pathname provided)
  useEffect(() => {
    if (pathname && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
