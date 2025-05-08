
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useCarousel } from '@/hooks/use-carousel';
import type { CarouselItem } from '@/components/ui/carousel';

export interface StandardCarouselProps {
  items: CarouselItem[];
  renderItem: (item: CarouselItem, index: number, isActive: boolean) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  itemWidthMobile?: string;
  itemWidthDesktop?: string;
  onSlideChange?: (index: number) => void;
  initialSlide?: number;
  gap?: string;
}

export function StandardCarousel({
  items,
  renderItem,
  className,
  itemClassName,
  autoScroll = false,
  autoScrollInterval = 5000,
  showArrows = true,
  showDots = true,
  showCounter = false,
  itemWidthMobile = '85%',
  itemWidthDesktop = '45%', 
  onSlideChange,
  initialSlide = 0,
  gap = 'gap-4',
}: StandardCarouselProps) {
  const isMobile = useIsMobile();
  
  // Use our custom carousel hook
  const {
    activeIndex,
    scrollRef,
    scrollToItem
  } = useCarousel({
    itemCount: items.length,
    autoScroll,
    autoScrollInterval,
    itemWidthMobile,
    itemWidthDesktop,
    initialIndex: initialSlide,
    onSlideChange
  });

  // Navigation buttons
  const handlePrevious = () => {
    const newIndex = (activeIndex - 1 + items.length) % items.length;
    scrollToItem(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % items.length;
    scrollToItem(newIndex);
  };

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {/* Main carousel container */}
      <div className="carousel-container relative w-full">
        {/* Scrollable area */}
        <div 
          ref={scrollRef}
          className={cn("carousel-scroll-area", gap, "hw-accelerated")}
          tabIndex={0}
          aria-live="polite"
          aria-roledescription="carousel"
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={cn(
                "carousel-item",
                itemClassName
              )}
              style={{ width: isMobile ? itemWidthMobile : itemWidthDesktop }}
              aria-hidden={activeIndex !== index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${items.length}`}
            >
              {renderItem(item, index, activeIndex === index)}
            </div>
          ))}
        </div>
        
        {/* Arrow navigation */}
        {showArrows && items.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
              className="carousel-nav-button absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="carousel-nav-button absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* Pagination dots */}
      {showDots && items.length > 1 && (
        <div className="carousel-pagination mt-4" role="tablist" aria-label="Carousel pagination">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "carousel-pagination-dot",
                activeIndex === index ? "carousel-pagination-dot-active" : ""
              )}
              onClick={() => scrollToItem(index)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Go to slide ${index + 1}`}
              tabIndex={activeIndex === index ? 0 : -1}
            />
          ))}
        </div>
      )}
      
      {/* Slide counter text */}
      {showCounter && items.length > 1 && (
        <div className="text-center text-xs md:text-sm text-muted-foreground mt-1" aria-live="polite">
          Slide {activeIndex + 1} of {items.length}
        </div>
      )}
    </div>
  );
}

// Re-export the CarouselItem type for convenience
export type { CarouselItem };
