
import { Image as ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  hasError: boolean;
  onClick?: () => void;
}

export function PlaceholderImage({ hasError, onClick }: PlaceholderImageProps) {
  return (
    <div 
      className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      aria-label={hasError ? "Image unavailable" : "Generate recipe image"}
    >
      <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground text-center">
        {hasError ? "Image unavailable" : "No image available"}
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-xs mt-1">
        {!hasError && "Generate a beautiful image of this recipe with AI"}
      </p>
      {!hasError && (
        <p className="text-xs text-muted-foreground text-center max-w-xs mt-1 italic">
          Click here to create an image
        </p>
      )}
    </div>
  );
}
