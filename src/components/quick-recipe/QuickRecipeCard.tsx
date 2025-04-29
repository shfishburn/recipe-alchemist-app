
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CookingPot, ShoppingCart } from 'lucide-react';
import { type QuickRecipe } from '@/hooks/use-quick-recipe';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onCook: () => void;
  onShop: () => void;
  onSave?: () => void;
}

export function QuickRecipeCard({ recipe, onCook, onShop, onSave }: QuickRecipeCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-lg animate-fadeIn">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="text-xl md:text-2xl font-bold text-center">{recipe.title}</CardTitle>
        <p className="text-center text-muted-foreground text-sm md:text-base">{recipe.description}</p>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "px-4 py-2" : ""}`}>
        <div>
          <h3 className="font-medium mb-2 text-gray-800">Ingredients</h3>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="text-sm">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-gray-800">Quick Steps</h3>
          <ol className="list-decimal list-inside space-y-1">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="text-sm">{step}</li>
            ))}
          </ol>
        </div>
        
        <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
          <div>Prep: {recipe.prepTime} min</div>
          <div>Cook: {recipe.cookTime} min</div>
          <div>Total: {recipe.prepTime + recipe.cookTime} min</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md text-xs md:text-sm">
          <span className="font-medium">Nutrition highlight:</span> {recipe.nutritionHighlight}
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
            Quick Cook Mode
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
            className="w-full text-xs md:text-sm text-muted-foreground"
            size={isMobile ? "sm" : "default"}
          >
            Save & Customize Recipe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
