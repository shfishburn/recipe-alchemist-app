
import { TableType } from "./database.ts";

// Define validation schemas for each table type
const validationSchemas = {
  [TableType.USDA_FOODS]: {
    required: ['food_code', 'food_name'],
    numeric: ['calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g', 'sugar_g', 'sodium_mg', 
              'vitamin_a_iu', 'vitamin_c_mg', 'vitamin_d_iu', 'calcium_mg', 'iron_mg', 'potassium_mg']
  },
  [TableType.UNIT_CONVERSIONS]: {
    required: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
    numeric: ['conversion_factor']
  },
  [TableType.YIELD_FACTORS]: {
    required: ['food_category', 'cooking_method', 'yield_factor'],
    numeric: ['yield_factor']
  }
};

// Function to validate data based on table type
export function validateData(data: any[], tableType: TableType): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schema = validationSchemas[tableType];
  
  if (!schema) {
    return { isValid: false, errors: [`No validation schema for table type: ${tableType}`] };
  }
  
  // Check for empty data
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data provided'] };
  }
  
  // Check each row against the schema
  data.forEach((row, rowIndex) => {
    // Check required fields
    schema.required.forEach(field => {
      if (row[field] === undefined || row[field] === null || row[field] === '') {
        errors.push(`Row ${rowIndex + 1}: Missing required field "${field}"`);
      }
    });
    
    // Check numeric fields
    schema.numeric.forEach(field => {
      if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
        if (isNaN(Number(row[field]))) {
          errors.push(`Row ${rowIndex + 1}: Field "${field}" must be numeric, found: "${row[field]}"`);
        }
      }
    });
  });
  
  return { isValid: errors.length === 0, errors };
}

// Function to normalize USDA food data
export function normalizeUsdaFoodData(row: any): Record<string, any> {
  return {
    food_code: String(row.food_code),
    food_name: String(row.food_name),
    food_category: row.food_category || null,
    calories: row.calories ? Number(row.calories) : null,
    protein_g: row.protein_g ? Number(row.protein_g) : null,
    carbs_g: row.carbs_g ? Number(row.carbs_g) : null,
    fat_g: row.fat_g ? Number(row.fat_g) : null,
    fiber_g: row.fiber_g ? Number(row.fiber_g) : null,
    sugar_g: row.sugar_g ? Number(row.sugar_g) : null,
    sodium_mg: row.sodium_mg ? Number(row.sodium_mg) : null,
    vitamin_a_iu: row.vitamin_a_iu ? Number(row.vitamin_a_iu) : null,
    vitamin_c_mg: row.vitamin_c_mg ? Number(row.vitamin_c_mg) : null,
    vitamin_d_iu: row.vitamin_d_iu ? Number(row.vitamin_d_iu) : null,
    calcium_mg: row.calcium_mg ? Number(row.calcium_mg) : null,
    iron_mg: row.iron_mg ? Number(row.iron_mg) : null,
    potassium_mg: row.potassium_mg ? Number(row.potassium_mg) : null
  };
}

// Function to normalize unit conversion data
export function normalizeUnitConversionData(row: any): Record<string, any> {
  return {
    food_category: String(row.food_category),
    from_unit: String(row.from_unit),
    to_unit: String(row.to_unit),
    conversion_factor: Number(row.conversion_factor),
    notes: row.notes || null
  };
}

// Function to normalize yield factor data
export function normalizeYieldFactorData(row: any): Record<string, any> {
  return {
    food_category: String(row.food_category),
    cooking_method: String(row.cooking_method),
    yield_factor: Number(row.yield_factor),
    description: row.description || null,
    source: row.source || null
  };
}
