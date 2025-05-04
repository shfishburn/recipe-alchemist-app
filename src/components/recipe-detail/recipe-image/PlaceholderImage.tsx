
import { ImagePlus } from "lucide-react";

interface PlaceholderImageProps {
  hasError: boolean;
  onClick?: () => void;
}

export function PlaceholderImage({ hasError, onClick }: PlaceholderImageProps) {
  return (
    <div 
      className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg cursor-pointer touch-feedback-strong image-placeholder-cta"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      aria-label="Tap to add recipe image"
    >
      <ImagePlus className="h-12 w-12 text-recipe-blue mb-2" />
      
      <div className="text-center px-4">
        <p className="text-muted-foreground font-medium">Generate Recipe Image</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create a beautiful AI-generated image of this recipe
        </p>
      </div>
    </div>
  );
}
