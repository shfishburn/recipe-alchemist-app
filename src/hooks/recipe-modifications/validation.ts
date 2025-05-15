
import { z } from 'zod';
import { QuickRecipe } from '@/types/quick-recipe';

// Define schema for nutrition impact assessment
const nutritionImpactSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
  sodium: z.number().optional(),
  assessment: z.string().optional()
});

// Define schema for recipe modifications
export const recipeModificationsSchema = z.object({
  textResponse: z.string(),
  reasoning: z.string(),
  modifications: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      original: z.string().optional(),
      modified: z.string(),
      reason: z.string().optional()
    })).optional(),
    steps: z.array(z.object({
      original: z.string().optional(),
      modified: z.string(),
      reason: z.string().optional()
    })).optional(),
    cookingTip: z.string().optional(),
  }),
  nutritionImpact: nutritionImpactSchema.optional(),
  // Add support for the full modified recipe
  modifiedRecipe: z.custom<QuickRecipe>().nullable().optional()
});

export type RecipeModifications = z.infer<typeof recipeModificationsSchema>;
