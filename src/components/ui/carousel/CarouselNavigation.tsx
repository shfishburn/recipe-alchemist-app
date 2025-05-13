
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarouselNavProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

export function CarouselNavigation({ 
  onPrevious, 
  onNext, 
  arrowPosition = "inside",
  showArrows,
  itemsCount 
}: CarouselNavProps) {
  const isMobile = useIsMobile();
  
  if (!showArrows || itemsCount <= 1) return null;
  
  // Always use "inside" position on mobile
  const effectivePosition = isMobile ? "inside" : arrowPosition;
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPrevious}
        className={cn(
          "carousel-nav-button previous bg-white/80 dark:bg-gray-800/80 shadow-sm",
          effectivePosition === "outside" ? "-left-12 md:-left-16" : "left-1 sm:left-2",
          "w-8 h-8 sm:w-10 sm:h-10"
        )}
        aria-label="Previous slide"
        // Remove any touch feedback to prevent bouncing
        touchFeedback="none"
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onNext}
        className={cn(
          "carousel-nav-button next bg-white/80 dark:bg-gray-800/80 shadow-sm",
          effectivePosition === "outside" ? "-right-12 md:-right-16" : "right-1 sm:right-2",
          "w-8 h-8 sm:w-10 sm:h-10"
        )}
        aria-label="Next slide"
        // Remove any touch feedback to prevent bouncing
        touchFeedback="none"
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </>
  );
}
