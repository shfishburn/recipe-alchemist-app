
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FeaturedRecipeProps {
  recipe: Recipe;
}

const FeaturedRecipe: React.FC<FeaturedRecipeProps> = ({ recipe }) => {
  return (
    <Card className="overflow-hidden border-gray-200">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 relative">
          <AspectRatio ratio={16 / 9} className="bg-gray-100 md:h-full">
            {recipe.image_url ? (
              <img 
                src={recipe.image_url} 
                alt={recipe.title} 
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-100 to-gray-200">
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </AspectRatio>
        </div>
        <div className="w-full md:w-3/5 p-6">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-semibold mb-2">{recipe.title}</h3>
              <p className="text-muted-foreground">{recipe.tagline || 'No description available'}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.cuisine && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {recipe.cuisine}
                  </span>
                )}
                {recipe.dietary && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {recipe.dietary}
                  </span>
                )}
                {recipe.prep_time_min && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                    Prep: {recipe.prep_time_min} min
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Button asChild className="gap-1">
                <Link to={`/recipes/${recipe.id}`}>
                  View Recipe <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedRecipe;
