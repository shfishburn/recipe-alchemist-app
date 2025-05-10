
import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseCarouselProps {
  itemCount: number;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  itemWidthMobile?: string;
  itemWidthDesktop?: string;
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
  pauseOnHover?: boolean;
}

export function useCarousel({
  itemCount,
  autoScroll = false,
  autoScrollInterval = 5000,
  itemWidthMobile = '85%',
  itemWidthDesktop = '45%',
  initialIndex = 0,
  onSlideChange,
  pauseOnHover = true
}: UseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Calculate item width based on device type
  const itemWidth = isMobile ? itemWidthMobile : itemWidthDesktop;
  
  // Handle scroll events to update active state
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollPosition = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.clientWidth;
    const itemWidthValue = parseFloat(itemWidth) / 100 * containerWidth;
    const newIndex = Math.round(scrollPosition / itemWidthValue);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < itemCount) {
      setActiveIndex(newIndex);
      if (onSlideChange) onSlideChange(newIndex);
    }
  }, [activeIndex, itemCount, itemWidth, onSlideChange]);

  // Handle user interaction to stop auto-scrolling
  const handleUserInteraction = useCallback(() => {
    setUserInteracted(true);
    
    // Reset auto-scrolling after a period of inactivity (30 seconds)
    const timer = setTimeout(() => {
      setUserInteracted(false);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovering(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Attach scroll and interaction event listeners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollListener = (e: Event) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => handleScroll());
    };
    
    scrollContainer.addEventListener('scroll', scrollListener, { passive: true });
    scrollContainer.addEventListener('touchstart', handleUserInteraction, { passive: true });
    scrollContainer.addEventListener('mousedown', handleUserInteraction, { passive: true });
    
    if (pauseOnHover) {
      scrollContainer.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      scrollContainer.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }
    
    return () => {
      scrollContainer.removeEventListener('scroll', scrollListener);
      scrollContainer.removeEventListener('touchstart', handleUserInteraction);
      scrollContainer.removeEventListener('mousedown', handleUserInteraction);
      
      if (pauseOnHover) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleScroll, handleUserInteraction, handleMouseEnter, handleMouseLeave, pauseOnHover]);

  // Auto-scrolling functionality
  useEffect(() => {
    if (!autoScroll || userInteracted || itemCount <= 1 || (pauseOnHover && isHovering)) return;
    
    const interval = setInterval(() => {
      scrollToItem((activeIndex + 1) % itemCount);
    }, autoScrollInterval);
    
    return () => clearInterval(interval);
  }, [autoScroll, userInteracted, activeIndex, itemCount, autoScrollInterval, pauseOnHover, isHovering]);

  // Scroll to specified index with error handling
  const scrollToItem = useCallback((index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    try {
      // Add class to temporarily disable smooth scrolling
      scrollContainer.classList.add('user-scrolling');
      
      const containerWidth = scrollContainer.clientWidth;
      const itemWidthValue = parseFloat(itemWidth) / 100 * containerWidth;
      
      scrollContainer.scrollTo({
        left: itemWidthValue * index,
        behavior: 'smooth'
      });
      
      setActiveIndex(index);
      if (onSlideChange) onSlideChange(index);
      
      // Remove class after animation completes
      setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.classList.remove('user-scrolling');
        }
      }, 500);
    } catch (error) {
      console.error("Error scrolling to item:", error);
      
      // Fallback to simple scroll without animation
      try {
        scrollContainer.scrollLeft = parseFloat(itemWidth) / 100 * scrollContainer.clientWidth * index;
        setActiveIndex(index);
        if (onSlideChange) onSlideChange(index);
      } catch (fallbackError) {
        console.error("Fallback scroll failed:", fallbackError);
      }
    }
  }, [itemWidth, onSlideChange]);

  return {
    activeIndex,
    scrollRef,
    userInteracted,
    isHovering,
    scrollToItem,
    handleUserInteraction,
    handleMouseEnter,
    handleMouseLeave
  };
}
