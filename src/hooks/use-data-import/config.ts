
import { UsdaTableType } from "@/utils/usda-data-import";

export const REQUIRED_COLUMNS: Record<string, string[]> = {
  [UsdaTableType.USDA_FOODS]: ['fdc_id', 'description', 'publication_date'],
  [UsdaTableType.FOOD_PORTIONS]: ['id', 'fdc_id', 'amount', 'measure_unit_id', 'gram_weight'],
  [UsdaTableType.MEASURE_UNITS]: ['id', 'name'],
  [UsdaTableType.YIELD_FACTORS]: ['food_category', 'ingredient', 'cooking_method', 'yield_factor']
};

export const USDA_FILE_FORMATS: Record<string, { name: string, description: string }> = {
  [UsdaTableType.USDA_FOODS]: { 
    name: 'food.csv', 
    description: 'USDA Foods'
  },
  [UsdaTableType.FOOD_PORTIONS]: { 
    name: 'food_portion.csv', 
    description: 'Food Portions'
  },
  [UsdaTableType.MEASURE_UNITS]: { 
    name: 'measure_unit.csv', 
    description: 'Measurement Units'
  },
  [UsdaTableType.YIELD_FACTORS]: { 
    name: 'cooking_yields.csv', 
    description: 'Cooking Yield Factors'
  }
};
