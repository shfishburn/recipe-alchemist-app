
export const NUTRITION_COLORS = {
  protein: '#9b87f5',  // Purple for protein
  carbs: '#1EAEDB',    // Bright blue for carbs
  fat: '#22c55e',      // Green for fat
  calories: '#F97316'  // Orange for calories
} as const;

export const NUTRIENT_INFO = {
  protein: {
    name: 'Protein',
    description: 'Important for muscle maintenance and growth',
    energyPerGram: 4, // calories per gram
    unit: 'g',
  },
  carbs: {
    name: 'Carbohydrates',
    description: 'Primary energy source for your body',
    energyPerGram: 4, // calories per gram
    unit: 'g',
  },
  fat: {
    name: 'Fat',
    description: 'Essential for hormone production and nutrient absorption',
    energyPerGram: 9, // calories per gram
    unit: 'g',
  },
  calories: {
    name: 'Calories',
    description: 'Total energy content of the recipe',
    unit: 'kcal',
  }
} as const;
