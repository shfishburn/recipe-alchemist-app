
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HorizontalChartScrollProps {
  children: React.ReactNode;
  className?: string;
  spaceBetween?: number;
  itemClassName?: string;
  id?: string;
  slidesPerView?: number | "auto";
}

export function HorizontalChartScroll({
  children,
  className,
  spaceBetween = 16,
  itemClassName,
  id,
  slidesPerView = "auto",
}: HorizontalChartScrollProps) {
  // Convert children to array for mapping
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div 
      className={cn("chart-scroll-wrapper w-full", className)}
      role="region" 
      aria-label="Horizontally scrollable charts"
      id={id}
    >
      <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
        <div className="flex flex-col gap-6 w-full">
          {childrenArray.map((child, index) => (
            <div 
              key={index} 
              className={cn(
                "flex-shrink-0 snap-center w-full",
                itemClassName
              )}
              style={{ marginBottom: index < childrenArray.length - 1 ? `${spaceBetween}px` : 0 }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {childrenArray.length > 1 && (
        <div className="text-xs text-center text-muted-foreground mt-2 swipe-indicator md:hidden">
          <span className="inline-block touch-target-base">Scroll to see more</span>
        </div>
      )}
    </div>
  );
}
