
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, Printer, X } from 'lucide-react';
import { QuickRecipe, Ingredient } from '@/types/quick-recipe';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

// Helper function to format ingredient display text
const formatIngredient = (ingredient: Ingredient): string => {
  if (!ingredient) return '';

  const item = typeof ingredient.item === 'string' 
    ? ingredient.item 
    : ingredient.item && typeof ingredient.item === 'object' && 'name' in ingredient.item
      ? String(ingredient.item.name)
      : 'Unknown ingredient';
  
  // For metric display
  if (ingredient.qty_metric !== undefined && ingredient.unit_metric) {
    return `${ingredient.qty_metric}${ingredient.unit_metric} ${item}${ingredient.notes ? ` (${ingredient.notes})` : ''}`;
  }
  
  // For imperial display
  if (ingredient.qty_imperial !== undefined && ingredient.unit_imperial) {
    return `${ingredient.qty_imperial} ${ingredient.unit_imperial} ${item}${ingredient.notes ? ` (${ingredient.notes})` : ''}`;
  }
  
  // Fallback to generic quantity and unit
  if (ingredient.qty !== undefined && ingredient.unit) {
    return `${ingredient.qty} ${ingredient.unit} ${item}${ingredient.notes ? ` (${ingredient.notes})` : ''}`;
  }
  
  // Last resort, just show the item name
  return item;
};

interface QuickRecipePrintProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerPrint?: boolean;
}

export function QuickRecipePrint({ recipe, open, onOpenChange, triggerPrint = false }: QuickRecipePrintProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${recipe.title} Recipe`,
    onAfterPrint: () => {
      console.log('Recipe printed successfully');
    }
  });
  
  // If triggerPrint changes to true, automatically print
  React.useEffect(() => {
    if (triggerPrint && open) {
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  }, [triggerPrint, open, handlePrint]);
  
  if (!recipe) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex items-center justify-between">
          <div>
            <DialogTitle className="pr-8">Print Recipe</DialogTitle>
            <DialogDescription>
              Review and print your recipe
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div ref={printRef} className="p-6 print:p-0 print:max-w-full">
          {/* Recipe Header */}
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-center mb-2">{recipe.title}</h1>
            {recipe.tagline && (
              <p className="text-center text-gray-600 italic mb-4">{recipe.tagline}</p>
            )}
            
            {/* Recipe meta info */}
            <div className="flex justify-center gap-6 flex-wrap">
              {recipe.prepTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Prep: {recipe.prepTime} min</span>
                </div>
              )}
              
              {recipe.cookTime && (
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Cook: {recipe.cookTime} min</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="text-sm">Servings: {recipe.servings}</span>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className={cn(
            "grid gap-8",
            "print:grid-cols-2"
          )}>
            {/* Ingredients */}
            <div className="border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-800">
                    {formatIngredient(ingredient)}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div className="border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside space-y-3">
                {(recipe.instructions || recipe.steps || []).map((step, index) => (
                  <li key={index} className="text-gray-800">
                    <span className="ml-2">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Notes section */}
          {(recipe.cookingTip || recipe.science_notes?.length) && (
            <div className="mt-8 border-t pt-4">
              {recipe.cookingTip && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Cooking Tip</h3>
                  <p className="text-gray-700">{recipe.cookingTip}</p>
                </div>
              )}
              
              {recipe.science_notes && recipe.science_notes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Science Notes</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {recipe.science_notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-8 pt-4 text-center text-sm text-gray-500 print:fixed print:bottom-0 print:w-full">
            <p>Generated by Recipe Alchemy</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
