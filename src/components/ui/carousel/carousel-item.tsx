
"use client";

import * as React from "react";
import { SwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <SwiperSlide
      ref={ref}
      className={cn("", className)}
      {...props}
    />
  );
});

CarouselItem.displayName = "CarouselItem";

export { CarouselItem };
