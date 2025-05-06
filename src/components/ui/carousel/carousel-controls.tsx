
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
  const [isActive, setIsActive] = React.useState(false);

  // Handle all possible events for better cross-device compatibility
  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't prevent default for touch events to maintain natural touch behavior
    if (!(e.nativeEvent instanceof TouchEvent)) {
      e.preventDefault();
    }
    scrollPrev();
    console.log("Previous button pressed");
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 rounded-full z-10 touch-target-base",
        !canScrollPrev && "opacity-50 cursor-not-allowed",
        isActive && "opacity-70 scale-95",
        className
      )}
      onClick={handlePress}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
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
  const [isActive, setIsActive] = React.useState(false);

  // Handle all possible events for better cross-device compatibility
  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't prevent default for touch events to maintain natural touch behavior
    if (!(e.nativeEvent instanceof TouchEvent)) {
      e.preventDefault();
    }
    scrollNext();
    console.log("Next button pressed");
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 rounded-full z-10 touch-target-base",
        !canScrollNext && "opacity-50 cursor-not-allowed",
        isActive && "opacity-70 scale-95",
        className
      )}
      onClick={handlePress}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
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
