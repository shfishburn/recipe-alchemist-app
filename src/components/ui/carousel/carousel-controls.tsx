
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel";
import { Button } from "@/components/ui/button";

interface CarouselControlsProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  controls?: "arrows" | "dots" | "both" | "none";
}

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & CarouselControlsProps
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 rounded-full z-10",
        !canScrollPrev && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollPrev();
        console.log("Previous button clicked");
      }}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & CarouselControlsProps
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 rounded-full z-10",
        !canScrollNext && "opacity-50 cursor-not-allowed", 
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollNext();
        console.log("Next button clicked");
      }}
      disabled={!canScrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { CarouselPrevious, CarouselNext };
