
import React from "react";
import { cn } from "@/lib/utils";
import { CarouselPaginationProps } from "./types";

export function CarouselPagination({ 
  count,
  activeIndex,
  onClick,
  showDots
}: CarouselPaginationProps) {
  if (!showDots || count <= 1) return null;
  
  return (
    <div className="carousel-pagination" role="tablist">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "carousel-pagination-dot",
            activeIndex === index ? "carousel-pagination-dot-active" : ""
          )}
          onClick={() => onClick(index)}
          role="tab"
          aria-selected={activeIndex === index}
          aria-label={`Go to slide ${index + 1}`}
          tabIndex={activeIndex === index ? 0 : -1}
        />
      ))}
    </div>
  );
}
