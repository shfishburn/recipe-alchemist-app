
"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBatteryStatus } from "@/hooks/use-battery-status";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children?: React.ReactNode;
  arrowPosition?: "inside" | "outside";
  showArrows?: boolean;
}

interface CarouselPrevNextProps extends React.HTMLAttributes<HTMLButtonElement> {
  isBatteryLow?: boolean;
  disabled?: boolean; // Added disabled prop to fix type error
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      opts,
      plugins,
      orientation = "horizontal",
      setApi,
      className,
      children,
      arrowPosition = "inside",
      showArrows = true,
    },
    ref
  ) => {
    const { lowPowerMode } = useBatteryStatus();
    
    // Apply power-saving settings when battery is low
    const optimizedOpts: CarouselOptions = React.useMemo(() => {
      // Start with the base options
      const baseOpts: CarouselOptions = {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      };
      
      // Add power-saving adjustments
      if (lowPowerMode) {
        return {
          ...baseOpts,
          // Reduce motion when battery is low
          speed: 5, // Slower transitions
          inViewThreshold: 0.8, // Only load what's closer to view
        };
      }
      
      return baseOpts;
    }, [opts, orientation, lowPowerMode]);
    
    const [carouselRef, api] = useEmblaCarousel(optimizedOpts, plugins);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    
    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);
    
    React.useEffect(() => {
      if (!api) return;
      
      onSelect(api);
      api.on("select", () => onSelect(api));
      api.on("reInit", () => onSelect(api));
      
      if (setApi) setApi(api);
      
      return () => {
        api.off("select", () => onSelect(api));
        api.off("reInit", () => onSelect(api));
      };
    }, [api, setApi, onSelect]);
    
    return (
      <div
        ref={ref}
        className={cn("relative", arrowPosition === "outside" ? "px-10" : "", className)}
        aria-roledescription="carousel"
      >
        <div
          ref={carouselRef}
          className={cn("overflow-hidden", 
            lowPowerMode ? "reduce-motion-mobile" : "",
            "hw-accelerated"
          )}
        >
          <div className="flex" style={{
            flexDirection: orientation === "horizontal" ? "row" : "column",
          }}>
            {children}
          </div>
        </div>
        {showArrows && (
          <>
            <CarouselPrevious
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              className={cn(
                arrowPosition === "outside" ? "-left-10" : "left-2",
                !canScrollPrev && "hidden"
              )}
              isBatteryLow={lowPowerMode}
            />
            <CarouselNext
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              className={cn(
                arrowPosition === "outside" ? "-right-10" : "right-2",
                !canScrollNext && "hidden"
              )}
              isBatteryLow={lowPowerMode}
            />
          </>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="list" className={cn("draggable flex", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="listitem"
    className={cn(
      "min-w-0 shrink-0 grow-0 basis-full",
      className
    )}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

// Add the CarouselProgress component
export const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("relative h-1 w-full rounded-full bg-gray-200", className)} 
    {...props}
  >
    <div className="absolute h-full left-0 rounded-full bg-recipe-blue animate-carousel-progress" />
  </div>
));
CarouselProgress.displayName = "CarouselProgress";

export function CarouselPrevious({ className, isBatteryLow, disabled, ...props }: CarouselPrevNextProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 left-4 h-8 w-8 rounded-full",
        isBatteryLow ? "opacity-70" : "",
        className
      )}
      disabled={disabled}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

export function CarouselNext({ className, isBatteryLow, disabled, ...props }: CarouselPrevNextProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 right-4 h-8 w-8 rounded-full",
        isBatteryLow ? "opacity-70" : "",
        className
      )}
      disabled={disabled}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}
