
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">Processing image...</p>
    </div>
  );
}
