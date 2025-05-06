
import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useBatteryStatus } from "@/hooks/use-battery-status";

export type CarouselDirection = "horizontal" | "vertical";
export type CarouselAlign = "start" | "center" | "end";

export interface CarouselOptions {
  align?: CarouselAlign;
  loop?: boolean;
  dragFree?: boolean;
  containScroll?: boolean;
  slidesToScroll?: number;
  startIndex?: number;
  inViewThreshold?: number;
  skipSnaps?: boolean;
  speed?: number; // Animation speed in milliseconds
  autoplay?: boolean;
  autoplayInterval?: number;
  breakpoints?: Record<string, Partial<CarouselOptions>>;
  reducedMotion?: boolean;
}

interface CarouselContextType {
  // Core state
  api: any | null;
  setApi: (api: any) => void;
  carouselRef: React.RefObject<HTMLDivElement>;
  
  // State indicators
  activeIndex: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isTouching: boolean;
  isPaused: boolean;
  
  // Mobile & system states
  isMobile: boolean;
  isReducedMotion: boolean;
  isLowPowerMode: boolean;
  
  // Options and configuration
  direction: CarouselDirection;
  options: CarouselOptions;
  
  // Actions
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  pauseAutoplay: () => void;
  resumeAutoplay: () => void;
  
  // Event handlers
  touchHandlers: {
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export interface CarouselProviderProps {
  children: React.ReactNode;
  direction?: CarouselDirection;
  options?: CarouselOptions;
}

export const CarouselProvider: React.FC<CarouselProviderProps> = ({
  children,
  direction = "horizontal",
  options = {}
}) => {
  // Core refs and state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any | null>(null);
  
  // State indicators
  const [activeIndex, setActiveIndex] = useState(options.startIndex || 0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // System states
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { lowPowerMode } = useBatteryStatus();
  
  // Get optimized options based on device capabilities
  const getOptimizedOptions = useCallback((): CarouselOptions => {
    const baseOptions: CarouselOptions = {
      align: options.align || "center",
      loop: options.loop !== undefined ? options.loop : true,
      dragFree: isMobile ? true : options.dragFree,
      inViewThreshold: lowPowerMode ? 0.8 : (options.inViewThreshold || 0.5),
      skipSnaps: lowPowerMode,
      speed: lowPowerMode || isReducedMotion ? 25 : (options.speed || 15),
      reducedMotion: isReducedMotion || lowPowerMode,
      ...options
    };
    
    // Apply breakpoint-specific options
    if (options.breakpoints) {
      for (const [breakpoint, breakpointOptions] of Object.entries(options.breakpoints)) {
        if (window.matchMedia(breakpoint).matches) {
          return { ...baseOptions, ...breakpointOptions };
        }
      }
    }
    
    return baseOptions;
  }, [isMobile, lowPowerMode, isReducedMotion, options]);
  
  // Action handlers - memoized to prevent recreation
  const scrollPrev = useCallback(() => {
    if (!api) return;
    api.scrollPrev();
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, [api]);

  const scrollNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    if (!api) return;
    api.scrollTo(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, [api]);
  
  const pauseAutoplay = useCallback(() => setIsPaused(true), []);
  const resumeAutoplay = useCallback(() => setIsPaused(false), []);

  // Touch handlers with passive event listeners - memoized for performance
  const touchHandlers = {
    onTouchStart: useCallback(() => {
      setIsTouching(true);
      setIsPaused(true);
    }, []),
    onTouchEnd: useCallback(() => {
      setIsTouching(false);
      // Resume auto-scroll after a delay
      setTimeout(() => setIsPaused(false), 5000);
    }, []),
    onMouseEnter: useCallback(() => setIsPaused(true), []),
    onMouseLeave: useCallback(() => setIsPaused(false), []),
  };

  // Setup autoplay
  useEffect(() => {
    if (!api || !options.autoplay || isPaused || isTouching) return;
    
    const interval = options.autoplayInterval || 5000;
    const timer = setInterval(() => {
      if (api && !isPaused && !isTouching) {
        scrollNext();
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [api, isPaused, isTouching, scrollNext, options.autoplay, options.autoplayInterval]);

  // Update accessibility attributes when active index changes
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const slides = Array.from(
      carouselRef.current.querySelectorAll('[role="group"][aria-roledescription="slide"]')
    );
    
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
      slide.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (direction === 'horizontal') {
            event.preventDefault();
            scrollPrev();
          }
          break;
        case 'ArrowRight':
          if (direction === 'horizontal') {
            event.preventDefault();
            scrollNext();
          }
          break;
        case 'ArrowUp':
          if (direction === 'vertical') {
            event.preventDefault();
            scrollPrev();
          }
          break;
        case 'ArrowDown':
          if (direction === 'vertical') {
            event.preventDefault();
            scrollNext();
          }
          break;
        default:
          break;
      }
    };
    
    carouselRef.current.addEventListener('keydown', handleKeyDown);
    return () => {
      carouselRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [carouselRef, direction, scrollPrev, scrollNext]);
  
  // Context value
  const value = {
    api,
    setApi,
    carouselRef,
    activeIndex,
    canScrollPrev,
    canScrollNext,
    isTouching,
    isPaused,
    isMobile,
    isReducedMotion: isReducedMotion || lowPowerMode,
    isLowPowerMode: lowPowerMode,
    direction,
    options: getOptimizedOptions(),
    scrollPrev,
    scrollNext,
    scrollTo,
    pauseAutoplay,
    resumeAutoplay,
    touchHandlers
  };
  
  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};
