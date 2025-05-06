
import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from './use-media-query';
import { useBatteryStatus } from './use-battery-status';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

export function useOptimizedCarousel() {
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

  // Carousel event handlers
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
      const nextSlide = (activeIndex + 1) % totalSlides;
      api.scrollTo(nextSlide);
    }, interval);
    
    return () => clearInterval(timer);
  }, [api, activeIndex, isPaused]);

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
      align: "center" as const,
      loop: true,
      dragFree: isMobile, // Enable dragFree for mobile devices
      inViewThreshold: lowPowerMode ? 0.8 : 0.5, // Higher threshold when battery is low
      dragThreshold: isMobile ? 8 : 10, // Lower for mobile for more responsive touch
      speed: lowPowerMode ? 25 : 15, // Slower animations on low power mode
    };
    
    return { ...defaultOptions, ...customOptions };
  }, [isMobile, lowPowerMode]);

  // Touch handlers with passive event listeners
  const touchHandlers = {
    onTouchStart: () => setIsTouching(true),
    onTouchEnd: () => {
      setIsTouching(false);
      // Resume auto-scroll after a delay
      setTimeout(() => setIsPaused(false), 5000);
    },
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
  };

  // Pagination control functions
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
