
import React, { forwardRef } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
  CarouselPrevious,
  CarouselNext,
  CarouselProvider
} from "./carousel";
import { cn } from "@/lib/utils";

// A complete wrapper component that combines all carousel components
export interface CarouselWrapperProps {
  children: React.ReactNode;
  className?: string;
  options?: {
    align?: "start" | "center" | "end";
    loop?: boolean;
    dragFree?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    direction?: "horizontal" | "vertical";
  };
  controls?: {
    arrows?: boolean;
    pagination?: boolean;
    paginationVariant?: "dots" | "bullets" | "numbers";
    paginationSize?: "sm" | "md" | "lg";
    showNumbers?: boolean;
  };
  responsive?: {
    arrowsOnlyOnDesktop?: boolean;
    switchToMobileAt?: string; // e.g., "(max-width: 640px)"
  };
  accessibility?: {
    ariaLabel?: string;
    ariaSlideLabel?: (index: number) => string;
  };
}

export const CarouselWrapper = forwardRef<HTMLDivElement, CarouselWrapperProps>(
  (
    {
      children,
      className,
      options = {},
      controls = {
        arrows: true,
        pagination: true,
        paginationVariant: "dots",
        paginationSize: "md",
        showNumbers: true,
      },
      responsive = {
        arrowsOnlyOnDesktop: true,
      },
      accessibility = {
        ariaLabel: "Content carousel",
      },
    },
    ref
  ) => {
    const {
      align = "center",
      loop = true, 
      dragFree = false,
      autoPlay = false,
      autoPlayInterval = 5000,
      direction = "horizontal"
    } = options;
    
    const {
      arrows = true,
      pagination = true,
      paginationVariant = "dots",
      paginationSize = "md",
      showNumbers = true
    } = controls;
    
    // Media query to check if we're on mobile
    const [isMobile, setIsMobile] = React.useState(false);
    
    React.useEffect(() => {
      if (!responsive.switchToMobileAt) return;
      
      const mediaQuery = window.matchMedia(responsive.switchToMobileAt);
      const updateMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
        setIsMobile(e.matches);
      };
      
      updateMediaQuery(mediaQuery);
      mediaQuery.addEventListener('change', updateMediaQuery);
      
      return () => {
        mediaQuery.removeEventListener('change', updateMediaQuery);
      };
    }, [responsive.switchToMobileAt]);
    
    return (
      <Carousel
        ref={ref}
        opts={{
          align,
          loop,
          dragFree: isMobile ? true : dragFree,
          autoplay: autoPlay,
          autoplayInterval: autoPlayInterval
        }}
        orientation={direction}
        className={cn("w-full", className)}
        ariaLabel={accessibility.ariaLabel}
      >
        <CarouselContent>
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index} index={index}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {arrows && (!responsive.arrowsOnlyOnDesktop || !isMobile) && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
        
        {pagination && (
          <div className="mt-4 flex justify-center">
            <CarouselPagination 
              variant={paginationVariant}
              size={paginationSize}
              showNumbers={showNumbers}
              showArrows={arrows && responsive.arrowsOnlyOnDesktop && isMobile}
            />
          </div>
        )}
      </Carousel>
    );
  }
);
CarouselWrapper.displayName = "CarouselWrapper";
