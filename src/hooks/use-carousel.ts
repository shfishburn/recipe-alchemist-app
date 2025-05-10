
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
    
    // Calculate center point of viewport
    const viewportCenter = scrollPosition + (containerWidth / 2);
    
    // Find which slide is closest to the center
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;
    
    // Loop through all items and find the one closest to the center
    for (let i = 0; i < itemCount; i++) {
      const itemCenterPosition = (i * itemWidthValue) + (itemWidthValue / 2);
      const distance = Math.abs(viewportCenter - itemCenterPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    if (closestIndex !== activeIndex && closestIndex >= 0 && closestIndex < itemCount) {
      setActiveIndex(closestIndex);
      if (onSlideChange) onSlideChange(closestIndex);
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

  // Function to center an item in the viewport
  const scrollToItem = useCallback((index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    try {
      // Get container dimensions
      const containerWidth = scrollContainer.clientWidth;
      const itemWidthValue = parseFloat(itemWidth) / 100 * containerWidth;
      
      // Calculate position that centers the item in the viewport
      const itemCenter = (index * itemWidthValue) + (itemWidthValue / 2);
      const scrollPosition = itemCenter - (containerWidth / 2);
      
      // Temporarily add class to disable smooth scrolling for programmatic changes
      scrollContainer.classList.add('user-scrolling');
      
      // Scroll to the calculated position
      scrollContainer.scrollTo({
        left: scrollPosition,
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
      
      // Fallback for browsers that don't support scrollTo with options
      try {
        const containerWidth = scrollContainer.clientWidth;
        const itemWidthValue = parseFloat(itemWidth) / 100 * containerWidth;
        const itemCenter = (index * itemWidthValue) + (itemWidthValue / 2);
        scrollContainer.scrollLeft = itemCenter - (containerWidth / 2);
        
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
