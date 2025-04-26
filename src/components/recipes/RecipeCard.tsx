
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
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
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
