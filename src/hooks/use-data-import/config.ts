
import { UsdaTableType } from '@/utils/usda-data-import';

// Required columns for validation by table type
export const REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name'],
  [UsdaTableType.UNIT_CONVERSIONS]: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
  [UsdaTableType.YIELD_FACTORS]: ['food_category', 'cooking_method', 'yield_factor'],
  // USDA Raw tables
  [UsdaTableType.RAW_FOOD]: ['fdc_id', 'description'],
  [UsdaTableType.RAW_MEASURE_UNIT]: ['id', 'name'],
  [UsdaTableType.RAW_FOOD_PORTIONS]: ['id', 'fdc_id', 'measure_unit_id', 'gram_weight'],
  [UsdaTableType.RAW_YIELD_FACTORS]: ['food_category', 'ingredient', 'cooking_method', 'yield_factor']
};

// SR28 columns mapping
export const SR28_REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name']
};

// USDA raw file format validation
export const USDA_FILE_FORMATS = {
  [UsdaTableType.RAW_FOOD]: { 
    name: 'Food.csv', 
    description: 'Contains food descriptions and IDs' 
  },
  [UsdaTableType.RAW_MEASURE_UNIT]: { 
    name: 'MeasureUnit.csv', 
    description: 'Contains household unit names' 
  },
  [UsdaTableType.RAW_FOOD_PORTIONS]: { 
    name: 'FoodPortions.csv', 
    description: 'Contains portion weights' 
  },
  [UsdaTableType.RAW_YIELD_FACTORS]: { 
    name: 'yield_factors.csv', 
    description: 'Contains cooking yield factors' 
  }
};
