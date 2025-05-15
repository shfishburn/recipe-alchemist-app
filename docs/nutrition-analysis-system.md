
# Nutrition Analysis System

This document details the Nutrition Analysis system, which calculates, visualizes, and explains nutritional information for recipes.

## System Overview

The Nutrition Analysis system provides comprehensive nutritional information by:
- Analyzing recipe ingredients to calculate nutritional values
- Visualizing macronutrient distribution
- Displaying micronutrient content
- Calculating NutriScore for overall nutritional quality
- Offering personalized nutrition insights

## Key Components

### 1. Nutrition Calculation Engine

The system calculates nutrition data through:
- Ingredient analysis and normalization
- USDA food database integration
- Serving size calculations
- Cooking method yield adjustments

### 2. Visualization Components

Multiple components visualize nutritional data:
- `MacroDistributionPie`: Shows macronutrient ratios
- `NutritionChart`: Displays nutrient values with comparisons
- `NutritionSummary`: Provides text summary of key values
- `MicronutrientsDisplay`: Shows vitamin and mineral content

### 3. NutriScore System

The system calculates and displays NutriScore ratings:
- Processes recipe data using EU NutriScore algorithm
- Assigns letter grade (A-E) based on nutritional quality
- Provides detailed breakdown of positive and negative points
- Visualizes score with color-coded badge

## Data Model

### Nutrition Type

```typescript
interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  data_quality?: NutritionDataQuality;
  per_ingredient?: Record<string, Nutrition>;
  audit_log?: NutritionAuditLog[];
}

interface NutriScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  category: 'food' | 'beverage';
  negative_points: {
    energy: number | null;
    sugars: number | null;
    sodium: number | null;
    saturated_fat: number | null;
    total: number | null;
  };
  positive_points: {
    fiber: number | null;
    protein: number | null;
    fruit_veg_nuts: number | null;
    total: number | null;
  };
  calculated_at: string | null;
  calculation_version: string;
}
```

## Data Flow

### 1. Nutrition Calculation

The nutrition calculation process:
1. Recipe ingredients are matched to USDA food database entries
2. Quantities are normalized to standard units
3. Nutritional values are calculated per ingredient
4. Values are summed and adjusted for cooking methods
5. Per-serving values are calculated

### 2. Data Standardization

All nutrition data undergoes standardization:
- Units are normalized (mg, g, etc.)
- Null values are handled with appropriate defaults
- Data quality indicators are assigned
- Confidence scores reflect data reliability

### 3. Display Processing

Before display, the data is processed:
- Daily value percentages are calculated
- Color coding is applied based on nutritional quality
- Key insights are extracted for summary display
- Personalization is applied based on user profiles

## Key Features

### 1. Macronutrient Analysis

The system provides detailed macronutrient information:
- Calorie content per serving
- Protein, carbohydrate, and fat distribution
- Fiber and sugar content
- Percentage of calories from each macronutrient

### 2. Micronutrient Analysis

Comprehensive micronutrient data includes:
- Vitamin content (A, C, D, etc.)
- Mineral content (calcium, iron, potassium, etc.)
- Percentage of daily recommended values
- Color coding for nutrient adequacy

### 3. NutriScore Calculation

The NutriScore calculation process:
1. Negative points are assigned for calories, sugar, sodium, and saturated fat
2. Positive points are assigned for protein, fiber, and fruits/vegetables
3. Total score is calculated according to EU formula
4. Letter grade is assigned based on score thresholds

### 4. Personalized Nutrition

The system can personalize nutrition information:
- Adjusts daily value percentages based on user profile
- Highlights nutrients relevant to user dietary goals
- Flags potential allergens based on user preferences
- Provides tailored nutritional insights

## Implementation

### Nutrition API Integration

The system interfaces with multiple data sources:
- USDA Food Database for standard nutritional values
- Semantic matching for ingredient identification
- Supabase database for cached nutrition data
- Nutrition fusion algorithm for combining data sources

### Database Design

Nutrition data is stored efficiently:
- `recipes` table includes JSON fields for nutrition data
- `ingredient_nutrition_fused` table stores pre-calculated values
- `nutrition_feedback` table collects user feedback

### User Interface

The nutrition UI emphasizes clarity and insight:
- Color-coded visualizations for intuitive understanding
- Progressive disclosure for detailed information
- Responsive design for different device sizes
- Accessibility features for screen readers

## Performance Optimizations

The Nutrition Analysis system optimizes performance through:

1. **Data Caching**:
   - Calculated nutrition values are cached in the database
   - Client-side caching using React Query
   - Progressive data loading based on visibility

2. **Computational Efficiency**:
   - Pre-calculated values for common ingredients
   - Batch processing for multiple ingredients
   - Memoization of expensive calculations

## Future Enhancements

Planned improvements to the Nutrition Analysis system:

1. **Enhanced Accuracy**:
   - Improved ingredient matching algorithms
   - More comprehensive USDA data integration
   - User feedback loops for data correction

2. **Advanced Personalization**:
   - Integration with health tracking devices
   - Meal planning recommendations based on nutritional needs
   - Adaptive daily value calculations based on activity level

3. **Expanded Visualizations**:
   - Time-based nutrition tracking
   - Comparative analysis between recipes
   - Detailed breakdown of nutrient sources
