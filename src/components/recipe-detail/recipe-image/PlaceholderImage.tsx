
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
    >
      <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground text-center">
        {hasError ? "Image unavailable" : "No image available"}
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-xs mt-1">
        {!hasError && "Generate a beautiful image of this recipe with AI"}
      </p>
    </div>
  );
}
