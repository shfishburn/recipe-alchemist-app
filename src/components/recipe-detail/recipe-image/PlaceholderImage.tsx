
import { Image as ImageIcon } from "lucide-react";

export function PlaceholderImage({ hasError }: { hasError: boolean }) {
  return (
    <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg">
      <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">
        {hasError ? "Image unavailable" : "No image available"}
      </p>
    </div>
  );
}
