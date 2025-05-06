
"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HorizontalChartScrollProps {
  children: React.ReactNode;
  className?: string;
  showControls?: boolean;
  spaceBetween?: number;
  itemClassName?: string;
  id?: string;
  slidesPerView?: number | "auto";
  controlsClassName?: string;
}

export function HorizontalChartScroll({
  children,
  className,
  showControls = false,
  spaceBetween = 16,
  itemClassName,
  id,
  slidesPerView = "auto",
  controlsClassName,
}: HorizontalChartScrollProps) {
  // Convert children to array for mapping
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div 
      className={cn("chart-scroll-wrapper", className)}
      role="region" 
      aria-label="Horizontally scrollable charts"
      id={id}
    >
      <Carousel
        opts={{
          align: "start",
          loop: false,
          slidesPerView: slidesPerView,
          spaceBetween: spaceBetween,
          breakpoints: {
            // Responsive settings
            640: { slidesPerView: typeof slidesPerView === "number" ? slidesPerView : 1 },
            768: { slidesPerView: typeof slidesPerView === "number" ? Math.min(slidesPerView + 1, childrenArray.length) : 2 }
          },
        }}
        className="w-full hw-accelerated touch-scroll"
      >
        <CarouselContent className="!ml-0">
          {childrenArray.map((child, index) => (
            <CarouselItem 
              key={index} 
              className={cn("pl-0 touch-pan-x", itemClassName)}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showControls && childrenArray.length > 1 && (
          <>
            <CarouselPrevious className={cn("left-0", controlsClassName)} />
            <CarouselNext className={cn("right-0", controlsClassName)} />
          </>
        )}
      </Carousel>
      
      {childrenArray.length > 1 && (
        <div className="text-xs text-center text-muted-foreground mt-2 swipe-indicator">
          <span className="inline-block touch-target-base">Scroll to see more</span>
        </div>
      )}
    </div>
  );
}
