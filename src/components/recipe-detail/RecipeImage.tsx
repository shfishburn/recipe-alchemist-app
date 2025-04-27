
import React, { useState, useEffect } from 'react';
import { ImagePlus, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Recipe } from '@/types/recipe';
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
  const [imageUrl, setImageUrl] = useState<string | null>(recipe.image_url);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if the image URL has expired tokens
  useEffect(() => {
    if (recipe.image_url) {
      // If the URL contains expiration parameters, it might be an OpenAI URL with time-limited access
      const hasExpirationParams = recipe.image_url.includes("st=") && recipe.image_url.includes("se=");
      
      if (hasExpirationParams) {
        // For expired OpenAI URLs, set image error to true to show fallback
        const currentTime = new Date().getTime();
        const expireTimeMatch = recipe.image_url.match(/se=(\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}Z)/);
        
        if (expireTimeMatch) {
          try {
            const expireTime = new Date(decodeURIComponent(expireTimeMatch[1])).getTime();
            if (currentTime > expireTime) {
              console.log("Image URL has expired, showing fallback");
              setImageError(true);
              setImageUrl(null);
            }
          } catch (e) {
            console.error("Error parsing expiration time:", e);
          }
        }
      }
    }
  }, [recipe.image_url]);

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
      setImageUrl(recipe.image_url);
    }
  }, [recipe.id, recipe.image_url]);

  const handleImageError = () => {
    console.error('Image failed to load:', imageUrl);
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
        {imageUrl && !imageError ? (
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

      {/* Full Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl" aria-describedby="image-dialog-description">
          <DialogHeader>
            <DialogTitle>{recipe.title}</DialogTitle>
            <DialogDescription id="image-dialog-description">
              Full image view
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={imageUrl || ''}
              alt={recipe.title}
              className="max-h-[70vh] object-contain rounded-md"
              onError={handleImageError}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
