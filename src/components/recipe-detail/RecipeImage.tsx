
import React, { useState } from 'react';
import { ImagePlus, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateNewImage = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to generate a new image",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const response = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          recipeId: recipe.id // Pass the recipe ID
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Generated a new image for your recipe",
      });

      // Reload the page to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate new image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset image error state if the recipe or image URL changes
  React.useEffect(() => {
    if (recipe.image_url) {
      setImageError(false);
    }
  }, [recipe.id, recipe.image_url]);

  const handleImageError = () => {
    console.error('Image failed to load:', recipe.image_url);
    setImageError(true);
  };

  return (
    <div className="relative mb-6">
      <div className="rounded-lg overflow-hidden">
        {recipe.image_url && !imageError ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full aspect-video object-cover rounded-lg"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {imageError ? "Image failed to load" : "No image available"}
            </p>
          </div>
        )}
      </div>
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
    </div>
  );
}
