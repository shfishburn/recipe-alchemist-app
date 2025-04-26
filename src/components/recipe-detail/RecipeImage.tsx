
import React from 'react';
import { Loader2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const generateNewImage = async () => {
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
      const { data: newRecipe, error: saveError } = await supabase
        .from('recipes')
        .insert({
          ...recipe,
          id: undefined,
          previous_version_id: recipe.id,
          version_number: recipe.version_number + 1,
          image_url: response.data.imageUrl,
        })
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
    <div className="relative rounded-lg overflow-hidden mb-6">
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
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={generateNewImage}
          disabled={isGenerating}
          variant="secondary"
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              Generate New Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
