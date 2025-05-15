# Code Structure

This document provides an overview of the Recipe Alchemy codebase organization, architectural patterns, and coding conventions.

## Directory Structure

Recipe Alchemy follows a feature-based organization with these top-level directories:

```
recipe-alchemy/
├── docs/                # Documentation
├── public/              # Static assets
├── src/                 # Source code
│   ├── api/             # API clients
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── supabase/            # Backend functions
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
└── tests/               # Test utilities and fixtures
```

## Component Organization

Components are organized by feature area:

```
src/components/
├── auth/               # Authentication components
├── common/             # Shared utility components 
├── layout/             # Layout components
├── profile/            # User profile components
├── quick-recipe/       # Recipe generation components
├── recipe-chat/        # Recipe chat components
├── recipe-detail/      # Recipe viewing components
├── shopping-list/      # Shopping list components
└── ui/                 # UI component library
```

### Component Structure

Individual component folders follow this pattern:

```
ComponentName/
├── index.ts                    # Export file
├── ComponentName.tsx           # Main component
├── ComponentName.test.tsx      # Tests
├── ComponentName.module.css    # (If needed) Component-specific styles
└── sub-components/             # (If needed) Child components
```

## Architectural Patterns

### Component Architecture

Recipe Alchemy follows these component patterns:

1. **Component Composition**
   - Small, focused components
   - Composition over inheritance
   - Container/Presenter pattern for complex views

2. **State Management**
   - Local state with useState for component-specific state
   - Zustand for global UI state
   - React Query for server state
   - Context for theme and user settings

3. **Data Flow**
   - Props for parent-child communication
   - Custom events for child-parent communication
   - Global state for cross-component communication

### Custom Hooks

Shared logic is extracted into custom hooks:

```
src/hooks/
├── recipe-chat/          # Chat-related hooks
├── recipe-modifications/ # Recipe modification hooks
├── shopping-list/        # Shopping list hooks
└── use-*.ts              # General purpose hooks
```

Example hook structure:

```typescript
// src/hooks/use-recipe-detail.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipe } from '../api/recipes';

export function useRecipeDetail(recipeId: string) {
  // Hook implementation
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipe(recipeId),
  });

  // Additional logic

  return {
    recipe: data,
    isLoading,
    error,
    // Other values and functions
  };
}
```

## State Management

Recipe Alchemy uses a hybrid state management approach:

### React Query for Server State

```typescript
// Example React Query usage
const { data: recipes, isLoading } = useQuery({
  queryKey: ['recipes', filters],
  queryFn: () => fetchRecipes(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Zustand for UI State

```typescript
// src/store/use-quick-recipe-store.ts
import create from 'zustand';

interface QuickRecipeState {
  ingredients: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (index: number) => void;
  clearIngredients: () => void;
}

export const useQuickRecipeStore = create<QuickRecipeState>((set) => ({
  ingredients: [],
  addIngredient: (ingredient) => 
    set((state) => ({ 
      ingredients: [...state.ingredients, ingredient] 
    })),
  removeIngredient: (index) => 
    set((state) => ({ 
      ingredients: state.ingredients.filter((_, i) => i !== index) 
    })),
  clearIngredients: () => set({ ingredients: [] }),
}));
```

### Context API for Theme and Settings

```typescript
// src/contexts/ProfileContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ProfileContextType {
  // Context values and functions
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }) {
  // Provider implementation
  
  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
```

## API Integration

API clients are organized by feature:

```
src/api/
├── fetch-quick-recipe.ts      # Recipe generation API
├── generate-quick-recipe.ts   # Recipe creation API
├── supabaseFunctionClient.ts  # Supabase client
└── quick-recipe/              # Recipe-related utilities
    ├── api-utils.ts           # API helpers
    ├── error-utils.ts         # Error handling
    ├── format-utils.ts        # Response formatting
    └── timeout-utils.ts       # Timeout handling
```

Example API client:

```typescript
// src/api/generate-quick-recipe.ts
import { supabaseFunctionClient } from './supabaseFunctionClient';
import type { GenerateRecipeRequest, GenerateRecipeResponse } from '../types/quick-recipe';

export async function generateQuickRecipe(request: GenerateRecipeRequest): Promise<GenerateRecipeResponse> {
  try {
    const { data, error } = await supabaseFunctionClient
      .invoke('generate-quick-recipe', { body: request });
    
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    // Error handling
    throw error;
  }
}
```

## Edge Functions

Supabase Edge Functions handle backend operations:

```
supabase/functions/
├── _shared/                        # Shared utilities
├── generate-quick-recipe/          # Recipe generation
│   ├── index.ts                    # Entry point
│   ├── openai-client.ts            # OpenAI integration
│   ├── prompt-builder.ts           # Prompt construction
│   ├── request-handler.ts          # Request processing
│   ├── request-processor.ts        # Business logic
│   └── validation.ts               # Request validation
├── modify-quick-recipe/            # Recipe modification
├── nutrisynth-analysis/            # Nutrition calculation
└── recipe-chat/                    # Recipe chat system
```

Example Edge Function structure:

```typescript
// supabase/functions/generate-quick-recipe/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleRequest } from './request-handler.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // CORS handling for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Process the request
    const response = await handleRequest(req);
    return response;
  } catch (error) {
    // Error handling
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

## Type System

TypeScript types are organized by domain:

```
src/types/
├── chat.ts               # Chat-related types
├── nutrition.ts          # Nutrition-related types
├── quick-recipe.ts       # Recipe generation types
├── recipe.ts             # Recipe data model
└── shopping-list.ts      # Shopping list types
```

Example type definitions:

```typescript
// src/types/quick-recipe.ts
export interface GenerateRecipeRequest {
  ingredients: string[];
  cuisine?: string;
  dietary?: string[];
  servings?: number;
}

export interface GenerateRecipeResponse {
  recipe: RecipeData;
  nutrition: NutritionData;
  error?: string;
}

export interface RecipeData {
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  // Additional fields
}

// Additional type definitions
```

## Utility Functions

Utility functions are organized by purpose:

```
src/utils/
├── ai-nutrition/            # Nutrition processing utilities
├── ingredient-format.ts     # Ingredient formatting
├── nutrition-utils.ts       # Nutrition calculations
├── recipe-normalization.ts  # Recipe data normalization
├── shopping-list-utils.ts   # Shopping list helpers
└── slug-utils.ts            # URL slug utilities
```

Example utility function:

```typescript
// src/utils/ingredient-format.ts
export function formatIngredient(ingredient: Ingredient): string {
  const { quantity, unit, name, preparation } = ingredient;
  
  let formatted = '';
  if (quantity) formatted += quantity + ' ';
  if (unit) formatted += unit + ' ';
  formatted += name;
  if (preparation) formatted += `, ${preparation}`;
  
  return formatted;
}
```

## Styling Approach

The application uses a combination of:

1. **Tailwind CSS**: For component styling
2. **CSS Modules**: For component-specific styles
3. **Global CSS**: For theming and base styles

Style organization:

```
src/styles/
├── index.css           # Entry point for styles
├── main.css            # Global styles
├── theme.css           # Theme variables
├── components.css      # Component styles
├── layout.css          # Layout utilities
├── buttons.css         # Button styles
├── forms.css           # Form styles
├── cards.css           # Card styles
└── scientific-content.css # Science content styling
```

## Related Documentation

- [Getting Started](./getting-started.md) - Development environment setup
- [Contribution Guide](./contribution-guide.md) - Contribution workflow
- [Testing Strategy](./testing-strategy.md) - Testing approach
- [System Architecture](../architecture/system-architecture.md) - Overall system design
