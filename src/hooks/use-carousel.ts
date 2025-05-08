
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
}

export function useCarousel({
  itemCount,
  autoScroll = false,
  autoScrollInterval = 5000,
  itemWidthMobile = '85%',
  itemWidthDesktop = '45%',
  initialIndex = 0,
  onSlideChange
}: UseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [userInteracted, setUserInteracted] = useState(false);
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
  }, []);

  // Attach scroll and interaction event listeners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('touchstart', handleUserInteraction, { passive: true });
    scrollContainer.addEventListener('mousedown', handleUserInteraction, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('touchstart', handleUserInteraction);
      scrollContainer.removeEventListener('mousedown', handleUserInteraction);
    };
  }, [handleScroll, handleUserInteraction]);

  // Auto-scrolling functionality
  useEffect(() => {
    if (!autoScroll || userInteracted || itemCount <= 1) return;
    
    const interval = setInterval(() => {
      scrollToItem((activeIndex + 1) % itemCount);
    }, autoScrollInterval);
    
    return () => clearInterval(interval);
  }, [autoScroll, userInteracted, activeIndex, itemCount, autoScrollInterval]);

  // Scroll to specified index
  const scrollToItem = useCallback((index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
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
  }, [itemWidth, onSlideChange]);

  return {
    activeIndex,
    scrollRef,
    userInteracted,
    scrollToItem,
    handleUserInteraction
  };
}
