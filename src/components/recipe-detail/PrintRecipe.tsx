
import React, { useRef } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface PrintRecipeProps {
  recipe: Recipe;
}

export function PrintRecipe({ recipe }: PrintRecipeProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !printContentRef.current) return;
    
    const content = printContentRef.current.innerHTML;
    const recipeTitle = recipe.title || 'Recipe';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print: ${recipeTitle}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.5;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin: 20px 0 10px; }
            .header { margin-bottom: 30px; }
            .tagline { font-style: italic; color: #555; margin-bottom: 15px; }
            .meta { display: flex; gap: 20px; margin-bottom: 20px; font-size: 14px; color: #555; }
            .ingredients { margin-bottom: 30px; }
            .ingredients ul { padding-left: 20px; }
            .ingredients li { margin-bottom: 8px; }
            .instructions ol { padding-left: 20px; }
            .instructions li { margin-bottom: 15px; }
            .nutrition-info { border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; }
            .nutrition-info table { width: 100%; border-collapse: collapse; }
            .nutrition-info td { padding: 3px 0; }
            .nutrition-info td:last-child { text-align: right; }
            .footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
            @media print {
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            <p>Recipe from Your Recipe App</p>
          </div>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted hover:text-foreground">
          <Printer className="mr-2 h-4 w-4" />
          Print recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
          <DialogDescription>
            Preview how your recipe will look when printed
          </DialogDescription>
        </DialogHeader>
        
        <div ref={printContentRef} className="my-6 print:p-0">
          <div className="header">
            <h1>{recipe.title}</h1>
            {recipe.tagline && <p className="tagline">{recipe.tagline}</p>}
            
            <div className="meta">
              {recipe.servings && <div>Servings: {recipe.servings}</div>}
              {recipe.prep_time_min && <div>Prep: {recipe.prep_time_min} min</div>}
              {recipe.cook_time_min && <div>Cook: {recipe.cook_time_min} min</div>}
              {recipe.prep_time_min && recipe.cook_time_min && (
                <div>Total: {recipe.prep_time_min + recipe.cook_time_min} min</div>
              )}
            </div>
          </div>
          
          <div className="ingredients">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.qty} {ingredient.unit} {ingredient.item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="instructions">
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions && recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <div className="nutrition-info">
              <h2>Nutrition (per serving)</h2>
              <table>
                <tbody>
                  {recipe.nutrition.kcal !== undefined && (
                    <tr><td>Calories:</td><td>{recipe.nutrition.kcal} kcal</td></tr>
                  )}
                  {recipe.nutrition.protein_g !== undefined && (
                    <tr><td>Protein:</td><td>{recipe.nutrition.protein_g}g</td></tr>
                  )}
                  {recipe.nutrition.carbs_g !== undefined && (
                    <tr><td>Carbs:</td><td>{recipe.nutrition.carbs_g}g</td></tr>
                  )}
                  {recipe.nutrition.fat_g !== undefined && (
                    <tr><td>Fat:</td><td>{recipe.nutrition.fat_g}g</td></tr>
                  )}
                  {recipe.nutrition.fiber_g !== undefined && (
                    <tr><td>Fiber:</td><td>{recipe.nutrition.fiber_g}g</td></tr>
                  )}
                  {recipe.nutrition.sugar_g !== undefined && (
                    <tr><td>Sugar:</td><td>{recipe.nutrition.sugar_g}g</td></tr>
                  )}
                  {recipe.nutrition.sodium_mg !== undefined && (
                    <tr><td>Sodium:</td><td>{recipe.nutrition.sodium_mg}mg</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handlePrint} className="print-button">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
