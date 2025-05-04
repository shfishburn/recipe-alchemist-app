
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/types/recipe';
import { useRecipeImage } from '@/hooks/use-recipe-image';
import { LoadingState } from './recipe-image/LoadingState';
import { PlaceholderImage } from './recipe-image/PlaceholderImage';
import { ImageDrawer } from './recipe-image/ImageDrawer';
import { ImageRegenerationForm } from './recipe-image/ImageRegenerationForm';
import { ImageControls } from './recipe-image/ImageControls';

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

  const handleImageError = () => {
    setImageError(true);
  };

  const openFullImage = () => {
    if (imageUrl && !imageError) {
      setShowImageDrawer(true);
    }
  };

  const handleRegenerationComplete = () => {
    window.location.reload();
  };

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
              <PlaceholderImage 
                hasError={imageError} 
                onClick={generateNewImage}
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

      <ImageDrawer
        open={showImageDrawer}
        onOpenChange={setShowImageDrawer}
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
