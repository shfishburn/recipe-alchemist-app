
// Sample data for different macro distributions
export const macroDistributionData = [
  {
    title: "Balanced Macros",
    description: "Balanced macros for general health and wellbeing",
    data: [
      { name: 'Protein', value: 30, color: '#9b87f5' },
      { name: 'Carbs', value: 45, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "High Protein",
    description: "High protein for muscle building and strength training",
    data: [
      { name: 'Protein', value: 40, color: '#9b87f5' },
      { name: 'Carbs', value: 35, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "Endurance Focus",
    description: "Higher carbs for endurance activities and performance",
    data: [
      { name: 'Protein', value: 25, color: '#9b87f5' },
      { name: 'Carbs', value: 50, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "Specialized Diet",
    description: "Personalized nutrition based on your health needs",
    data: [
      { name: 'Protein', value: 35, color: '#9b87f5' },
      { name: 'Carbs', value: 40, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ],
    special: true
  }
];

// Sample data for carb distribution
export const carbsData = [
  { name: 'Complex Carbs', value: 65, color: '#4f46e5' },
  { name: 'Simple Carbs', value: 35, color: '#818cf8' }
];

// Sample data for fat distribution
export const fatsData = [
  { name: 'Unsaturated Fat', value: 70, color: '#86efac' },
  { name: 'Saturated Fat', value: 30, color: '#22c55e' }
];

// Sample data for NutriScore examples
export const nutriScoreExamples = [
  {
    title: "Excellent Nutrition (A)",
    description: "Recipes with high nutritional value, balanced macros, and abundant micronutrients",
    nutriScore: {
      grade: "A" as const,
      score: -2,
      negative_points: {
        total: 3,
        energy: 1,
        saturated_fat: 1,
        sugars: 0,
        sodium: 1
      },
      positive_points: {
        total: 5,
        fiber: 2,
        protein: 2,
        fruit_veg_nuts: 1
      }
    }
  },
  {
    title: "Good Nutrition (B)",
    description: "Well-balanced recipes with good nutritional profiles suitable for most diets",
    nutriScore: {
      grade: "B" as const,
      score: 2,
      negative_points: {
        total: 5,
        energy: 2,
        saturated_fat: 1,
        sugars: 1,
        sodium: 1
      },
      positive_points: {
        total: 3,
        fiber: 1,
        protein: 1,
        fruit_veg_nuts: 1
      }
    }
  },
  {
    title: "Average Nutrition (C)",
    description: "Recipes with moderate nutritional value that could benefit from small improvements",
    nutriScore: {
      grade: "C" as const,
      score: 7,
      negative_points: {
        total: 9,
        energy: 3,
        saturated_fat: 2,
        sugars: 2,
        sodium: 2
      },
      positive_points: {
        total: 2,
        fiber: 1,
        protein: 1,
        fruit_veg_nuts: 0
      }
    }
  }
];
