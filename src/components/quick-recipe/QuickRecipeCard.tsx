
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CookingPot, ShoppingCart, Clock, Star } from 'lucide-react';
import { type QuickRecipe } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onCook: () => void;
  onShop: () => void;
  onSave?: () => void;
}

export function QuickRecipeCard({ recipe, onCook, onShop, onSave }: QuickRecipeCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md hover:shadow-lg transition-all animate-fadeIn">
      <div className="relative">
        <Badge className="absolute top-3 right-3 bg-recipe-green px-2 py-1 text-white">
          <Star className="h-3 w-3 mr-1 fill-current" /> Quick Recipe
        </Badge>
      </div>
      
      <CardHeader className={`${isMobile ? "px-4 py-3" : ""} text-center`}>
        <CardTitle className="text-xl md:text-2xl font-bold">{recipe.title}</CardTitle>
        <p className="text-muted-foreground text-sm md:text-base">{recipe.description}</p>
      </CardHeader>
      
      <CardContent className={`space-y-4 ${isMobile ? "px-4 py-2" : ""}`}>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-around">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Prep</p>
            <p className="font-medium flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1 text-recipe-blue" />
              {recipe.prepTime} min
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Cook</p>
            <p className="font-medium flex items-center justify-center">
              <CookingPot className="h-3 w-3 mr-1 text-recipe-orange" />
              {recipe.cookTime} min
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-medium">{recipe.prepTime + recipe.cookTime} min</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-gray-800 flex items-center">
            <span className="inline-block w-2 h-2 bg-recipe-green rounded-full mr-2"></span>
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="text-sm">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-gray-800 flex items-center">
            <span className="inline-block w-2 h-2 bg-recipe-blue rounded-full mr-2"></span>
            Quick Steps
          </h3>
          <ol className="list-decimal list-inside space-y-1">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="text-sm">{step}</li>
            ))}
          </ol>
        </div>
        
        <div className="bg-recipe-green/10 p-3 rounded-md text-xs md:text-sm">
          <span className="font-medium text-recipe-green flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Nutrition highlight:
          </span> 
          <p className="mt-1">{recipe.nutritionHighlight}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            onClick={onCook} 
            className="bg-recipe-green hover:bg-recipe-green/90"
            size={isMobile ? "sm" : "default"}
          >
            <CookingPot className="mr-1 h-4 w-4" />
            Start Cooking
          </Button>
          <Button 
            onClick={onShop} 
            variant="outline" 
            className="border-recipe-blue text-recipe-blue hover:bg-recipe-blue/10"
            size={isMobile ? "sm" : "default"}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Get Ingredients
          </Button>
        </div>
        {onSave && (
          <Button 
            onClick={onSave} 
            variant="ghost" 
            className="w-full text-xs md:text-sm text-muted-foreground hover:text-foreground"
            size={isMobile ? "sm" : "default"}
          >
            Save & Customize Recipe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
