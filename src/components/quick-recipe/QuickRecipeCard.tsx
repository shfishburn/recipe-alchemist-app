
import React, { useState } from 'react';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CookingPot, ShoppingBag, Bookmark, Printer, LightbulbIcon, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onCook: () => void;
  onShop: () => void;
  onSave: () => void;
  onPrint?: () => void;
  isSaving?: boolean;
}

// Helper function to format ingredient display text
const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  const { qty, unit, item, notes } = ingredient;
  let formatted = '';
  
  if (qty) {
    formatted += qty + ' ';
  }
  
  if (unit) {
    formatted += unit + ' ';
  }
  
  if (typeof item === 'string') {
    formatted += item;
  } else if (item && typeof item.item === 'string') {
    formatted += item.item;
  }
  
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted.trim();
};

export function QuickRecipeCard({ 
  recipe, 
  onCook, 
  onShop, 
  onSave, 
  onPrint,
  isSaving = false 
}: QuickRecipeCardProps) {
  const [showDebug, setShowDebug] = useState(false);

  // Function to copy JSON to clipboard
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(recipe, null, 2))
      .then(() => {
        alert('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
      });
  };
  
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
              <li key={index}>{formatIngredient(ingredient)}</li>
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

        {/* Nutrition Highlight & Cooking Tip */}
        <div className="flex flex-col sm:flex-row gap-3">
          {recipe.nutritionHighlight && (
            <div className="bg-slate-50 p-3 rounded-lg flex-1">
              <p className="text-sm font-medium">Nutrition Highlight</p>
              <p className="text-sm text-muted-foreground">{recipe.nutritionHighlight}</p>
            </div>
          )}
          {recipe.cookingTip && (
            <div className="bg-recipe-orange/10 p-3 rounded-lg flex-1">
              <p className="text-sm font-medium flex items-center gap-1">
                <LightbulbIcon className="h-4 w-4 text-recipe-orange" />
                Cooking Tip
              </p>
              <p className="text-sm text-muted-foreground">{recipe.cookingTip}</p>
            </div>
          )}
        </div>

        {/* Action buttons - fixed for mobile */}
        <div className="pt-4 flex flex-col gap-2 w-full">
          {/* Primary action - Start Cooking */}
          <Button 
            onClick={onCook} 
            className="w-full bg-recipe-blue hover:bg-recipe-blue/90"
            size="lg"
          >
            <CookingPot className="mr-2 h-5 w-5" />
            Start Cooking
          </Button>
          
          {/* Secondary actions in a proper grid layout */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={onShop}
              className="w-full"
            >
              <ShoppingBag className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Shopping List</span>
              <span className="sm:hidden">Shop</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onSave}
              className="w-full"
              disabled={isSaving}
            >
              <Bookmark className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Save Recipe</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onPrint}
              className="w-full"
            >
              <Printer className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
              <span className="sm:hidden">Print</span>
            </Button>
          </div>
        </div>

        {/* Debug JSON Section */}
        <div className="pt-2">
          <Collapsible>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center text-xs text-muted-foreground hover:text-foreground p-1"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  <Bug className="h-3 w-3 mr-1" />
                  {showDebug ? 'Hide' : 'Show'} Debug Info
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="mt-4 border rounded-md p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Raw Recipe JSON</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={copyJsonToClipboard}
                  >
                    Copy JSON
                  </Button>
                </div>
                <Separator className="my-2" />
                <pre className="text-xs overflow-auto bg-slate-100 p-2 rounded-md max-h-80">
                  {JSON.stringify(recipe, null, 2)}
                </pre>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p><strong>Metadata:</strong></p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Steps count: {recipe.steps.length}</li>
                    <li>Ingredients count: {recipe.ingredients.length}</li>
                    <li>Has cooking tip: {recipe.cookingTip ? 'Yes' : 'No'}</li>
                    <li>Recipe type: {recipe.cuisineType || 'Not specified'}</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
