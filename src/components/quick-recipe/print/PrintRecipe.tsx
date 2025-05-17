
import React from 'react';
import type { QuickRecipe } from '@/types/quick-recipe';
import { DisplayIngredient } from '@/components/recipe-detail/DisplayIngredient';

interface PrintRecipeProps {
  recipe: QuickRecipe;
}

export function PrintRecipe({ recipe }: PrintRecipeProps) {
  return (
    <div className="p-10 max-w-3xl mx-auto bg-white">
      {/* Recipe header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        
        {recipe.tagline && (
          <p className="text-lg text-gray-600 italic mb-3">{recipe.tagline}</p>
        )}
        
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          {recipe.prep_time_min && <span>Prep: {recipe.prep_time_min} min</span>}
          {recipe.cook_time_min && <span>Cook: {recipe.cook_time_min} min</span>}
          <span>Servings: {recipe.servings}</span>
        </div>
      </div>

      {/* Recipe description */}
      {recipe.description && (
        <div className="mb-8">
          <p className="text-gray-700">{recipe.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <DisplayIngredient
                  qty={ingredient.qty || ingredient.qty_metric || 0}
                  unit={ingredient.unit || ingredient.unit_metric || ''}
                  item={ingredient.item}
                  notes={ingredient.notes}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Instructions</h2>
          <ol className="list-decimal pl-5 space-y-4">
            {(recipe.instructions || recipe.steps || []).map((step, index) => (
              <li key={index} className="pl-2">
                <p className="text-gray-800">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t text-center text-sm text-gray-500">
        <p>Recipe created with Recipe Alchemy</p>
        <p className="text-xs mt-1">Printed on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
