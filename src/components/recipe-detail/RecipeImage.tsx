
import React from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
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
        },
      });

      if (response.error) throw response.error;

      // Create a new version of the recipe with the new image
      const newRecipeData = {
        ...recipe,
        id: undefined,
        previous_version_id: recipe.id,
        version_number: recipe.version_number + 1,
        image_url: response.data.imageUrl,
        user_id: user.id, // Include the user_id field which is required
        servings: recipe.servings || 4, // Default to 4 if somehow missing
        // Cast the complex objects to Json type for Supabase
        ingredients: recipe.ingredients as unknown as Json,
        nutrition: recipe.nutrition as unknown as Json
      };

      const { data: newRecipe, error: saveError } = await supabase
        .from('recipes')
        .insert(newRecipeData)
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Generated a new image for your recipe",
      });

      // Redirect to the new version
      window.location.href = `/recipes/${newRecipe.id}`;
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

  return (
    <div className="relative mb-6">
      <div className="rounded-lg overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg">
            <p className="text-muted-foreground">No image available</p>
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
