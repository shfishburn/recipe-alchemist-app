
import { useMemo } from 'react';
import { Recipe, Ingredient } from '@/types/recipe';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useAnalysisContent } from '@/hooks/use-analysis-content';
import { getDepartmentForIngredient } from '@/utils/ingredient-department-utils';

/**
 * Processed recipe metadata for component consumption
 */
interface RecipeMetadata {
  hasInstructions: boolean;
  hasIngredients: boolean;
  hasNutrition: boolean;
  hasImage: boolean;
  cookTimeFormatted: string | null;
  prepTimeFormatted: string | null;
  totalTimeMinutes: number;
  totalTimeFormatted: string | null;
  servingsText: string;
}

/**
 * Centralized hook for accessing recipe data with computed properties
 */
export function useRecipeData(recipe: Recipe) {
  const { stepReactions, scienceNotes, hasAnalysisData } = useRecipeScience(recipe);
  
  // Format cooking and prep times once
  const metadata = useMemo<RecipeMetadata>(() => {
    // Format times
    const formatTime = (minutes: number | undefined): string | null => {
      if (!minutes) return null;
      
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
      return `${mins}m`;
    };
    
    // Calculate total time
    const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
    
    // Create servings text
    const servingsText = recipe.servings 
      ? `${recipe.servings} ${recipe.servings === 1 ? 'serving' : 'servings'}`
      : '1 serving';
    
    return {
      hasInstructions: recipe.instructions && recipe.instructions.length > 0,
      hasIngredients: recipe.ingredients && recipe.ingredients.length > 0,
      hasNutrition: !!recipe.nutrition && Object.keys(recipe.nutrition).length > 0,
      hasImage: !!recipe.image_url,
      cookTimeFormatted: formatTime(recipe.cook_time_min),
      prepTimeFormatted: formatTime(recipe.prep_time_min),
      totalTimeMinutes: totalTime,
      totalTimeFormatted: formatTime(totalTime),
      servingsText
    };
  }, [recipe]);
  
  // Group ingredients by department/category
  const ingredientsByDepartment = useMemo(() => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      return {};
    }
    
    return recipe.ingredients.reduce<Record<string, Ingredient[]>>((acc, ingredient) => {
      // Use utility function to get department instead of accessing property directly
      const department = getDepartmentForIngredient(
        typeof ingredient.item === 'string' ? ingredient.item : 'Unknown'
      );
      
      if (!acc[department]) {
        acc[department] = [];
      }
      
      acc[department].push(ingredient);
      return acc;
    }, {});
  }, [recipe.ingredients]);
  
  return {
    recipe,
    metadata,
    stepReactions,
    scienceNotes,
    hasAnalysisData,
    ingredientsByDepartment
  };
}
