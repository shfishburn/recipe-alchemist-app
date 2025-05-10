
import { z } from "https://esm.sh/zod@3.21.4";

// Define the schema for recipe modifications using Zod
export const recipeModificationsSchema = z.object({
  modifications: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      action: z.enum(["add", "remove", "modify"]),
      originalIndex: z.number().optional(),
      item: z.string(),
      qty_metric: z.number().optional(),
      unit_metric: z.string().optional(),
      qty_imperial: z.number().optional(),
      unit_imperial: z.string().optional(),
      notes: z.string().optional(),
    })).optional(),
    steps: z.array(z.object({
      action: z.enum(["add", "remove", "modify"]),
      originalIndex: z.number().optional(),
      content: z.string(),
    })).optional(),
  }),
  nutritionImpact: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    summary: z.string(),
  }),
  reasoning: z.string(),
});

export type RecipeModifications = z.infer<typeof recipeModificationsSchema>;
