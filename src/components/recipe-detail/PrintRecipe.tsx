
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
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

export const PrintRecipe = forwardRef<HTMLButtonElement, PrintRecipeProps>(({ recipe }, ref) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      if (dialogTriggerRef.current) {
        dialogTriggerRef.current.click();
      }
    }
  }) as any);

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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333333;
            }
            .logo-container {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eaeaea;
            }
            .logo {
              max-width: 180px;
              height: auto;
            }
            h1 { 
              font-size: 28px; 
              margin-bottom: 8px; 
              color: #222222;
              font-weight: 700;
            }
            h2 { 
              font-size: 20px; 
              margin: 25px 0 10px; 
              color: #333333;
              font-weight: 600;
              padding-bottom: 8px;
              border-bottom: 1px solid #eaeaea;
            }
            .header { 
              margin-bottom: 30px; 
              background-color: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
            }
            .tagline { 
              font-style: italic; 
              color: #666666; 
              margin-bottom: 15px; 
            }
            .meta { 
              display: flex; 
              flex-wrap: wrap;
              gap: 20px; 
              margin: 20px 0; 
              font-size: 14px; 
              color: #555555; 
              background-color: #f1f0fb;
              padding: 15px;
              border-radius: 6px;
            }
            .meta div {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .time-icon::before {
              content: "⏱";
              margin-right: 5px;
            }
            .servings-icon::before {
              content: "👥";
              margin-right: 5px;
            }
            .ingredients { 
              margin-bottom: 30px;
              background-color: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
            }
            .ingredients ul { 
              padding-left: 20px; 
              list-style-type: circle;
            }
            .ingredients li { 
              margin-bottom: 10px; 
              padding-left: 5px;
            }
            .instructions ol { 
              padding-left: 25px; 
            }
            .instructions li { 
              margin-bottom: 18px; 
              padding-left: 5px;
            }
            .nutrition-info { 
              border-top: 1px solid #eaeaea; 
              margin-top: 35px; 
              padding-top: 20px; 
            }
            .nutrition-info table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
            }
            .nutrition-info td { 
              padding: 8px 0; 
              border-bottom: 1px solid #f0f0f0;
            }
            .nutrition-info td:last-child { 
              text-align: right; 
              font-weight: 500;
            }
            .footer { 
              margin-top: 40px; 
              font-size: 12px; 
              color: #888888; 
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eaeaea;
            }
            @media print {
              .print-button { display: none; }
              body { padding: 0; margin: 0; }
              .header { break-inside: avoid; }
              .ingredients { break-inside: avoid; }
              h2 { break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="logo-container">
            <img src="/lovable-uploads/recipe-alchemy-logo.png" alt="Recipe Alchemy" class="logo" />
          </div>
          ${content}
          <div class="footer">
            <p>Recipe created with Recipe Alchemy | Printed on ${new Date().toLocaleDateString()}</p>
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
        <button ref={dialogTriggerRef} id="print-recipe-trigger" className="hidden">Print Recipe</button>
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
              {recipe.servings && <div className="servings-icon">Servings: {recipe.servings}</div>}
              {recipe.prep_time_min && <div className="time-icon">Prep: {recipe.prep_time_min} min</div>}
              {recipe.cook_time_min && <div className="time-icon">Cook: {recipe.cook_time_min} min</div>}
              {recipe.prep_time_min && recipe.cook_time_min && (
                <div className="time-icon">Total: {recipe.prep_time_min + recipe.cook_time_min} min</div>
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
});

PrintRecipe.displayName = 'PrintRecipe';

