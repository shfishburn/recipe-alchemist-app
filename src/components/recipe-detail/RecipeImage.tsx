
import { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types/recipe';
import { useRecipeImage } from '@/hooks/use-recipe-image';
import { LoadingState } from './recipe-image/LoadingState';
import { PlaceholderImage } from './recipe-image/PlaceholderImage';
import { ImageDialog } from './recipe-image/ImageDialog';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const {
    isGenerating,
    imageError,
    imageUrl,
    isMigratingImage,
    generateNewImage,
    setImageError
  } = useRecipeImage(recipe);

  const handleImageError = () => {
    setImageError(true);
  };

  const openFullImage = () => {
    if (imageUrl && !imageError) {
      setShowImageDialog(true);
    }
  };

  const shouldShowGenerateButton = !imageUrl || imageError;

  return (
    <div className="relative mb-6">
      <div className="rounded-lg overflow-hidden">
        {isMigratingImage ? (
          <LoadingState />
        ) : imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full aspect-video object-cover rounded-lg cursor-pointer"
            onError={handleImageError}
            onClick={openFullImage}
          />
        ) : (
          <PlaceholderImage hasError={imageError} />
        )}
      </div>
      {shouldShowGenerateButton && (
        <div className="mt-2 flex justify-end">
          <Button
            onClick={generateNewImage}
            disabled={isGenerating}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
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
        </div>
      )}

      <ImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        imageUrl={imageUrl || ''}
        title={recipe.title}
        onError={handleImageError}
      />
    </div>
  );
}

