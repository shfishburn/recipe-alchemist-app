
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselPaginationProps {
  totalItems: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  showNumbers?: boolean;
  showArrows?: boolean;
  variant?: "dots" | "bullets" | "numbers";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CarouselPagination({
  totalItems,
  activeIndex,
  onSelect,
  showNumbers = false,
  showArrows = true,
  variant = "dots",
  className,
  size = "md"
}: CarouselPaginationProps) {
  if (totalItems <= 1) return null;
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: "gap-1",
      dot: "w-1.5 h-1.5",
      activeDot: "w-4 h-1.5",
      button: "h-6 w-6",
      icon: "h-3 w-3"
    },
    md: {
      container: "gap-2",
      dot: "w-2 h-2",
      activeDot: "w-6 h-2",
      button: "h-8 w-8",
      icon: "h-4 w-4"
    },
    lg: {
      container: "gap-3",
      dot: "w-2.5 h-2.5",
      activeDot: "w-8 h-2.5",
      button: "h-9 w-9",
      icon: "h-5 w-5"
    }
  };
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-gray-300 dark:border-gray-600",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "transition-colors mr-2",
            sizeClasses[size].button
          )}
          onClick={() => onSelect((activeIndex - 1 + totalItems) % totalItems)}
          aria-label="Previous slide"
        >
          <ChevronLeft className={sizeClasses[size].icon} />
        </Button>
      )}
      
      <div className={cn("flex items-center", sizeClasses[size].container)}>
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "transition-all focus:outline-none rounded-full",
              activeIndex === index
                ? cn(
                    variant === "dots" ? "bg-primary" : "bg-primary text-white",
                    variant === "dots" ? sizeClasses[size].activeDot : sizeClasses[size].dot
                  )
                : cn(
                    "bg-gray-300 dark:bg-gray-600 hover:bg-primary/50",
                    sizeClasses[size].dot
                  )
            )}
            onClick={() => onSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? "true" : "false"}
          >
            {variant === "numbers" && (
              <span className="sr-only">{index + 1}</span>
            )}
          </button>
        ))}
      </div>
      
      {showArrows && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-gray-300 dark:border-gray-600",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "transition-colors ml-2",
            sizeClasses[size].button
          )}
          onClick={() => onSelect((activeIndex + 1) % totalItems)}
          aria-label="Next slide"
        >
          <ChevronRight className={sizeClasses[size].icon} />
        </Button>
      )}
      
      {showNumbers && (
        <div className="text-xs text-muted-foreground ml-4" aria-live="polite">
          <span className="font-medium text-foreground">{activeIndex + 1}</span>
          {" / "}
          <span>{totalItems}</span>
        </div>
      )}
    </div>
  );
}
