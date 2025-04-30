
import { UsdaTableType } from '@/utils/usda-data-import';

// Required columns for validation by table type
export const REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name'],
  [UsdaTableType.UNIT_CONVERSIONS]: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
  [UsdaTableType.YIELD_FACTORS]: ['food_category', 'cooking_method', 'yield_factor']
};

// SR28 columns mapping
export const SR28_REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name']
};
