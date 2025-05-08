
import React from "react";

export interface CarouselCounterProps {
  current: number;
  total: number;
  showCounter: boolean;
}

export function CarouselCounter({ current, total, showCounter }: CarouselCounterProps) {
  if (!showCounter || total <= 1) return null;
  
  return (
    <div className="text-center text-xs md:text-sm text-muted-foreground mt-1" aria-live="polite">
      Slide {current + 1} of {total}
    </div>
  );
}
