import { z } from "https://esm.sh/zod@3.22.4";

// Define the ingredient schema to match recipe generation
const ingredientSchema = z.object({
  qty_imperial: z.number(),
  unit_imperial: z.string(),
  qty_metric: z.number(),
  unit_metric: z.string(),
  shop_size_qty: z.number().optional(),
  shop_size_unit: z.string().optional(),
  item: z.string(),
  notes: z.string().optional()
});

// Define nutrition schema
const nutritionSchema = z.object({
  calories: z.union([z.number(), z.null()]).optional(),
  protein: z.union([z.number(), z.null()]).optional(),
  carbs: z.union([z.number(), z.null()]).optional(),
  fat: z.union([z.number(), z.null()]).optional(),
  fiber: z.union([z.number(), z.null()]).optional(),
  sugar: z.union([z.number(), z.null()]).optional(),
  sodium: z.union([z.number(), z.null()]).optional(),
  
  // Aliases for backward compatibility
  kcal: z.union([z.number(), z.null()]).optional(),
  protein_g: z.union([z.number(), z.null()]).optional(),
  carbs_g: z.union([z.number(), z.null()]).optional(),
  fat_g: z.union([z.number(), z.null()]).optional(),
  fiber_g: z.union([z.number(), z.null()]).optional(),
  sugar_g: z.union([z.number(), z.null()]).optional(),
  sodium_mg: z.union([z.number(), z.null()]).optional(),
  
  // Optional micronutrients
  vitamin_a: z.union([z.number(), z.null()]).optional(),
  vitamin_c: z.union([z.number(), z.null()]).optional(),
  vitamin_d: z.union([z.number(), z.null()]).optional(),
  calcium: z.union([z.number(), z.null()]).optional(),
  iron: z.union([z.number(), z.null()]).optional(),
  potassium: z.union([z.number(), z.null()]).optional(),
  
  // Data quality tracking
  data_quality: z.object({
    overall_confidence: z.enum(['high', 'medium', 'low']).optional(),
    overall_confidence_score: z.number().optional(),
    penalties: z.record(z.any()).optional(),
    unmatched_or_low_confidence_ingredients: z.array(z.string()).optional(),
    limitations: z.array(z.string()).optional()
  }).optional()
});

// Version info schema
export const versionInfoSchema = z.object({
  version_number: z.number(),
  parent_version_id: z.string().optional(),
  modification_reason: z.string()
});

// Define complete recipe schema that matches recipe generation
export const recipeSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  prep_time_min: z.number().optional(),
  cook_time_min: z.number().optional(),
  servings: z.number(),
  cuisine: z.string().optional(),
  cuisine_category: z.string().optional(),
  dietary: z.union([z.string(), z.array(z.string())]).optional(),
  flavor_tags: z.array(z.string()).optional(),
  nutrition: nutritionSchema.optional(),
  science_notes: z.array(z.string()).optional(),
  nutritionHighlight: z.string().optional(),
  cookingTip: z.string().optional(),
  tagline: z.string().optional(),
  image_url: z.string().optional(),
  user_id: z.string().optional(),
  slug: z.string().optional(),
  version_info: versionInfoSchema.optional(),
  version_id: z.string().optional()
});

// Define schema for nutrition impact assessment
export const nutritionImpactSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  fiber: z.number().optional(),
  sugar: z.number().optional(),
  sodium: z.number().optional(),
  assessment: z.string().optional(),
  summary: z.string().optional()
});

// Original modifications schema for backwards compatibility
const modificationsSchema = z.object({
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
});

// Define schema for recipe modifications
export const recipeModificationsSchema = z.object({
  textResponse: z.string(),
  reasoning: z.string(),
  // Complete recipe with modifications applied
  recipe: recipeSchema,
  // Keep original modifications for backward compatibility
  modifications: modificationsSchema.optional(),
  nutritionImpact: nutritionImpactSchema.optional()
});

export type RecipeModifications = z.infer<typeof recipeModificationsSchema>;
