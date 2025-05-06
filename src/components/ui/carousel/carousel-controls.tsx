
import React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel-context";
import { Button } from "../button";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

// Previous button
export interface CarouselPreviousProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  disabled,
  ...props
}: CarouselPreviousProps) {
  const { scrollPrev, canScrollPrev, direction, isReducedMotion } = useCarousel();
  
  // Default icons based on direction
  const DefaultIcon = direction === "horizontal" ? ChevronLeft : ChevronUp;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "carousel-control absolute h-8 w-8 rounded-full",
        direction === "horizontal"
          ? "left-4 top-1/2 -translate-y-1/2"
          : "top-4 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollPrev && "hidden",
        isReducedMotion ? "opacity-70" : "",
        className
      )}
      disabled={!canScrollPrev || disabled}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <DefaultIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

// Next button
export interface CarouselNextProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  disabled,
  ...props
}: CarouselNextProps) {
  const { scrollNext, canScrollNext, direction, isReducedMotion } = useCarousel();
  
  // Default icons based on direction
  const DefaultIcon = direction === "horizontal" ? ChevronRight : ChevronDown;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "carousel-control absolute h-8 w-8 rounded-full",
        direction === "horizontal"
          ? "right-4 top-1/2 -translate-y-1/2"
          : "bottom-4 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollNext && "hidden",
        isReducedMotion ? "opacity-70" : "",
        className
      )}
      disabled={!canScrollNext || disabled}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <DefaultIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

// Pagination dots
export interface CarouselPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dots" | "bullets" | "numbers";
  size?: "sm" | "md" | "lg";
  showNumbers?: boolean;
  showArrows?: boolean;
}

export function CarouselPagination({
  className,
  variant = "dots",
  size = "md",
  showNumbers = false,
  showArrows = true,
  ...props
}: CarouselPaginationProps) {
  const { 
    api, 
    activeIndex, 
    scrollTo, 
    scrollPrev, 
    scrollNext, 
    canScrollPrev, 
    canScrollNext
  } = useCarousel();
  
  // Get total number of slides
  const [totalSlides, setTotalSlides] = React.useState(0);
  
  React.useEffect(() => {
    if (!api) return;
    
    setTotalSlides(api.slideNodes().length);
    
    // Update when slides change
    const onReInit = () => setTotalSlides(api.slideNodes().length);
    api.on("reInit", onReInit);
    
    return () => {
      api.off("reInit", onReInit);
    };
  }, [api]);
  
  // Size classes for different components
  const sizeClasses = {
    sm: {
      container: "gap-1",
      dot: "w-1.5 h-1.5",
      activeDot: "w-4 h-1.5",
      button: "h-6 w-6",
      icon: "h-3 w-3"
    },
    md: {
      container: "gap-2",
      dot: "w-2 h-2",
      activeDot: "w-6 h-2",
      button: "h-8 w-8",
      icon: "h-4 w-4"
    },
    lg: {
      container: "gap-3",
      dot: "w-2.5 h-2.5",
      activeDot: "w-8 h-2.5",
      button: "h-9 w-9",
      icon: "h-5 w-5"
    }
  };
  
  if (totalSlides <= 1) return null;
  
  return (
    <div 
      className={cn("flex items-center justify-center", className)} 
      aria-label="Pagination"
      role="group"
      {...props}
    >
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-gray-300 dark:border-gray-600",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "transition-colors mr-2 carousel-control",
            sizeClasses[size].button
          )}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className={sizeClasses[size].icon} />
        </Button>
      )}
      
      <div className={cn("flex items-center", sizeClasses[size].container)}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "transition-all focus:outline-none rounded-full carousel-focusable",
              activeIndex === index
                ? cn(
                    variant === "dots" ? "bg-primary" : "bg-primary text-white",
                    variant === "dots" ? sizeClasses[size].activeDot : sizeClasses[size].dot
                  )
                : cn(
                    "bg-gray-300 dark:bg-gray-600 hover:bg-primary/50",
                    sizeClasses[size].dot
                  )
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? "true" : "false"}
          >
            {variant === "numbers" && (
              <span className="sr-only">{index + 1}</span>
            )}
          </button>
        ))}
      </div>
      
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-gray-300 dark:border-gray-600",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "transition-colors ml-2 carousel-control",
            sizeClasses[size].button
          )}
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className={sizeClasses[size].icon} />
        </Button>
      )}
      
      {showNumbers && (
        <div className="text-xs text-muted-foreground ml-4" aria-live="polite">
          <span className="font-medium text-foreground">{activeIndex + 1}</span>
          {" / "}
          <span>{totalSlides}</span>
        </div>
      )}
    </div>
  );
}
