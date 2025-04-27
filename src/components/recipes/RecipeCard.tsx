
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteRecipe } from '@/hooks/use-delete-recipe';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Check if the image URL has expired tokens
  useEffect(() => {
    if (recipe.image_url) {
      const hasExpirationParams = recipe.image_url.includes("st=") && recipe.image_url.includes("se=");
      
      if (hasExpirationParams) {
        const currentTime = new Date().getTime();
        const expireTimeMatch = recipe.image_url.match(/se=(\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}Z)/);
        
        if (expireTimeMatch) {
          try {
            const expireTime = new Date(decodeURIComponent(expireTimeMatch[1])).getTime();
            if (currentTime > expireTime) {
              console.log("Card image URL has expired, showing fallback");
              setImageError(true);
            } else {
              setImageUrl(recipe.image_url);
            }
          } catch (e) {
            console.error("Error parsing expiration time:", e);
            setImageError(true);
          }
        } else {
          setImageUrl(recipe.image_url);
        }
      } else {
        setImageUrl(recipe.image_url);
      }
    }
  }, [recipe.image_url]);

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(null);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {imageUrl && !imageError ? (
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
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {recipe.prep_time_min && `${recipe.prep_time_min} min prep`}
          {recipe.cook_time_min && recipe.prep_time_min && ' • '}
          {recipe.cook_time_min && `${recipe.cook_time_min} min cook`}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              deleteRecipe(recipe.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
