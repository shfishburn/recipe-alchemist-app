
# Science Analysis System

This document details the Science Analysis system, which provides scientific explanations for cooking processes and techniques in recipes.

## System Overview

The Science Analysis system enriches recipes with scientific context by:
- Analyzing cooking steps for scientific phenomena
- Identifying chemical reactions in cooking processes
- Explaining temperature effects on ingredients
- Providing educational content about food science

## Key Components

### 1. Science Notes

The `ScienceNotes` component displays scientific explanations for the recipe:
- General scientific principles related to the recipe
- Explanations of flavor chemistry
- Information about texture development
- Nutritional transformations during cooking

### 2. Step Reactions Analysis

The system analyzes individual recipe steps for scientific phenomena:
- Chemical reactions (Maillard browning, caramelization, etc.)
- Physical transformations (protein denaturation, starch gelatinization)
- Flavor development processes
- Texture changes

### 3. Recipe Analysis Backend

The system uses AI to generate scientific insights:
- Analyzes recipe instructions and ingredients
- Identifies relevant scientific principles
- Generates explanations tailored to the specific recipe

## Data Model

### Step Reaction Type

```typescript
interface RecipeStepReaction {
  id: string;
  recipe_id: string;
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: ReactionDetail[];
  cooking_method?: string;
  temperature_celsius?: number;
  duration_minutes?: number;
  chemical_systems?: any;
  thermal_engineering?: any;
  process_parameters?: any;
  ingredient_context?: string[];
  confidence: number;
  created_at: string;
  updated_at: string;
}

interface ReactionDetail {
  type: string;
  name: string;
  description: string;
  temperature_range?: {
    min: number;
    max: number;
    unit: string;
  };
  time_range?: {
    min: number;
    max: number;
    unit: string;
  };
  ingredients_involved?: string[];
  scientific_explanation: string;
}
```

## Data Flow

### 1. Analysis Generation

The analysis process follows these steps:
1. Recipe is submitted for analysis (automatic or on-demand)
2. Edge function processes the recipe
3. OpenAI analyzes cooking steps and generates scientific explanations
4. Structured data is saved to the database

### 2. Analysis Display

The frontend retrieves and displays the analysis:
1. `useRecipeAnalysisData` hook fetches analysis data
2. Analysis is processed and categorized
3. UI components render different aspects of the analysis
4. Interactive elements allow users to explore details

## Key Features

### 1. Global Recipe Analysis

The `GlobalAnalysis` component provides:
- Overall scientific principles at work in the recipe
- Main chemical reactions and physical processes
- Key temperature-dependent transformations

### 2. Step-by-Step Science

For each cooking step, the system offers:
- Specific reactions occurring during that step
- Ingredients involved in those reactions
- Temperature and time factors affecting the outcome
- Scientific explanation of why the step is important

### 3. Visualization Tools

The system includes visual components:
- Temperature-reaction relationship charts
- Process diagrams for complex transformations
- Timeline visualizations of changes during cooking

## Implementation

### AI Integration

The system uses OpenAI for scientific analysis:
- Custom prompts designed for scientific accuracy
- Temperature settings optimized for factual content
- Domain-specific context to improve relevance

### Database Storage

Analyses are stored in the Supabase database:
- `recipe_step_reactions` table for step-specific data
- JSON fields for flexible reaction data storage
- Linked to recipe IDs for efficient retrieval

### User Interface

The UI is designed for educational engagement:
- Collapsible sections for detailed explanations
- Scientific terminology with accessible definitions
- Visual aids for complex concepts

## Performance Considerations

The Science Analysis system addresses performance through:
1. **Caching**:
   - Analysis results are cached to prevent redundant generation
   - React Query manages data fetching and caching

2. **Progressive Loading**:
   - Basic recipe information loads first
   - Scientific content loads progressively
   - Lazy loading for detailed explanations

## Future Enhancements

Planned improvements to the Science Analysis system:

1. **Interactive Simulations**:
   - Visual simulations of chemical reactions
   - Interactive models of temperature effects

2. **Enhanced Media Integration**:
   - Microscopic images of food transformations
   - Video clips demonstrating scientific principles

3. **Personalized Learning Depth**:
   - Adjustable depth of scientific explanations
   - Tailoring content to user knowledge level
