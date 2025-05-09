
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarouselNavProps } from "./types";

export function CarouselNavigation({ 
  onPrevious, 
  onNext, 
  arrowPosition = "inside",
  showArrows,
  itemsCount 
}: CarouselNavProps) {
  if (!showArrows || itemsCount <= 1) return null;
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onPrevious}
        className={cn(
          "carousel-nav-button absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm",
          arrowPosition === "outside" ? "-left-12 md:-left-16" : "left-2"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onNext}
        className={cn(
          "carousel-nav-button absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm",
          arrowPosition === "outside" ? "-right-12 md:-right-16" : "right-2"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}
