
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// For backward compatibility - these are simplified versions of the original components
export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="list" className={cn("draggable flex", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

export const CarouselSlide = React.forwardRef<
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
CarouselSlide.displayName = "CarouselSlide";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute top-1/2 -translate-y-1/2 left-4 h-8 w-8 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
));
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute top-1/2 -translate-y-1/2 right-4 h-8 w-8 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
));
CarouselNext.displayName = "CarouselNext";

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
