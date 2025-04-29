
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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

  // Format ingredient strings properly
  const formatIngredient = (ingredient: { qty: number; unit: string; item: string }) => {
    const { qty, unit, item } = ingredient;
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
              list-style-type: none;
              margin-bottom: 0;
            }
            .instructions li { 
              margin-bottom: 18px; 
              position: relative;
              line-height: 1.8;
              font-family: 'Merriweather', Georgia, serif;
            }
            .instructions li::before {
              counter-increment: item;
              content: counter(item) ".";
              position: absolute;
              left: -25px;
              top: 0;
              font-weight: 700;
              color: #4caf50;
            }
            .instructions .step-highlight {
              font-weight: 700;
            }
            
            /* Nutrition */
            .nutrition { 
              margin: 35px 0;
              padding: 20px;
              background-color: #f5f5f5;
              border-radius: 8px; 
            }
            .nutrition h2 {
              margin-top: 0;
              border-bottom-color: #e0e0e0;
            }
            .nutrition-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
              gap: 15px;
            }
            .nutrition-item {
              padding: 10px;
              background: #ffffff;
              border-radius: 6px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .nutrition-label {
              font-size: 13px;
              color: #666;
              display: block;
            }
            .nutrition-value {
              font-size: 16px;
              font-weight: 600;
              color: #333;
              display: block;
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
              .ingredients,
              .nutrition {
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
              .nutrition-item {
                background-color: #f9f9f9 !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                print-color-adjust: exact;
              }
              
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
          <DialogTitle>Recipe Ready to Print</DialogTitle>
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
          
          {/* Nutrition Section */}
          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <div className="nutrition">
              <h2>Nutrition (per serving)</h2>
              <div className="nutrition-grid">
                {recipe.nutrition.kcal !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories</span>
                    <span className="nutrition-value">{recipe.nutrition.kcal} kcal</span>
                  </div>
                )}
                {recipe.nutrition.protein_g !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein</span>
                    <span className="nutrition-value">{recipe.nutrition.protein_g}g</span>
                  </div>
                )}
                {recipe.nutrition.carbs_g !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carbs</span>
                    <span className="nutrition-value">{recipe.nutrition.carbs_g}g</span>
                  </div>
                )}
                {recipe.nutrition.fat_g !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fat</span>
                    <span className="nutrition-value">{recipe.nutrition.fat_g}g</span>
                  </div>
                )}
                {recipe.nutrition.fiber_g !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fiber</span>
                    <span className="nutrition-value">{recipe.nutrition.fiber_g}g</span>
                  </div>
                )}
                {recipe.nutrition.sugar_g !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Sugar</span>
                    <span className="nutrition-value">{recipe.nutrition.sugar_g}g</span>
                  </div>
                )}
                {recipe.nutrition.sodium_mg !== undefined && (
                  <div className="nutrition-item">
                    <span className="nutrition-label">Sodium</span>
                    <span className="nutrition-value">{recipe.nutrition.sodium_mg}mg</span>
                  </div>
                )}
              </div>
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
