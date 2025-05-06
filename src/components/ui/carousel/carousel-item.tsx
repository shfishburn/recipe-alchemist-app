
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-full flex-shrink-0 snap-center w-full hw-accelerated",
        className
      )}
      role="group"
      aria-roledescription="slide"
      {...props}
    />
  );
});

CarouselItem.displayName = "CarouselItem";

export { CarouselItem };
