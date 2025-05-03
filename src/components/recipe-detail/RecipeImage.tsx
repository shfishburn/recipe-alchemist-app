
import { useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types/recipe';
import { useRecipeImage } from '@/hooks/use-recipe-image';
import { LoadingState } from './recipe-image/LoadingState';
import { PlaceholderImage } from './recipe-image/PlaceholderImage';
import { ImageDialog } from './recipe-image/ImageDialog';
import { ImageRegenerationForm } from './recipe-image/ImageRegenerationForm';
import { Card, CardContent } from '@/components/ui/card';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showRegenerationForm, setShowRegenerationForm] = useState(false);
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

  const handleRegenerationComplete = () => {
    window.location.reload();
  };

  const shouldShowGenerateButton = !imageUrl || imageError;

  return (
    <Card className="mb-6 overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <div className="rounded-lg overflow-hidden">
            {isMigratingImage ? (
              <LoadingState />
            ) : imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={recipe.title}
                className="w-full aspect-video object-cover cursor-pointer"
                onError={handleImageError}
                onClick={openFullImage}
              />
            ) : (
              <PlaceholderImage hasError={imageError} />
            )}
          </div>
          
          <div className="mt-2 p-3 flex justify-end gap-2">
            {shouldShowGenerateButton ? (
              <Button
                onClick={generateNewImage}
                disabled={isGenerating}
                variant="secondary"
                size="sm"
                className="bg-recipe-blue text-white hover:bg-recipe-blue/80"
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
                  onClick={() => setShowRegenerationForm(true)}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  disabled={isGenerating}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Customize
                </Button>
                <Button
                  onClick={generateNewImage}
                  disabled={isGenerating}
                  variant="secondary"
                  size="sm"
                  className="bg-recipe-blue text-white hover:bg-recipe-blue/80"
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
        </div>
      </CardContent>

      <ImageDialog
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        imageUrl={imageUrl || ''}
        title={recipe.title}
        onError={handleImageError}
      />

      <ImageRegenerationForm
        open={showRegenerationForm}
        onOpenChange={setShowRegenerationForm}
        recipeId={recipe.id}
        recipeTitle={recipe.title}
        onRegenerationComplete={handleRegenerationComplete}
      />
    </Card>
  );
}
