
# Nutrition Analysis Prompts

The application uses multiple approaches for nutrition analysis:

## Nutrition Analysis Approaches

1. **Generated nutrition data** from the recipe generation system
2. **USDA food database lookups** for ingredient matching
3. **Nutrient retention factors** applied to cooking methods

## Nutrition Response Format

The nutrition data follows this structure:

```typescript
export interface Nutrition {
  // Basic nutrition (with both naming conventions)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // Aliases for backwards compatibility
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  cholesterol?: number;
  
  // Alternative naming for micronutrients (aliases)
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  
  // Enhanced nutrition data properties
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties?: Record<string, any>;
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  per_ingredient?: Record<string, any>;
  audit_log?: Record<string, any>;
  
  // Added for compatibility with standardized nutrition
  carbohydrates?: number;
}
```

## Data Flow

1. Recipe is generated with nutrition data
2. Nutrition data is normalized
3. Nutrition data is used in Nutri-Score calculation
4. Nutrition information is displayed to user

## Nutri-Score Calculation

The Nutri-Score system calculates a health score for recipes based on their nutritional content.

### Calculation Logic

The Nutri-Score is calculated using a database function:

```typescript
// From src/hooks/use-nutri-score.ts
const calculateNutriScore = async (): Promise<NutriScore | null> => {
  try {
    if (!recipe.nutrition) {
      throw new Error("No nutrition data available to calculate Nutri-Score");
    }
    
    // Call the Supabase database function to calculate the score
    const { data, error } = await supabase.rpc(
      'calculate_nutri_score',
      { 
        nutrition: recipe.nutrition as any,
        category: recipe.cuisine_category?.toLowerCase() || 'food',
        fruit_veg_nuts_percent: 0 // Default value, could be made dynamic
      }
    );
    
    if (error) throw error;
    
    return data as unknown as NutriScore;
  } catch (error) {
    console.error("Failed to calculate Nutri-Score:", error);
    return null;
  }
};
```

### Nutri-Score Response Format

```typescript
export interface NutriScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "E";
  negative_points: {
    energy: number;
    saturated_fat: number;
    sugars: number;
    sodium: number;
    total: number;
  };
  positive_points: {
    fiber: number;
    protein: number;
    fruit_veg_nuts: number;
    total: number;
  };
  category?: string;
  calculation_version?: string;
  calculated_at?: string;
}
```

## USDA Data Integration

The nutrition analysis system integrates with USDA food databases for accurate nutrition data:

1. **FDC SR Legacy R28** - Primary database for standard ingredients
2. **FNDDS 2019-20** - Fallback database for processed foods
3. **Food Yield Factors** - Applied to convert raw weights to cooked weights
4. **Nutrient Retention Factors R6** - Adjusts nutrient values based on cooking methods

## Related Files

- `src/hooks/use-nutri-score.ts` - Calculates Nutri-Score
- `src/components/recipe-detail/nutrition/NutriScoreSection.tsx` - Displays Nutri-Score
- `supabase/functions/nutrisynth-analysis/index.ts` - Advanced nutrition analysis
- `supabase/functions/nutrisynth-analysis/ingredient-helpers.ts` - Ingredient matching
