
import { Recipe, Ingredient, Nutrition } from "@/types/recipe";

// Define interfaces for fusion system
export interface NutrientValue {
  nutrient: string;
  value: number;
  unit: string;
  confidence_score: number;
}

export interface FuseNutritionRequest {
  ingredient_text: string;
  alt_source_values?: NutrientValue[];
  cooking_method?: string;
  override_existing?: boolean;
}

export interface FusedNutrient {
  nutrient: string;
  fusedValue: number;
  unit: string;
  confidence: number;
  sources: string[];
}

export interface FuseNutritionResponse {
  canonical_ingredient?: {
    id: string;
    name: string;
    similarity_score: number;
  };
  fused: FusedNutrient[];
  overall_confidence: number;
  source_count: number;
  metadata?: Record<string, any>;
}

export type { Recipe, Ingredient, Nutrition };
