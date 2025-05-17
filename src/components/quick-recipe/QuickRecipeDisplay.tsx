
import React from 'react';
import { QuickRecipe } from '@/types/quick-recipe';

interface QuickRecipeDisplayProps {
  recipe: QuickRecipe;
  showTitle?: boolean;
}

export const QuickRecipeDisplay: React.FC<QuickRecipeDisplayProps> = ({ 
  recipe,
  showTitle = true
}) => {
  const instructions = recipe.instructions || recipe.steps || [];

  return (
    <div className="space-y-6 my-4">
      {showTitle && (
        <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
      )}
      
      {recipe.description && (
        <p className="text-gray-600 italic">{recipe.description}</p>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-2">Ingredients</h3>
        <ul className="space-y-1 list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => {
            const ingredientName = typeof ingredient.item === 'string' 
              ? ingredient.item 
              : ingredient.item.name;
            
            const quantity = ingredient.qty || ingredient.qty_metric || ingredient.qty_imperial || '';
            const unit = ingredient.unit || ingredient.unit_metric || ingredient.unit_imperial || '';
            
            return (
              <li key={index} className="text-gray-700">
                {quantity && unit ? `${quantity} ${unit} ` : ''}
                {ingredientName}
                {ingredient.notes && <span className="text-gray-500 text-sm"> ({ingredient.notes})</span>}
              </li>
            );
          })}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Instructions</h3>
        <ol className="space-y-2 list-decimal list-inside">
          {instructions.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>
      
      {recipe.science_notes && recipe.science_notes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Science Notes</h3>
          <ul className="space-y-1 list-disc list-inside bg-gray-50 p-3 rounded-md">
            {recipe.science_notes.map((note, index) => (
              <li key={index} className="text-gray-700">{note}</li>
            ))}
          </ul>
        </div>
      )}
      
      {recipe.cookingTip && (
        <div className="bg-blue-50 p-3 rounded-md">
          <h3 className="text-md font-medium mb-1">Chef's Tip</h3>
          <p className="text-gray-700">{recipe.cookingTip}</p>
        </div>
      )}
    </div>
  );
};
