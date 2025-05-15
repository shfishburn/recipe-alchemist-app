
import React from 'react';
import { cn } from '@/lib/utils';

export interface CarouselItem {
  id: string | number;
}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full overflow-x-auto snap-x snap-mandatory",
      className
    )}
    {...props}
  />
));
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-none snap-start",
      className
    )}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md",
      className
    )}
    {...props}
  >
    <span className="sr-only">Previous slide</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  </button>
));
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md",
      className
    )}
    {...props}
  >
    <span className="sr-only">Next slide</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </button>
));
CarouselNext.displayName = "CarouselNext";

export const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { progress: number }
>(({ className, progress = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-2 left-0 right-0 mx-auto w-3/4 h-1 bg-gray-200 rounded-full overflow-hidden",
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-primary transition-all"
      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
    />
  </div>
));
CarouselProgress.displayName = "CarouselProgress";
