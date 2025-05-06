
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel";

interface CarouselPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  showNumbers?: boolean;
  variant?: "dots" | "numbers" | "fraction";
}

const CarouselPagination = React.forwardRef<
  HTMLDivElement,
  CarouselPaginationProps
>(({ className, showNumbers = false, variant = "dots", ...props }, ref) => {
  const { api, activeIndex } = useCarousel();
  const [slideCount, setSlideCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setSlideCount(api.slides.length);
  }, [api]);

  // Don't show if there's only one slide
  if (slideCount <= 1) {
    return null;
  }

  if (variant === "fraction") {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center mt-3", className)}
        {...props}
      >
        <span className="text-xs text-muted-foreground">
          {activeIndex + 1} / {slideCount}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-1.5 mt-3", className)}
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all",
            activeIndex === index
              ? "bg-primary scale-125"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          onClick={() => api?.slideTo(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={activeIndex === index ? "true" : "false"}
        />
      ))}
      
      {showNumbers && (
        <span className="text-xs text-muted-foreground ml-2">
          {activeIndex + 1} / {slideCount}
        </span>
      )}
    </div>
  );
});

CarouselPagination.displayName = "CarouselPagination";

export { CarouselPagination };
