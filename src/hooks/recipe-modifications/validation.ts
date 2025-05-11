
import { RecipeModifications } from './types';

// Simple runtime schema validation
export const recipeModificationsSchema = {
  parse: (data: any): RecipeModifications => {
    if (!data || typeof data !== 'object') throw new Error('Invalid data format');
    if (!data.modifications || typeof data.modifications !== 'object') throw new Error('Missing modifications object');
    if (!data.nutritionImpact || typeof data.nutritionImpact !== 'object') throw new Error('Missing nutritionImpact object');
    if (!data.reasoning || typeof data.reasoning !== 'string') throw new Error('Missing reasoning string');
    return data as RecipeModifications;
  }
};
