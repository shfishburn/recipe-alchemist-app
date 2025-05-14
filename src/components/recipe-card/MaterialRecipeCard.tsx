
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Utensils, ChartPie, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface MaterialRecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
  className?: string;
}

export function MaterialRecipeCard({ recipe, priority = false, className }: MaterialRecipeCardProps) {
  const isMobile = useIsMobile();
  const [elevated, setElevated] = React.useState(false);
  
  // Safe URL generation
  const recipeUrl = recipe.slug 
    ? `/recipes/${recipe.slug}` 
    : `/recipes/${recipe.id}`;
  
  // Calculate total time safely
  const prepTime = recipe.prep_time_min || 0;
  const cookTime = recipe.cook_time_min || 0;
  const totalTime = prepTime + cookTime;
  const timeText = totalTime > 0 ? `${totalTime} min` : 'Quick';
  
  // Check if recipe is AI generated (optional property)
  const isAiGenerated = Boolean(
    (recipe as any).ai_generated || 
    (recipe as any).generated_by_ai
  );
  
  // Check if recipe has nutrition data
  const hasNutrition = Boolean(
    recipe.nutrition || 
    (recipe as any).nutrition_per_serving || 
    (recipe as any).macros
  );
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all relative",
        elevated ? "shadow-elevation-2" : "shadow-elevation-1",
        "transform duration-200 ease-out",
        className
      )}
      onMouseEnter={() => setElevated(true)}
      onMouseLeave={() => setElevated(false)}
      onTouchStart={() => setElevated(true)}
      onTouchEnd={() => setTimeout(() => setElevated(false), 150)}
    >
      <Link to={recipeUrl} className="block h-full">
        {/* Material Design 16:9 aspect ratio for images */}
        <AspectRatio ratio={16/9} className="w-full">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title || 'Recipe'}
              className="object-cover w-full h-full"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          {/* Material Design scrim overlay for improved text readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badges with Material Design styling */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {timeText && (
              <Badge variant="secondary" className="bg-black/70 text-white border-0 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeText}</span>
              </Badge>
            )}
            
            {recipe.cuisine && (
              <Badge variant="outline" className="bg-white/90 text-foreground border-0">
                <Utensils className="h-3 w-3 mr-1" />
                {recipe.cuisine}
              </Badge>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {isAiGenerated && (
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-0 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>AI</span>
              </Badge>
            )}
            
            {hasNutrition && (
              <Badge variant="secondary" className="bg-recipe-green/90 text-white border-0 flex items-center gap-1">
                <ChartPie className="h-3 w-3" />
                <span>Nutrition</span>
              </Badge>
            )}
          </div>
        </AspectRatio>
        
        {/* Material Design typography and spacing */}
        <CardContent className={cn(
          "p-4", 
          isMobile ? "space-y-1" : "space-y-2"
        )}>
          <h3 className={cn(
            "material-title-medium line-clamp-2",
            "text-base font-medium leading-tight",
            elevated && "text-primary transition-colors"
          )}>
            {recipe.title || 'Untitled Recipe'}
          </h3>
          
          {recipe.tagline && (
            <p className="material-body-medium line-clamp-2 text-muted-foreground">
              {recipe.tagline}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
