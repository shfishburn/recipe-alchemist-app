
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel-context";

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  aspectRatio?: number | string; // Can be a number like 16/9 or a string like "16/9"
  fill?: boolean;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, index, aspectRatio, fill = false, ...props }, ref) => {
    const { direction, activeIndex } = useCarousel();
    
    // Style for maintaining aspect ratio
    const aspectRatioStyle: React.CSSProperties = aspectRatio
      ? {
          aspectRatio: typeof aspectRatio === "string" ? aspectRatio : String(aspectRatio),
          objectFit: fill ? "cover" : "contain" as "cover" | "contain",
        }
      : {};
    
    // Add scroll-snap-align for proper snapping
    const styleWithSnap: React.CSSProperties = {
      ...aspectRatioStyle,
      scrollSnapAlign: "start",
    };
    
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${index !== undefined ? index + 1 : "item"}`}
        aria-selected={index === activeIndex ? true : false}
        tabIndex={index === activeIndex ? 0 : -1}
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full hw-accelerated carousel-focusable",
          className
        )}
        style={styleWithSnap}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";
