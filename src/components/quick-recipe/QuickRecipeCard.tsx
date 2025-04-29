
import React from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CookingPot, ShoppingBag, Bookmark, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onCook: () => void;
  onShop: () => void;
  onSave: () => void;
  onPrint?: () => void;
}

export function QuickRecipeCard({ recipe, onCook, onShop, onSave, onPrint }: QuickRecipeCardProps) {
  return (
    <Card className="w-full border-2 border-recipe-green/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {recipe.title}
        </CardTitle>
        <p className="text-muted-foreground">{recipe.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time indicators */}
        <div className="flex justify-between border-t border-b py-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Prep</div>
            <div className="flex items-center justify-center gap-1 font-medium">
              <Clock className="h-4 w-4 text-recipe-green" />
              {recipe.prepTime} min
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Cook</div>
            <div className="flex items-center justify-center gap-1 font-medium">
              <CookingPot className="h-4 w-4 text-recipe-orange" />
              {recipe.cookTime} min
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-medium">
              {recipe.prepTime + recipe.cookTime} min
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-lg mb-2">
            <span className="bg-recipe-green h-5 w-5 rounded-full flex items-center justify-center text-white text-xs">•</span>
            Ingredients
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h3 className="flex items-center gap-2 font-medium text-lg mb-2">
            <span className="bg-recipe-green h-5 w-5 rounded-full flex items-center justify-center text-white text-xs">•</span>
            Quick Steps
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Nutrition Highlight */}
        {recipe.nutritionHighlight && (
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm font-medium">Nutrition Highlight</p>
            <p className="text-sm text-muted-foreground">{recipe.nutritionHighlight}</p>
          </div>
        )}

        {/* Action buttons - now full width */}
        <div className="pt-4 flex flex-col gap-2 w-full">
          <Button 
            onClick={onCook} 
            className="w-full bg-recipe-blue hover:bg-recipe-blue/90"
            size="lg"
          >
            <CookingPot className="mr-2 h-5 w-5" />
            Start Cooking
          </Button>
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={onShop}
              className="flex-1"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shopping List
            </Button>
            <Button 
              variant="outline" 
              onClick={onSave}
              className="flex-1"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Save Recipe
            </Button>
            <Button 
              variant="outline" 
              onClick={onPrint}
              className="flex-1"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
