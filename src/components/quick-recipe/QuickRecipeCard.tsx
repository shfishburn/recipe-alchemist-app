
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
      {/* Recipe Header */}
      <div className="p-4 pb-2 text-center">
        <div className="flex items-center justify-center mb-1 gap-2">
          <h2 className="text-2xl font-bold">Quick & Easy</h2>
          <Badge className="bg-recipe-green px-2 py-1 text-white">
            <Star className="h-3 w-3 mr-1 fill-current" /> Quick Recipe
          </Badge>
        </div>
        <p className="text-muted-foreground text-base">{recipe.description}</p>
      </div>
      
      {/* Timing Information */}
      <div className="bg-gray-50 mx-4 rounded-lg my-3">
        <div className="grid grid-cols-3 divide-x">
          <div className="px-2 py-3 text-center">
            <p className="text-gray-500 text-sm">Prep</p>
            <p className="font-medium flex items-center justify-center">
              <Clock className="h-4 w-4 mr-1 text-green-500" />
              {recipe.prepTime} min
            </p>
          </div>
          <div className="px-2 py-3 text-center">
            <p className="text-gray-500 text-sm">Cook</p>
            <p className="font-medium flex items-center justify-center">
              <CookingPot className="h-4 w-4 mr-1 text-orange-500" />
              {recipe.cookTime} min
            </p>
          </div>
          <div className="px-2 py-3 text-center">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="font-medium">{recipe.prepTime + recipe.cookTime} min</p>
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-5 px-4">
        {/* Ingredients Section */}
        <div>
          <h3 className="font-semibold mb-3 text-xl flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Ingredients
          </h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-baseline">
                <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mr-2 mt-2"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Steps Section */}
        <div>
          <h3 className="font-semibold mb-3 text-xl flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Quick Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="text-base">
                {step}
              </li>
            ))}
          </ol>
        </div>
        
        {/* Nutrition Section */}
        <div className="bg-green-50 p-3 rounded-md">
          <span className="font-medium text-green-700 flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Nutrition highlight:
          </span> 
          <p className="mt-1">{recipe.nutritionHighlight}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 px-4 pb-4 pt-0">
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button 
            onClick={onCook} 
            className="bg-recipe-blue hover:bg-recipe-blue/90 text-white font-medium shadow-sm"
            size="lg"
          >
            <CookingPot className="mr-2 h-5 w-5" />
            Start Cooking
          </Button>
          <Button 
            onClick={onShop} 
            variant="outline" 
            className="border-2 border-recipe-green text-recipe-green hover:bg-green-50 shadow-sm font-medium"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Get Ingredients
          </Button>
        </div>
        {onSave && (
          <Button 
            onClick={onSave} 
            variant="ghost" 
            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            Save & Customize Recipe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
