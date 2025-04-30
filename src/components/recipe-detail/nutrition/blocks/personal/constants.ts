
// Define the types for our nutrient information
interface MacroNutrientInfo {
    name: string;
    description: string;
    caloriesPerGram: number;
}

interface MicroNutrientInfo {
    name: string;
    description: string;
    unit: string;
}

// Union type for all nutrient info types
type NutrientInfoType = MacroNutrientInfo | MicroNutrientInfo;

export const NUTRITION_COLORS = {
    protein: '#9b87f5', // purple
    carbs: '#0EA5E9',   // blue
    fat: '#22c55e',     // green
    calories: '#F97316', // orange
    fiber: '#65a30d'     // lime green
};

export const NUTRIENT_INFO: Record<string, NutrientInfoType> = {
    protein: {
        name: 'Protein',
        description: 'Essential for muscle repair and growth',
        caloriesPerGram: 4
    },
    carbs: {
        name: 'Carbohydrates',
        description: 'Primary energy source for the body',
        caloriesPerGram: 4
    },
    fat: {
        name: 'Fat',
        description: 'Important for hormone production and nutrient absorption',
        caloriesPerGram: 9
    },
    calories: {
        name: 'Calories',
        description: 'Total energy content of food',
        unit: 'kcal'
    },
    fiber: {
        name: 'Fiber',
        description: 'Adds bulk to your diet and helps with digestion',
        unit: 'g'
    },
    vitamin_a: {
        name: 'Vitamin A',
        description: 'Important for vision and immune function',
        unit: 'IU'
    },
    vitamin_c: {
        name: 'Vitamin C', 
        description: 'Helps with immune function and iron absorption',
        unit: 'mg'
    },
    vitamin_d: {
        name: 'Vitamin D',
        description: 'Essential for bone health and immune function',
        unit: 'IU'
    },
    calcium: {
        name: 'Calcium',
        description: 'Essential for bone health and muscle function',
        unit: 'mg'
    },
    iron: {
        name: 'Iron',
        description: 'Needed for oxygen transport in blood',
        unit: 'mg'
    },
    potassium: {
        name: 'Potassium',
        description: 'Helps regulate fluid balance and nerve signals',
        unit: 'mg'
    },
    sodium: {
        name: 'Sodium',
        description: 'Important for fluid balance, but limit intake',
        unit: 'mg'
    },
    sugar: {
        name: 'Sugar',
        description: 'Naturally occurring or added sweeteners',
        unit: 'g'
    }
};

// Type guard functions to check nutrient info types
export function isMacroNutrient(nutrient: NutrientInfoType): nutrient is MacroNutrientInfo {
    return 'caloriesPerGram' in nutrient;
}

export function isMicroNutrient(nutrient: NutrientInfoType): nutrient is MicroNutrientInfo {
    return 'unit' in nutrient;
}
