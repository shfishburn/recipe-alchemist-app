import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageFromUrl } from '@/utils/image-storage';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMigratingImage, setIsMigratingImage] = useState(false);

  useEffect(() => {
    const migrateImageIfNeeded = async () => {
      if (!recipe.image_url) {
        setImageError(true);
        return;
      }

      // Check if the image is already in our storage
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

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(null);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {isMigratingImage ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Migrating image...</span>
            </div>
          ) : imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={recipe.title}
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        
        <CardHeader>
          <h3 className="font-semibold text-lg leading-tight">{recipe.title}</h3>
          {recipe.tagline && (
            <p className="text-sm text-muted-foreground">{recipe.tagline}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recipe.cuisine && (
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {recipe.cuisine}
              </span>
            )}
            {recipe.dietary && (
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {recipe.dietary}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          {recipe.prep_time_min && `${recipe.prep_time_min} min prep`}
          {recipe.cook_time_min && recipe.prep_time_min && ' • '}
          {recipe.cook_time_min && `${recipe.cook_time_min} min cook`}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
