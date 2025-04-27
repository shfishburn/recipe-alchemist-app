
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadImageFromUrl } from '@/utils/image-storage';
import type { Recipe } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useRecipeImage(recipe: Recipe) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMigratingImage, setIsMigratingImage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const migrateImageIfNeeded = async () => {
      if (!recipe.image_url) {
        setImageError(true);
        return;
      }

      if (recipe.image_url.includes('recipe-images')) {
        setImageUrl(recipe.image_url);
        return;
      }

      if (recipe.image_url.includes('openai') || 
          recipe.image_url.includes('oai') || 
          recipe.image_url.startsWith('http')) {
        setIsMigratingImage(true);
        try {
          const fileName = `recipe-${recipe.id}-${Date.now()}.png`;
          const newUrl = await uploadImageFromUrl(recipe.image_url, fileName);
          
          if (newUrl) {
            const { error: updateError } = await supabase
              .from('recipes')
              .update({ image_url: newUrl })
              .eq('id', recipe.id);

            if (!updateError) {
              setImageUrl(newUrl);
            } else {
              console.error('Error updating recipe image URL:', updateError);
              setImageError(true);
            }
          } else {
            setImageError(true);
          }
        } catch (error) {
          console.error('Error migrating image:', error);
          setImageError(true);
        }
        setIsMigratingImage(false);
      } else {
        setImageUrl(recipe.image_url);
      }
    };

    migrateImageIfNeeded();
  }, [recipe.image_url, recipe.id]);

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
          recipeId: recipe.id
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Generated a new image for your recipe",
      });

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

  return {
    isGenerating,
    imageError,
    imageUrl,
    isMigratingImage,
    generateNewImage,
    setImageError
  };
}
