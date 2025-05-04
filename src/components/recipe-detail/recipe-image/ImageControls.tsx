
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ImagePlus, Edit } from 'lucide-react';

interface ImageControlsProps {
  imageUrl: string | null;
  imageError: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onCustomize: () => void;
}

export function ImageControls({
  imageUrl,
  imageError,
  isGenerating,
  onGenerate,
  onCustomize
}: ImageControlsProps) {
  const shouldShowGenerateButton = !imageUrl || imageError;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      {shouldShowGenerateButton ? (
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          variant="secondary"
          size="sm"
          className="bg-recipe-blue text-white hover:bg-recipe-blue/80 touch-target-base"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      ) : (
        <>
          <Button
            onClick={onCustomize}
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-muted touch-target-base"
            disabled={isGenerating}
          >
            <Edit className="mr-2 h-4 w-4" />
            Customize
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
            className="bg-recipe-blue text-white hover:bg-recipe-blue/80 touch-target-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
