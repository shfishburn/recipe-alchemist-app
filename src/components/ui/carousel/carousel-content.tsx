
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel-context";

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, containerClassName, ...props }, ref) => {
    const { direction } = useCarousel();
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          direction === "horizontal" ? "flex-row" : "flex-col",
          containerClassName
        )}
        role="list"
        aria-orientation={direction === "horizontal" ? "horizontal" : "vertical"}
        {...props}
      />
    );
  }
);
CarouselContent.displayName = "CarouselContent";
