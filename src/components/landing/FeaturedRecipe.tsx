
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { formatCookingTime } from '@/utils/recipe-utils';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

export function FeaturedRecipe({ recipe }: FeaturedRecipeProps) {
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
  const formattedTime = formatCookingTime(totalTime);
  
  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-xl hw-boost">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden h-56 md:h-full min-h-[320px]">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
              <span className="text-amber-800/50 text-2xl font-medium">Recipe Alchemy</span>
            </div>
          )}
        </div>
        
        <CardContent className="flex flex-col justify-between py-6 md:pr-6 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine && (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                  {recipe.cuisine}
                </Badge>
              )}
              {recipe.dietary && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  {recipe.dietary}
                </Badge>
              )}
              {formattedTime && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formattedTime}</span>
                </Badge>
              )}
            </div>
            
            <h2 className="text-2xl font-semibold tracking-tight">{recipe.title}</h2>
            <p className="text-muted-foreground">{recipe.tagline || 'No description available'}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.flavor_tags?.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Link to={`/recipes/${recipe.id}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group">
                View Recipe
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
}
