
import { formatRequestBody, processCuisineValue, processDietaryValue, getCuisineCategory } from '../format-utils';
import { QuickRecipeFormData } from '@/types/quick-recipe';

describe('Format Utils', () => {
  describe('getCuisineCategory', () => {
    it('should return correct category for each cuisine type', () => {
      expect(getCuisineCategory('mexican')).toBe('Regional American');
      expect(getCuisineCategory('italian')).toBe('European');
      expect(getCuisineCategory('chinese')).toBe('Asian');
      expect(getCuisineCategory('middle-eastern')).toBe('Middle Eastern');
      expect(getCuisineCategory('gluten-free')).toBe('Dietary Styles');
      expect(getCuisineCategory('american')).toBe('Global');
    });

    it('should default to Global for null or invalid values', () => {
      expect(getCuisineCategory('')).toBe('Global');
      expect(getCuisineCategory(null as any)).toBe('Global');
      expect(getCuisineCategory('invalid-cuisine')).toBe('Global');
    });
  });

  describe('processCuisineValue', () => {
    it('should handle string input values', () => {
      expect(processCuisineValue('italian')).toBe('italian');
      expect(processCuisineValue('ANY')).toBe('any');
      expect(processCuisineValue('  Mexican  ')).toBe('mexican');
    });

    it('should handle array input values', () => {
      expect(processCuisineValue(['italian', 'french'])).toBe('italian');
      expect(processCuisineValue(['  Mexican  '])).toBe('mexican');
      expect(processCuisineValue([])).toBe('any');
    });

    it('should handle null or undefined input', () => {
      expect(processCuisineValue(null as any)).toBe('any');
      expect(processCuisineValue(undefined as any)).toBe('any');
    });
  });

  describe('processDietaryValue', () => {
    it('should handle string input values', () => {
      expect(processDietaryValue('vegetarian')).toBe('vegetarian');
      expect(processDietaryValue('ANY')).toBe('');
      expect(processDietaryValue('  vegan  ')).toBe('vegan');
    });

    it('should handle array input values', () => {
      expect(processDietaryValue(['vegetarian', 'gluten-free'])).toBe('vegetarian, gluten-free');
      expect(processDietaryValue(['  vegan  '])).toBe('vegan');
      expect(processDietaryValue([])).toBe('');
    });

    it('should handle null or undefined input', () => {
      expect(processDietaryValue(null as any)).toBe('');
      expect(processDietaryValue(undefined as any)).toBe('');
    });
  });

  describe('formatRequestBody', () => {
    it('should format request body with string inputs', () => {
      const formData: QuickRecipeFormData = {
        cuisine: 'italian',
        dietary: 'vegetarian',
        mainIngredient: 'tomato',
        servings: 4
      };

      const result = formatRequestBody(formData);

      expect(result).toEqual({
        cuisine: 'italian',
        dietary: 'vegetarian',
        mainIngredient: 'tomato',
        servings: 4,
        cuisineCategory: 'European'
      });
    });

    it('should format request body with array inputs', () => {
      const formData: QuickRecipeFormData = {
        cuisine: ['french', 'italian'],
        dietary: ['vegetarian', 'gluten-free'],
        mainIngredient: 'mushrooms',
        servings: 2
      };

      const result = formatRequestBody(formData);

      expect(result).toEqual({
        cuisine: 'french',
        dietary: 'vegetarian, gluten-free',
        mainIngredient: 'mushrooms',
        servings: 2,
        cuisineCategory: 'European'
      });
    });

    it('should handle empty dietary values properly', () => {
      const formData: QuickRecipeFormData = {
        cuisine: 'any',
        dietary: 'any',
        mainIngredient: 'chicken',
        servings: 2
      };

      const result = formatRequestBody(formData);

      expect(result).toEqual({
        cuisine: 'any',
        dietary: '',
        mainIngredient: 'chicken',
        servings: 2,
        cuisineCategory: 'Global'
      });
    });

    it('should handle maxCalories when provided', () => {
      const formData: QuickRecipeFormData = {
        cuisine: 'any',
        dietary: '',
        mainIngredient: 'beef',
        servings: 4,
        maxCalories: 500
      };

      const result = formatRequestBody(formData);

      expect(result).toEqual({
        cuisine: 'any',
        dietary: '',
        mainIngredient: 'beef',
        servings: 4,
        maxCalories: 500,
        cuisineCategory: 'Global'
      });
    });
  });
});
