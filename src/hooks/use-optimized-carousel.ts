
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMediaQuery } from './use-media-query';
import { useBatteryStatus } from './use-battery-status';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import { throttle } from 'lodash';

export interface OptimizedCarouselOptions {
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
  slidesToScroll?: number;
  dragFree?: boolean;
  inViewThreshold?: number;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  skipSnaps?: boolean;
  speed?: number;
}

export function useOptimizedCarousel(options: OptimizedCarouselOptions = {}) {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { lowPowerMode } = useBatteryStatus();
  
  // Touch state tracking for better mobile interaction
  const [isTouching, setIsTouching] = useState(false);
  
  // Auto-scroll state
  const [isPaused, setIsPaused] = useState(false);

  // Carousel event handlers - memoized to prevent recreation
  const onSelect = useCallback(() => {
    if (!api) return;
    
    setActiveIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  // Effect for auto-scroll with pause on hover/touch
  const setupAutoScroll = useCallback((
    interval = 5000,
    shouldAutoScroll = true,
    totalSlides = 0
  ) => {
    if (!api || !shouldAutoScroll || isPaused || totalSlides <= 1) return () => {};
    
    const timer = setInterval(() => {
      if (api && !isPaused && !isTouching) {
        const nextSlide = (activeIndex + 1) % totalSlides;
        api.scrollTo(nextSlide);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [api, activeIndex, isPaused, isTouching]);

  // Setup events when API changes
  useEffect(() => {
    if (!api) return;
    
    onSelect();
    
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  // Generate optimized carousel options based on device capabilities
  const getCarouselOptions = useCallback((customOptions = {}) => {
    const defaultOptions = {
      align: options.align || "center" as const,
      loop: options.loop !== undefined ? options.loop : true,
      dragFree: isMobile ? true : options.dragFree,
      inViewThreshold: lowPowerMode ? 0.8 : (options.inViewThreshold || 0.5),
      skipSnaps: lowPowerMode,
      speed: lowPowerMode ? 25 : (options.speed || 15),
    };
    
    return { ...defaultOptions, ...customOptions };
  }, [isMobile, lowPowerMode, options]);

  // Touch handlers with passive event listeners and throttle for performance
  const touchHandlers = useMemo(() => ({
    onTouchStart: throttle(() => {
      setIsTouching(true);
      setIsPaused(true);
    }, 100, { leading: true }),
    
    onTouchEnd: throttle(() => {
      setIsTouching(false);
      // Resume auto-scroll after a delay
      setTimeout(() => setIsPaused(false), 5000);
    }, 100, { trailing: true }),
    
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
  }), []);

  // Pagination control functions - memoized to prevent recreation
  const scrollTo = useCallback((index: number) => {
    if (!api) return;
    api.scrollTo(index);
    setIsPaused(true);
    // Resume auto-scroll after user interaction
    setTimeout(() => setIsPaused(false), 5000);
  }, [api]);

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

  return {
    api,
    setApi,
    activeIndex,
    canScrollPrev,
    canScrollNext,
    isTouching,
    isMobile,
    isPaused,
    setIsPaused,
    getCarouselOptions,
    touchHandlers,
    scrollTo,
    scrollPrev,
    scrollNext,
    setupAutoScroll
  };
}
