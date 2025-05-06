
"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children?: React.ReactNode;
};

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement>;
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  activeIndex: number;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(
  (
    {
      opts,
      plugins,
      orientation = "horizontal",
      setApi,
      className,
      children,
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => {
      if (api) api.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      if (api) api.scrollNext();
    }, [api]);

    const handleSelect = React.useCallback(() => {
      if (!api) return;
      
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setActiveIndex(api.selectedScrollSnap());
    }, [api]);

    React.useEffect(() => {
      if (!api) return;
      
      handleSelect();
      api.on("select", handleSelect);
      api.on("reInit", handleSelect);
      
      if (setApi) setApi(api);
      
      return () => {
        api.off("select", handleSelect);
        api.off("reInit", handleSelect);
      };
    }, [api, handleSelect, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          activeIndex,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          aria-roledescription="carousel"
        >
          <div
            ref={carouselRef}
            className="overflow-hidden h-full touch-pan-x"
          >
            <div className="flex h-full" style={{
              flexDirection: orientation === "horizontal" ? "row" : "column",
            }}>
              {children}
            </div>
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={ref} className={cn("flex", className)} {...props} />
  );
});
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full left-4 top-1/2 -translate-y-1/2",
        !canScrollPrev && "hidden",
        className
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full right-4 top-1/2 -translate-y-1/2",
        !canScrollNext && "hidden",
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    showNumbers?: boolean 
  }
>(({ className, showNumbers = false, ...props }, ref) => {
  const { api, activeIndex } = useCarousel();
  const [slideCount, setSlideCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setSlideCount(api.scrollSnapList().length);
  }, [api]);

  if (slideCount <= 1) {
    return null;
  }

  return (
    <div 
      ref={ref}
      className={cn("flex items-center justify-center gap-2 mt-4", className)} 
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={cn(
            "h-2 w-2 p-0 rounded-full",
            activeIndex === index 
              ? "bg-primary" 
              : "bg-muted-foreground/30"
          )}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={activeIndex === index ? "true" : "false"}
        />
      ))}
      {showNumbers && slideCount > 1 && (
        <span className="text-xs text-muted-foreground ml-2">
          {activeIndex + 1} / {slideCount}
        </span>
      )}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";
