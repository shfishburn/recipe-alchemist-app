
import { ImagePlus, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  hasError: boolean;
  onClick?: () => void;
  variant?: "detail" | "card";
  title?: string;
}

export function PlaceholderImage({ 
  hasError, 
  onClick, 
  variant = "detail",
  title
}: PlaceholderImageProps) {
  const isCard = variant === "card";
  
  return (
    <div 
      className={cn(
        "w-full aspect-video flex flex-col items-center justify-center rounded-lg",
        isCard 
          ? "bg-gradient-to-b from-gray-100 to-gray-200 touch-feedback-optimized" 
          : "bg-muted cursor-pointer touch-feedback-strong image-placeholder-cta",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={isCard ? "Recipe without image" : "Tap to add recipe image"}
    >
      {isCard ? (
        <div className="relative w-full h-full">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="border border-gray-400 flex items-center justify-center">
                {i === 4 && <UtensilsCrossed className="h-6 w-6 text-gray-500" />}
              </div>
            ))}
          </div>
          
          {/* Central icon and text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <ImagePlus className="h-8 w-8 text-recipe-blue mb-1" />
            <p className="text-xs text-center text-gray-600">
              {title ? `Image for ${title.length > 15 ? title.substring(0, 15) + '...' : title} will appear here` : 'Recipe image will appear here'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <ImagePlus className="h-12 w-12 text-recipe-blue mb-2" />
          
          <div className="text-center px-4">
            <p className="text-muted-foreground font-medium">Generate Recipe Image</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a beautiful AI-generated image of this recipe
            </p>
          </div>
        </>
      )}
    </div>
  );
}
