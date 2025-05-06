
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useCarousel, CarouselProvider, CarouselDirection, CarouselOptions } from "./carousel-context";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: UseEmblaCarouselType[1];
  orientation?: CarouselDirection;
  setApi?: (api: UseEmblaCarouselType[1]) => void;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

const CarouselRoot = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      opts = {},
      plugins,
      orientation = "horizontal",
      setApi,
      children,
      className,
      ariaLabel = "Carousel",
      ...props
    },
    ref
  ) => {
    return (
      <CarouselProvider direction={orientation} options={opts}>
        <CarouselContainer ref={ref} className={className} ariaLabel={ariaLabel} {...props}>
          {children}
        </CarouselContainer>
      </CarouselProvider>
    );
  }
);
CarouselRoot.displayName = "Carousel";

// Used inside CarouselProvider
const CarouselContainer = forwardRef<HTMLDivElement, Omit<CarouselProps, "opts" | "plugins" | "orientation" | "setApi">>(
  ({ children, className, ariaLabel, ...props }, forwardedRef) => {
    const {
      carouselRef,
      api,
      setApi,
      options,
      direction,
      isReducedMotion,
    } = useCarousel();
    
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...options,
        axis: direction === "horizontal" ? "x" : "y",
      },
      []
    );
    
    // Update API when emblaApi changes
    React.useEffect(() => {
      if (emblaApi) {
        setApi(emblaApi);
      }
    }, [emblaApi, setApi]);
    
    return (
      <div
        ref={(node) => {
          // Set both refs
          if (forwardedRef) {
            if (typeof forwardedRef === "function") {
              forwardedRef(node);
            } else {
              forwardedRef.current = node;
            }
          }
          carouselRef.current = node;
        }}
        className={cn("relative", className)}
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        {...props}
      >
        <div
          ref={emblaRef}
          className={cn(
            "overflow-hidden",
            direction === "horizontal" ? "touch-action-pan-x" : "touch-action-pan-y",
            isReducedMotion ? "reduce-motion-mobile" : "",
            "hw-accelerated"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
CarouselContainer.displayName = "CarouselContainer";

// Export the main Carousel component
export const Carousel = Object.assign(CarouselRoot, {
  Container: CarouselContainer,
});
