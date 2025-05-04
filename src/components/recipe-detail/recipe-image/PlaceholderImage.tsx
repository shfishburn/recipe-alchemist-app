
import { ImagePlus } from "lucide-react";

interface PlaceholderImageProps {
  hasError: boolean;
  onClick?: () => void;
}

export function PlaceholderImage({ hasError, onClick }: PlaceholderImageProps) {
  return (
    <div 
      className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg cursor-pointer touch-feedback-strong"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      aria-label={hasError ? "Generate recipe image" : "Generate recipe image"}
    >
      <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
      
      {hasError ? (
        <div className="text-center px-4">
          <p className="text-muted-foreground font-medium">Tap to generate an image</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a beautiful image of this recipe with AI
          </p>
        </div>
      ) : (
        <div className="text-center px-4">
          <p className="text-muted-foreground font-medium">Tap to generate an image</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a beautiful image of this recipe with AI
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Visualize your recipe before cooking!
          </p>
        </div>
      )}
    </div>
  );
}
