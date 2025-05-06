
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("swiper-wrapper", className)} {...props}>
        {children}
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

export { CarouselContent };
