
export const sampleMicronutrientsData = {
  vitamins: {
    title: "Vitamins",
    items: [
      {
        name: "Vitamin A",
        value: "750 μg",
        percentage: "83%",
        color: "#4CAF50"
      },
      {
        name: "Vitamin C",
        value: "45 mg",
        percentage: "50%",
        color: "#FFC107"
      },
      {
        name: "Vitamin D",
        value: "5 μg",
        percentage: "25%",
        color: "#FF9800"
      },
      {
        name: "Vitamin E",
        value: "15 mg",
        percentage: "100%",
        color: "#4CAF50"
      }
    ]
  },
  minerals: {
    title: "Minerals",
    items: [
      {
        name: "Calcium",
        value: "300 mg",
        percentage: "30%",
        color: "#FF9800"
      },
      {
        name: "Iron",
        value: "8 mg",
        percentage: "45%",
        color: "#FFC107"
      },
      {
        name: "Magnesium",
        value: "120 mg",
        percentage: "30%",
        color: "#FF9800"
      },
      {
        name: "Zinc",
        value: "5 mg",
        percentage: "45%",
        color: "#FFC107"
      }
    ]
  }
};

// Add missing carbsData export
export const carbsData = [
  { name: "Complex Carbs", value: 70, color: "#8bc34a" },
  { name: "Simple Carbs", value: 20, color: "#cddc39" },
  { name: "Fiber", value: 10, color: "#4caf50" }
];

// Add missing fatsData export
export const fatsData = [
  { name: "Unsaturated", value: 65, color: "#2196f3" },
  { name: "Saturated", value: 25, color: "#ff9800" },
  { name: "Trans", value: 10, color: "#f44336" }
];

// Enhance macroItems to include Nutri-Score for all items
export const macroItems = [
  {
    title: "Balanced Macro Distribution",
    description: "Ideal balance of proteins, carbohydrates, and fats for general health",
    data: [
      { name: "Protein", value: 30, color: "#8884d8" },
      { name: "Carbs", value: 40, color: "#82ca9d" },
      { name: "Fat", value: 30, color: "#ffc658" }
    ],
    nutriScore: "A" as const
  },
  {
    title: "High Protein Diet",
    description: "Optimized for muscle building and recovery",
    data: [
      { name: "Protein", value: 40, color: "#8884d8" },
      { name: "Carbs", value: 30, color: "#82ca9d" },
      { name: "Fat", value: 30, color: "#ffc658" }
    ],
    special: true,
    nutriScore: "B" as const
  },
  {
    title: "Complete Nutritional Profile",
    description: "Detailed breakdown of all nutritional components",
    data: [
      { name: "Protein", value: 25, color: "#8884d8" },
      { name: "Carbs", value: 45, color: "#82ca9d" },
      { name: "Fat", value: 30, color: "#ffc658" }
    ],
    showMicronutrients: true,
    micronutrientsData: {
      vitamins: {
        title: "Vitamins",
        items: [
          {
            name: "Vitamin A",
            value: "750 μg",
            percentage: "83%",
            color: "#4CAF50"
          },
          {
            name: "Vitamin C",
            value: "45 mg",
            percentage: "50%",
            color: "#FFC107"
          },
          {
            name: "Vitamin D",
            value: "5 μg",
            percentage: "25%",
            color: "#FF9800"
          },
          {
            name: "Vitamin E",
            value: "15 mg",
            percentage: "100%",
            color: "#4CAF50"
          }
        ]
      },
      minerals: {
        title: "Minerals",
        items: [
          {
            name: "Calcium",
            value: "300 mg",
            percentage: "30%",
            color: "#FF9800"
          },
          {
            name: "Iron",
            value: "8 mg",
            percentage: "45%",
            color: "#FFC107"
          },
          {
            name: "Magnesium",
            value: "120 mg",
            percentage: "30%",
            color: "#FF9800"
          },
          {
            name: "Zinc",
            value: "5 mg",
            percentage: "45%",
            color: "#FFC107"
          }
        ]
      }
    },
    nutriScore: "A" as const
  }
];
