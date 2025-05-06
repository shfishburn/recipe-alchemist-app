
import { useState, useEffect, useCallback } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

interface AutoplayOptions {
  enabled?: boolean;
  delay?: number;
  stopOnInteraction?: boolean;
  stopOnHover?: boolean;
  stopOnFocus?: boolean;
  resetOnSelect?: boolean;
}

export function useCarouselAutoplay(options: AutoplayOptions = {}) {
  const {
    enabled = false,
    delay = 5000,
    stopOnInteraction = true,
    stopOnHover = true,
    stopOnFocus = true,
    resetOnSelect = true,
  } = options;

  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Reset interaction state when needed
  const resetInteraction = useCallback(() => {
    if (resetOnSelect) {
      setUserInteracted(false);
    }
  }, [resetOnSelect]);

  // Handle autoplay with efficient cleanup
  useEffect(() => {
    if (!api || !enabled || isPaused || (stopOnInteraction && userInteracted)) {
      return;
    }

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else if (api.scrollSnapList().length > 0) {
        api.scrollTo(0); // Loop back to first slide
      }
    }, delay);

    return () => clearInterval(interval);
  }, [api, enabled, delay, isPaused, userInteracted, stopOnInteraction]);

  // Pause handlers
  const pauseOnHover = useCallback(() => {
    if (stopOnHover) setIsPaused(true);
  }, [stopOnHover]);

  const resumeOnHover = useCallback(() => {
    if (stopOnHover) setIsPaused(false);
  }, [stopOnHover]);

  const pauseOnFocus = useCallback(() => {
    if (stopOnFocus) setIsPaused(true);
  }, [stopOnFocus]);

  const resumeOnFocus = useCallback(() => {
    if (stopOnFocus) setIsPaused(false);
  }, [stopOnFocus]);

  // Interaction handlers
  const onUserInteraction = useCallback(() => {
    if (stopOnInteraction) setUserInteracted(true);
  }, [stopOnInteraction]);

  return {
    api,
    setApi,
    isPaused,
    userInteracted,
    pauseOnHover,
    resumeOnHover,
    pauseOnFocus,
    resumeOnFocus,
    onUserInteraction,
    resetInteraction,
  };
}
