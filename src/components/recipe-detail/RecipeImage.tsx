import React, { useState, useEffect } from 'react';
import { ImagePlus, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';
import { uploadImageFromUrl } from '@/utils/image-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RecipeImageProps {
  recipe: Recipe;
}

export function RecipeImage({ recipe }: RecipeImageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [isMigratingImage, setIsMigratingImage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const migrateImageIfNeeded = async () => {
      if (!recipe.image_url) {
        setImageError(true);
        return;
      }

      // Check if the image is already in our storage (URL contains recipe-images)
      if (recipe.image_url.includes('recipe-images')) {
        setImageUrl(recipe.image_url);
        return;
      }

      // If it's an OpenAI URL (temporary), migrate it
      if (recipe.image_url.includes('openai') || recipe.image_url.includes('oai')) {
        setIsMigratingImage(true);
        const fileName = `recipe-${recipe.id}-${Date.now()}.png`;
        const newUrl = await uploadImageFromUrl(recipe.image_url, fileName);
        
        if (newUrl) {
          // Update the recipe with the new URL
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

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(null);
  };

  const openFullImage = () => {
    if (imageUrl && !imageError) {
      setShowImageDialog(true);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="rounded-lg overflow-hidden">
        {isMigratingImage ? (
          <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Migrating image...</p>
          </div>
        ) : imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full aspect-video object-cover rounded-lg cursor-pointer"
            onError={handleImageError}
            onClick={openFullImage}
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center rounded-lg">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {imageError ? "Image unavailable" : "No image available"}
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

      {/* Full Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent 
          className="max-w-2xl" 
          aria-describedby="image-dialog-description"
        >
          <DialogHeader>
            <DialogTitle>{recipe.title}</DialogTitle>
            <DialogDescription id="image-dialog-description">
              Full image view
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={recipe.title}
                className="max-h-[70vh] object-contain rounded-md"
                onError={handleImageError}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
