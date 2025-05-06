
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPagination
} from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/use-carousel-autoplay';
import { cn } from '@/lib/utils';

interface CarouselExampleProps {
  items: React.ReactNode[];
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  showPagination?: boolean;
}

export function CarouselExample({
  items,
  autoplay = false,
  autoplayInterval = 5000,
  className,
  itemClassName,
  showArrows = true,
  showPagination = true,
}: CarouselExampleProps) {
  // Set up autoplay functionality
  const {
    setApi,
    pauseOnHover,
    resumeOnHover,
    pauseOnFocus,
    resumeOnFocus,
    onUserInteraction,
  } = useCarouselAutoplay({
    enabled: autoplay,
    delay: autoplayInterval,
    stopOnInteraction: true,
    stopOnHover: true,
  });

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn("w-full", className)}
      onMouseEnter={pauseOnHover}
      onMouseLeave={resumeOnHover}
      onFocus={pauseOnFocus}
      onBlur={resumeOnFocus}
    >
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className={itemClassName}>
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showArrows && (
          <>
            <CarouselPrevious onClick={onUserInteraction} />
            <CarouselNext onClick={onUserInteraction} />
          </>
        )}
        
        {showPagination && (
          <div className="mt-4 flex justify-center">
            <CarouselPagination 
              variant="dots"
              showNumbers={items.length > 3}
              size="md"
              onClick={onUserInteraction}
            />
          </div>
        )}
      </Carousel>
    </div>
  );
}
