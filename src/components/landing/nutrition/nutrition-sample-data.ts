
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

// Export the macroItems array for use in NutritionPreview
export const macroItems = macroDistributionData;

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
