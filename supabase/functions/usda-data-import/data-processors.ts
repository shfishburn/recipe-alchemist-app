import { TableType } from "./database.ts";

// Define validation schemas for each table type
const validationSchemas = {
  [TableType.USDA_FOODS]: {
    required: ['food_code', 'food_name'],
    numeric: ['calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g', 'sugar_g', 'sodium_mg', 
              'vitamin_a_iu', 'vitamin_c_mg', 'vitamin_d_iu', 'calcium_mg', 'iron_mg', 'potassium_mg',
              'cholesterol_mg', 'gmwt_1', 'gmwt_2']
  },
  [TableType.UNIT_CONVERSIONS]: {
    required: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
    numeric: ['conversion_factor']
  },
  [TableType.YIELD_FACTORS]: {
    required: ['food_category', 'cooking_method', 'yield_factor'],
    numeric: ['yield_factor']
  },
  // USDA Raw tables
  ['usda_raw.food']: {
    required: ['fdc_id', 'description'],
    numeric: ['fdc_id']
  },
  ['usda_raw.measure_unit']: {
    required: ['id', 'name'],
    numeric: ['id']
  },
  ['usda_raw.food_portions']: {
    required: ['id', 'fdc_id', 'measure_unit_id', 'gram_weight'],
    numeric: ['id', 'fdc_id', 'measure_unit_id', 'gram_weight', 'amount']
  },
  ['usda_raw.yield_factors']: {
    required: ['food_category', 'ingredient', 'cooking_method', 'yield_factor'],
    numeric: ['yield_factor']
  }
};

// SR28 column mappings to our database columns - updated for your format
export const sr28Mappings = {
  food_code: 'food_code',
  food_name: 'food_name',
  calories: 'calories',
  protein_g: 'protein_(g)',
  carbs_g: 'carbs_g',
  fat_g: 'fat_g',
  fiber_g: 'fiber_g',
  sugar_g: 'sugar_g',
  sodium_mg: 'sodium_mg',
  vitamin_a_iu: 'vit_a_iu',
  vitamin_c_mg: 'vit_c_(mg)',
  vitamin_d_iu: 'vit_d_iu',
  calcium_mg: 'calcium_(mg)',
  iron_mg: 'iron_(mg)',
  potassium_mg: 'potassium_(mg)',
  cholesterol_mg: 'cholesterol_mg',
  gmwt_1: 'GmWt_1',
  gmwt_desc1: 'GmWt_Desc1', 
  gmwt_2: 'GmWt_2',
  gmwt_desc2: 'GmWt_Desc2'
};

// Function to check if the CSV is in SR28 format
export function isSR28Format(headers: string[]): boolean {
  // SR28 key columns - updated for your format
  const sr28KeyColumns = ['food_code', 'food_name', 'calories', 'protein_(g)', 'fat_g'];
  const matchCount = sr28KeyColumns.filter(col => headers.includes(col)).length;
  return matchCount >= 3 && headers.includes('food_code');
}

// Function to check if the CSV is in USDA raw format
export function isUSDAFormat(headers: string[]): boolean {
  // USDA key columns
  const usdaKeyColumns = ['fdc_id', 'id', 'publication_date', 'gram_weight', 'measure_unit_id'];
  const matchCount = usdaKeyColumns.filter(col => headers.includes(col)).length;
  return matchCount >= 2;
}

// Function to validate data based on table type
export function validateData(data: any[], tableType: TableType | string, isSR28 = false, isUSDA = false): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schema = validationSchemas[tableType as keyof typeof validationSchemas];
  
  if (!schema) {
    return { isValid: false, errors: [`No validation schema for table type: ${tableType}`] };
  }
  
  // Check for empty data
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data provided'] };
  }
  
  // Check each row against the schema
  data.forEach((row, rowIndex) => {
    // For SR28 format, we need to map column names
    const mappedRow = isSR28 ? mapSR28ToStandardFormat(row) : row;
    
    // Check required fields
    schema.required.forEach(field => {
      if (mappedRow[field] === undefined || mappedRow[field] === null || mappedRow[field] === '') {
        errors.push(`Row ${rowIndex + 1}: Missing required field "${field}"`);
      }
    });
    
    // Check numeric fields
    schema.numeric.forEach(field => {
      if (mappedRow[field] !== undefined && mappedRow[field] !== null && mappedRow[field] !== '') {
        if (isNaN(Number(mappedRow[field]))) {
          errors.push(`Row ${rowIndex + 1}: Field "${field}" must be numeric, found: "${mappedRow[field]}"`);
        }
      }
    });
  });
  
  return { isValid: errors.length === 0, errors };
}

// Function to map SR28 format to our standard format
export function mapSR28ToStandardFormat(row: any): Record<string, any> {
  const mappedRow: Record<string, any> = {};
  
  for (const [ourField, sr28Field] of Object.entries(sr28Mappings)) {
    if (row[sr28Field] !== undefined) {
      mappedRow[ourField] = row[sr28Field];
    }
  }
  
  // Additional mappings 
  if (row['food_code']) mappedRow.food_code = row['food_code'];
  if (row['food_name']) mappedRow.food_name = row['food_name'];
  if (row['food_name']) mappedRow.food_category = extractFoodCategory(row['food_name']);
  
  return mappedRow;
}

// Helper function to extract a basic food category from the description
function extractFoodCategory(desc: string): string {
  if (!desc) return 'other';
  
  const desc_upper = desc.toUpperCase();
  if (desc_upper.includes('BEEF')) return 'beef';
  if (desc_upper.includes('PORK')) return 'pork';
  if (desc_upper.includes('CHICKEN')) return 'poultry';
  if (desc_upper.includes('TURKEY')) return 'poultry';
  if (desc_upper.includes('FISH')) return 'seafood';
  if (desc_upper.includes('SEAFOOD')) return 'seafood';
  if (desc_upper.includes('VEGETABLE')) return 'vegetables';
  if (desc_upper.includes('FRUIT')) return 'fruits';
  if (desc_upper.includes('DAIRY')) return 'dairy';
  if (desc_upper.includes('MILK')) return 'dairy';
  if (desc_upper.includes('CHEESE')) return 'dairy';
  if (desc_upper.includes('BREAD')) return 'grains';
  if (desc_upper.includes('CEREAL')) return 'grains';
  if (desc_upper.includes('RICE')) return 'grains';
  if (desc_upper.includes('PASTA')) return 'grains';
  if (desc_upper.includes('NUTS')) return 'nuts-seeds';
  if (desc_upper.includes('SEED')) return 'nuts-seeds';
  return 'other';
}

// Function to normalize USDA food data - updated with new fields
export function normalizeUsdaFoodData(row: any, isSR28 = false): Record<string, any> {
  const mappedRow = isSR28 ? mapSR28ToStandardFormat(row) : row;
  
  return {
    food_code: String(mappedRow.food_code),
    food_name: String(mappedRow.food_name),
    food_category: mappedRow.food_category || extractFoodCategory(mappedRow.food_name),
    calories: mappedRow.calories ? Number(mappedRow.calories) : null,
    protein_g: mappedRow.protein_g ? Number(mappedRow.protein_g) : null,
    carbs_g: mappedRow.carbs_g ? Number(mappedRow.carbs_g) : null,
    fat_g: mappedRow.fat_g ? Number(mappedRow.fat_g) : null,
    fiber_g: mappedRow.fiber_g ? Number(mappedRow.fiber_g) : null,
    sugar_g: mappedRow.sugar_g ? Number(mappedRow.sugar_g) : null,
    sodium_mg: mappedRow.sodium_mg ? Number(mappedRow.sodium_mg) : null,
    vitamin_a_iu: mappedRow.vitamin_a_iu ? Number(mappedRow.vitamin_a_iu) : null,
    vitamin_c_mg: mappedRow.vitamin_c_mg ? Number(mappedRow.vitamin_c_mg) : null,
    vitamin_d_iu: mappedRow.vitamin_d_iu ? Number(mappedRow.vitamin_d_iu) : null,
    calcium_mg: mappedRow.calcium_mg ? Number(mappedRow.calcium_mg) : null,
    iron_mg: mappedRow.iron_mg ? Number(mappedRow.iron_mg) : null,
    potassium_mg: mappedRow.potassium_mg ? Number(mappedRow.potassium_mg) : null,
    cholesterol_mg: mappedRow.cholesterol_mg ? Number(mappedRow.cholesterol_mg) : null,
    gmwt_1: mappedRow.gmwt_1 ? Number(mappedRow.gmwt_1) : null,
    gmwt_desc1: mappedRow.gmwt_desc1 || null,
    gmwt_2: mappedRow.gmwt_2 ? Number(mappedRow.gmwt_2) : null,
    gmwt_desc2: mappedRow.gmwt_desc2 || null
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

// Function to normalize USDA raw food data
export function normalizeUsdaRawFoodData(row: any): Record<string, any> {
  return {
    fdc_id: String(row.fdc_id),
    description: String(row.description),
    publication_date: row.publication_date || null
  };
}

// Function to normalize USDA raw measure unit data
export function normalizeUsdaRawMeasureUnitData(row: any): Record<string, any> {
  return {
    id: String(row.id),
    name: String(row.name)
  };
}

// Function to normalize USDA raw food portions data
export function normalizeUsdaRawFoodPortionsData(row: any): Record<string, any> {
  return {
    id: String(row.id),
    fdc_id: String(row.fdc_id),
    amount: row.amount ? Number(row.amount) : null,
    measure_unit_id: String(row.measure_unit_id),
    modifier: row.modifier || null,
    portion_description: row.portion_description || null,
    gram_weight: row.gram_weight ? Number(row.gram_weight) : null
  };
}

// Function to normalize USDA raw yield factors data
export function normalizeUsdaRawYieldFactorsData(row: any): Record<string, any> {
  return {
    food_category: String(row.food_category),
    ingredient: String(row.ingredient),
    cooking_method: String(row.cooking_method),
    yield_factor: Number(row.yield_factor),
    description: row.description || null,
    source: row.source || null
  };
}
