
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { useUnitSystemStore } from '@/stores/unitSystem';

interface PrintRecipeProps {
  recipe: Recipe;
}

export const PrintRecipe = forwardRef<HTMLButtonElement, PrintRecipeProps>(({ recipe }, ref) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const { unitSystem } = useUnitSystemStore();

  useImperativeHandle(ref, () => ({
    click: () => {
      if (dialogTriggerRef.current) {
        dialogTriggerRef.current.click();
      }
    }
  }) as any);

  // Format ingredient strings properly based on unit system
  const formatIngredient = (ingredient: any) => {
    // Handle different possible ingredient formats
    if (!ingredient) return '';
    
    // For unit system-aware formatting
    const qty = unitSystem === 'metric' 
      ? (ingredient.qty_metric !== undefined ? ingredient.qty_metric : ingredient.qty || 0) 
      : (ingredient.qty_imperial !== undefined ? ingredient.qty_imperial : ingredient.qty || 0);
      
    const unit = unitSystem === 'metric'
      ? (ingredient.unit_metric || ingredient.unit || '')
      : (ingredient.unit_imperial || ingredient.unit || '');
    
    const item = typeof ingredient.item === 'string' ? ingredient.item : 
                (ingredient.item ? JSON.stringify(ingredient.item) : '');
    
    const qtyStr = qty !== 0 ? `${qty} ` : '';
    const unitStr = unit ? `${unit} ` : '';
    
    return `${qtyStr}${unitStr}${item}`;
  };

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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap');
            
            /* Base styles */
            body {
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333333;
              background-color: #ffffff;
            }
            
            /* Logo */
            .logo-container {
              text-align: center;
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 1px solid #e5e5e5;
            }
            .logo {
              max-width: 180px;
              height: auto;
            }
            
            /* Typography */
            h1 { 
              font-size: 28px; 
              margin: 0 0 8px; 
              color: #222222;
              font-weight: 700;
              font-family: 'Inter', system-ui, sans-serif;
            }
            h2 { 
              font-size: 20px; 
              margin: 35px 0 15px; 
              color: #222222;
              font-weight: 600;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e5e5;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            /* Recipe Header */
            .recipe-header {
              margin-bottom: 30px;
              padding: 15px 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              border-left: 4px solid #4caf50;
            }
            .tagline { 
              font-style: italic; 
              color: #555555;
              margin: 0 0 15px; 
            }
            .compact-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              margin-top: 15px;
              font-size: 15px;
            }
            .meta-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-weight: 500;
            }
            .icon {
              font-weight: normal;
              color: #4caf50;
            }
            
            /* Two-column layout container */
            .two-column-layout {
              display: flex;
              gap: 30px;
              margin: 30px 0;
            }
            
            /* Ingredients */
            .ingredients { 
              flex: 1;
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              align-self: flex-start;
              min-width: 200px;
            }
            .ingredients h2 {
              margin-top: 0;
            }
            .ingredients ul { 
              padding-left: 20px; 
              list-style-type: disc;
              margin-bottom: 0;
            }
            .ingredients li { 
              margin-bottom: 10px; 
              line-height: 1.5;
            }
            
            /* Instructions */
            .instructions {
              flex: 1.8;
            }
            .instructions h2 {
              margin-top: 0;
            }
            .instructions ol { 
              padding-left: 25px;
              counter-reset: item;
              list-style-type: decimal;
              margin-bottom: 0;
            }
            .instructions li { 
              margin-bottom: 18px; 
              position: relative;
              line-height: 1.8;
              font-family: 'Merriweather', Georgia, serif;
            }
            .instructions .step-highlight {
              font-weight: 700;
            }
            
            /* Footer */
            .footer { 
              margin-top: 40px; 
              font-size: 12px; 
              color: #888888; 
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
            }
            
            /* Print-specific styles */
            @media print {
              body { 
                padding: 15px; 
                max-width: 100%;
                font-size: 11pt;
              }
              .recipe-header,
              .ingredients {
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                print-color-adjust: exact;
                border: 1px solid #e5e5e5;
              }
              .recipe-header {
                border-left: 4px solid #4caf50;
              }
              h2 { break-after: avoid; }
              .instructions li { break-inside: avoid; }
              
              /* Responsive layout adjustments */
              @media (max-width: 600px) {
                .two-column-layout {
                  flex-direction: column;
                }
              }
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

  // Determine if we should use a two-column layout based on recipe complexity
  const usesTwoColumnLayout = () => {
    // If ingredients are more than 5 or instructions are more than 4, use single column
    return !((recipe.ingredients && recipe.ingredients.length > 5) || 
             (recipe.instructions && recipe.instructions.length > 4));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button ref={dialogTriggerRef} id="print-recipe-trigger" className="hidden">Print Recipe</button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {/* Removed "Recipe Ready to Print" title */}
        </DialogHeader>
        
        <div ref={printContentRef} className="my-6 print:p-0">
          {/* Recipe Header - Compact layout */}
          <div className="recipe-header">
            <h1>{recipe.title}</h1>
            {recipe.tagline && <p className="tagline">{recipe.tagline}</p>}
            
            <div className="compact-meta">
              {recipe.servings && (
                <div className="meta-item">
                  <span className="icon">👥</span> Servings: {recipe.servings}
                </div>
              )}
              {recipe.prep_time_min && (
                <div className="meta-item">
                  <span className="icon">⏱</span> Prep: {recipe.prep_time_min} min
                </div>
              )}
              {recipe.cook_time_min && (
                <div className="meta-item">
                  <span className="icon">🍳</span> Cook: {recipe.cook_time_min} min
                </div>
              )}
              {recipe.prep_time_min && recipe.cook_time_min && (
                <div className="meta-item">
                  <span className="icon">⌛</span> Total: {recipe.prep_time_min + recipe.cook_time_min} min
                </div>
              )}
            </div>
          </div>
          
          {usesTwoColumnLayout() ? (
            // Two-column layout for shorter recipes
            <div className="two-column-layout">
              {/* Ingredients Column */}
              <div className="ingredients">
                <h2>Ingredients</h2>
                <ul>
                  {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {formatIngredient(ingredient)}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Instructions Column */}
              <div className="instructions">
                <h2>Instructions</h2>
                <ol>
                  {recipe.instructions && recipe.instructions.map((step, index) => {
                    // Bold any text in **asterisks** to highlight important parts
                    const highlightedStep = step.replace(/\*\*([^*]+)\*\*/g, '<span class="step-highlight">$1</span>');
                    
                    return (
                      <li key={index} dangerouslySetInnerHTML={{ __html: highlightedStep }} />
                    );
                  })}
                </ol>
              </div>
            </div>
          ) : (
            // Single-column layout for longer recipes
            <>
              {/* Ingredients Section */}
              <div className="ingredients">
                <h2>Ingredients</h2>
                <ul>
                  {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {formatIngredient(ingredient)}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Instructions Section */}
              <div className="instructions" style={{ marginTop: '30px' }}>
                <h2>Instructions</h2>
                <ol>
                  {recipe.instructions && recipe.instructions.map((step, index) => {
                    // Bold any text in **asterisks** to highlight important parts
                    const highlightedStep = step.replace(/\*\*([^*]+)\*\*/g, '<span class="step-highlight">$1</span>');
                    
                    return (
                      <li key={index} dangerouslySetInnerHTML={{ __html: highlightedStep }} />
                    );
                  })}
                </ol>
              </div>
            </>
          )}
          
          {recipe.cooking_tip && (
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <h2 className="mt-0 text-lg font-semibold">Chef's Tip</h2>
              <p>{recipe.cooking_tip}</p>
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
