
import { useEffect, useState } from "react";

/**
 * Enhanced hook for responsive Material Design layouts
 * Uses standard Material Design breakpoints:
 * - xs: 0px and up
 * - sm: 600px and up
 * - md: 960px and up
 * - lg: 1280px and up
 * - xl: 1920px and up
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check for SSR
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Create event listener that updates the state
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Modern browsers
    mediaQuery.addEventListener("change", listener);
    
    // Clean up
    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Predefined Material Design breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 599px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 600px) and (max-width: 959px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 960px)");
}

export function useIsLargeDesktop() {
  return useMediaQuery("(min-width: 1280px)");
}

export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 599px)");
  const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 959px)");
  const isDesktop = useMediaQuery("(min-width: 960px) and (max-width: 1279px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");
  
  if (isLargeDesktop) return "xl";
  if (isDesktop) return "lg";
  if (isTablet) return "md";
  return "sm";
}
