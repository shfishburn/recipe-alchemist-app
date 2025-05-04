
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/types/recipe';
import { useRecipeImage } from '@/hooks/use-recipe-image';
import { LoadingState } from './recipe-image/LoadingState';
import { PlaceholderImage } from './recipe-image/PlaceholderImage';
import { ImageDrawer } from './recipe-image/ImageDrawer';
import { ImageRegenerationForm } from './recipe-image/ImageRegenerationForm';
import { ImageControls } from './recipe-image/ImageControls';
import { ImageLoader } from '@/components/ui/image-loader';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [showImageDrawer, setShowImageDrawer] = useState(false);
  const [showRegenerationForm, setShowRegenerationForm] = useState(false);
  const {
    isGenerating,
    imageError,
    imageUrl,
    isMigratingImage,
    generateNewImage,
    setImageError
  } = useRecipeImage(recipe);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, [setImageError]);

  const openFullImage = useCallback(() => {
    if (imageUrl && !imageError) {
      setShowImageDrawer(true);
    }
  }, [imageUrl, imageError]);

  const handleGenerateImage = useCallback(() => {
    if (imageError || !imageUrl) {
      generateNewImage();
    } else {
      setShowImageDrawer(true);
    }
  }, [imageError, imageUrl, generateNewImage]);

  const handleRegenerationComplete = useCallback(() => {
    window.location.reload();
  }, []);

  const closeImageDrawer = useCallback(() => {
    setShowImageDrawer(false);
  }, []);

  return (
    <Card className="mb-6 overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <div className="rounded-lg overflow-hidden">
            {isMigratingImage ? (
              <LoadingState />
            ) : imageUrl && !imageError ? (
              <ImageLoader
                src={imageUrl}
                alt={recipe.title}
                className="w-full aspect-video object-cover cursor-pointer"
                onError={handleImageError}
                onClick={openFullImage}
              />
            ) : (
              <PlaceholderImage 
                hasError={imageError} 
                onClick={handleGenerateImage}
              />
            )}
          </div>
        </div>
      </CardContent>

      {/* Image controls now inside the drawer/modal rather than beneath the image */}
      <ImageControls 
        imageUrl={imageUrl}
        imageError={imageError}
        isGenerating={isGenerating}
        onGenerate={generateNewImage}
        onCustomize={() => setShowRegenerationForm(true)}
      />

      {/* Using a safer way to conditionally render the drawer to prevent portal issues */}
      {imageUrl && (
        <ImageDrawer
          open={showImageDrawer}
          onOpenChange={closeImageDrawer}
          imageUrl={imageUrl}
          title={recipe.title}
          onError={handleImageError}
        />
      )}

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
